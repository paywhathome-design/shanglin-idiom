// ============================================================================
// 上林成語小鎮 - 每日每人專屬隨機出題引擎（日期 × 學生 ID 獨立亂數種子）
// 串接：低年級 30 部動畫 + 40 題白話看圖配對 + 130+ 數字成語
//       中年級 180+ 生活對話 + 140+ 動植物自然成語
//       高年級 100+ 新聞抓漏王 + 45 則歷史典故故事 + 578 成語微寫作推薦
// ============================================================================
window.DailyContentPack = (function () {
  function hashSeed(str) {
    let h = 2166136261 >>> 0;
    for (let i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }

  function createRng(seedText) {
    let a = hashSeed(seedText) || 123456789;
    return function () {
      a = (a + 0x6d2b79f5) >>> 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function seededShuffle(arr, rng) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      const tmp = a[i];
      a[i] = a[j];
      a[j] = tmp;
    }
    return a;
  }

  function todayStr() {
    const d = new Date();
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  }

  function buildDailyPackForStudent(student, baseCurriculum, dateStr) {
    const day = dateStr || todayStr();
    const stuKey = `${day}::${student.id || student.name}`;
    const rng = createRng(stuKey);
    const bank = window.IdiomBank500;
    const low30 = window.LowGradeContent30;
    const high45 = window.HighGradeStories45;
    const result = JSON.parse(JSON.stringify(baseCurriculum || {}));
    result.assignedDate = day;

    if (student.band === "low") {
      // 1. 低年級 1 分鐘動畫：每天每人從 30 部兒童口語動畫隨機抽選 1 部
      const animPool = (low30 && low30.ANIMATIONS_30) || [];
      if (animPool.length) {
        const pickedAnim = seededShuffle(animPool, rng)[0];
        const extUrl = "https://www.youtube.com/results?search_query=" + encodeURIComponent(pickedAnim.idiom + " 成語動畫");
        result.animations = [
          {
            id: pickedAnim.id,
            idiom: pickedAnim.idiom,
            zhuyin: pickedAnim.zhuyin,
            durationSec: 60,
            moral: pickedAnim.moral,
            externalUrl: extUrl,
            scenes: pickedAnim.scenes.map((sc) => ({
              sceneKey: sc.sceneKey,
              icon: sc.icon,
              title: sc.title,
              idiom: pickedAnim.idiom,
              durationSec: 15,
              caption: sc.caption,
              narration: sc.caption
            }))
          }
        ];
      }

      // 2. 低年級「看圖選成語」：每天每人從 40 題低年級白話專屬看圖題庫隨機抽選 2 題不同成語
      const picPool = (low30 && low30.LOW_PIC_QUIZZES_40) || [];
      if (picPool.length) {
        const pickedPics = seededShuffle(picPool, rng).slice(0, 2);
        result.pictureMatches = pickedPics.map((q, idx) => ({
          id: `day-pm-${day}-${student.id}-${idx}-${q.answer}`,
          illustrationKey: q.illustrationKey,
          icon: q.icon,
          prompt: q.prompt,
          options: seededShuffle(q.options, rng),
          answer: q.answer,
          explanation: q.explanation
        }));
      }

      // 3. 低年級數字成語小遊戲：每天每人從 130+ 數字成語隨機抽選 3 題
      const NUM_CHARS = ["一", "二", "兩", "三", "四", "五", "六", "七", "八", "九", "十", "百", "千", "萬", "半"];
      const numPool = bank ? seededShuffle(bank.ALL_IDIOMS.filter((x) => x.cat === "num"), rng) : [];
      const numGames = [];
      for (let i = 0; i < numPool.length && numGames.length < 3; i++) {
        const item = numPool[i];
        const chars = Array.from(item.idiom);
        const blanks = [];
        const answers = [];
        chars.forEach((ch, ci) => {
          if (NUM_CHARS.includes(ch) && blanks.length < 2) {
            blanks.push(ci);
            answers.push(ch);
          }
        });
        if (!blanks.length) continue;
        const template = chars.map((ch, ci) => (blanks.includes(ci) ? "_" : ch));
        const choiceSet = new Set(answers);
        const shuffledNums = seededShuffle(NUM_CHARS, rng);
        for (let k = 0; k < shuffledNums.length && choiceSet.size < 4; k++) choiceSet.add(shuffledNums[k]);
        numGames.push({
          id: `day-num-${day}-${student.id}-${item.idiom}`,
          template,
          blanks,
          answers,
          choices: seededShuffle(Array.from(choiceSet), rng),
          fullIdiom: item.idiom,
          hint: item.meaning,
          example: `「${item.idiom}」的意思是：${item.meaning}`
        });
      }
      result.numberGames = numGames;
    } else if (student.band === "mid") {
      // 1. 中年級生活對話選成語：每天每人自動從 180+ 生活勵志典故成語隨機派發 2 題
      const lifePool = bank ? bank.ALL_IDIOMS.filter((x) => x.cat === "life" || x.cat === "study" || x.cat === "story") : [];
      const pickedLife = seededShuffle(lifePool, rng).slice(0, 2);
      const dialogueScenarios = [
        (itm) => ({
          sceneTitle: "教室裡的閱讀分享課",
          illustrationKey: "classroom-art",
          lines: [
            { speaker: "小晴", avatar: "girl", text: `剛剛老師說了一個很有意思的詞，意思是「${itm.meaning}」，可是我一時想不起來怎麼寫！` },
            { speaker: "同學", avatar: "boy", text: "哈哈，我知道！放進【 ＿＿＿＿ 】這個成語就完全正確啦！" }
          ]
        }),
        (itm) => ({
          sceneTitle: "上林校園操場聊聊天",
          illustrationKey: "playground-run",
          lines: [
            { speaker: "老師", avatar: "teacher", text: `各位同學，如果要用一個四字成語來表達「${itm.meaning}」，大家覺得哪個最貼切？` },
            { speaker: "班長", avatar: "boy", text: "報告老師！我用【 ＿＿＿＿ 】來形容最傳神了！" }
          ]
        }),
        (itm) => ({
          sceneTitle: "放學後的公園步道",
          illustrationKey: "spring-park",
          lines: [
            { speaker: "妹妹", avatar: "girl", text: `今天聯絡簿小日記我想表達「${itm.meaning}」，應該用哪個成語才好呢？` },
            { speaker: "姊姊", avatar: "teacher", text: "寫上【 ＿＿＿＿ 】，老師一定會給妳一個大大的讚喔！" }
          ]
        })
      ];
      result.dialogues = pickedLife.map((item, idx) => {
        const sc = dialogueScenarios[(idx + Math.floor(rng() * 3)) % dialogueScenarios.length](item);
        const distractors = seededShuffle(lifePool.filter((x) => x.idiom !== item.idiom), rng)
          .slice(0, 3)
          .map((x) => x.idiom);
        return {
          id: `day-dlg-${day}-${student.id}-${idx}-${item.idiom}`,
          sceneTitle: sc.sceneTitle,
          illustrationKey: sc.illustrationKey,
          lines: sc.lines,
          options: seededShuffle([item.idiom].concat(distractors), rng),
          answer: item.idiom,
          explanation: `「${item.idiom}」：${item.meaning}`
        };
      });

      // 2. 中年級動植物成語小遊戲：每天每人從 140+ 動植物自然成語隨機派發 3 題
      const natPool = bank ? bank.ALL_IDIOMS.filter((x) => x.cat === "nature") : [];
      result.natureGames = seededShuffle(natPool, rng)
        .slice(0, 3)
        .map((item, idx) => {
          const distractors = seededShuffle(natPool.filter((x) => x.idiom !== item.idiom), rng)
            .slice(0, 3)
            .map((x) => x.idiom);
          return {
            id: `day-nat-${day}-${student.id}-${idx}-${item.idiom}`,
            category: "動植物與自然",
            badgeIcon: item.extra || "🌿✨",
            clue: item.meaning,
            options: seededShuffle([item.idiom].concat(distractors), rng),
            answer: item.idiom,
            explanation: `「${item.idiom}」：${item.meaning}`
          };
        });
    } else {
      // 1. 高年級新聞抓漏王：每天每人從 100+ 易錯成語隨機派發 2 題
      const bugPool = bank ? bank.ALL_IDIOMS.filter((x) => x.cat === "bug" && x.wrongSeg && x.wrongSeg !== x.idiom) : [];
      const categories = ["校園特派快報", "上林語文糾察隊", "體育速報", "科學特派", "藝文快訊"];
      const headlineTpls = [
        (w) => `上林國小校慶活動熱鬧展開，小小記者報導時卻不小心將成語誤寫成「${w}」！`,
        (w) => `本週校園週報提醒同學閱讀時要睜大雙眼，標題裡的「${w}」其實藏著一個錯別字！`,
        (w) => `班級閱讀分享會好評不斷，報導寫道「同學們的表現真是${w}」，請快來幫稿件抓漏！`,
        (w) => `自然與藝術特派快訊：編輯趕稿時誤植了「${w}」，請點出寫錯的成語並修正！`
      ];

      const pickedBugs = seededShuffle(bugPool, rng)
        .slice(0, 2)
        .map((item, idx) => {
          const headline = headlineTpls[(idx + Math.floor(rng() * headlineTpls.length)) % headlineTpls.length](item.wrongSeg);
          const wrongIdx = headline.indexOf(item.wrongSeg);
          let wrongChar = item.wrongSeg[0];
          let correctChar = item.idiom[0];
          let wrongCharIndex = wrongIdx;
          for (let k = 0; k < 4; k++) {
            if (item.wrongSeg[k] !== item.idiom[k]) {
              wrongChar = item.wrongSeg[k];
              correctChar = item.idiom[k];
              wrongCharIndex = wrongIdx + k;
              break;
            }
          }
          const optSet = new Set([item.idiom, item.wrongSeg]);
          seededShuffle(bugPool.filter((x) => x.idiom !== item.idiom), rng)
            .slice(0, 2)
            .forEach((d) => optSet.add(d.idiom));
          return {
            id: `day-news-${day}-${student.id}-${idx}-${item.idiom}`,
            category: categories[(idx + Math.floor(rng() * categories.length)) % categories.length],
            headline,
            wrongSegment: item.wrongSeg,
            wrongCharIndex,
            wrongChar,
            correctSegment: item.idiom,
            correctChar,
            options: seededShuffle(Array.from(optSet), rng),
            explanation: `「${item.idiom}」：${item.meaning} ${item.wrongExplain}`
          };
        });
      result.newsBugs = pickedBugs;

      // 2. 高年級「聽我說故事」：每天每人從 45 則完整歷史典故隨機派發 1 則
      const storyPool = (high45 && high45.STORIES_45) || [];
      if (storyPool.length) {
        const pickedStory = seededShuffle(storyPool, rng)[0];
        result.story = {
          id: `${pickedStory.id}-${day}-${student.id}`,
          idiom: pickedStory.idiom,
          dynasty: pickedStory.dynasty,
          hero: pickedStory.hero,
          summary: pickedStory.summary,
          paragraphs: pickedStory.paragraphs,
          quiz: {
            question: pickedStory.quiz.question,
            options: seededShuffle(pickedStory.quiz.options, rng),
            answer: pickedStory.quiz.answer,
            explanation: pickedStory.quiz.explanation
          }
        };

        const extraRandom = bank ? seededShuffle(bank.ALL_IDIOMS, rng)[0].idiom : "持之以恆";
        const altSet = Array.from(new Set([pickedBugs[0]?.correctSegment, pickedBugs[1]?.correctSegment, extraRandom].filter(Boolean)));
        result.microWritingPrompt = {
          idiom: pickedStory.idiom,
          altIdioms: altSet,
          guide: `請運用本日專屬隨機成語「${pickedStory.idiom}」（或「${altSet.join("」、「")}」）寫一句 10 字以上的創意生活造句，送出後再到下方幫 2 位同學的作品按愛心吧！`
        };
      }
    }

    return result;
  }

  return { buildDailyPackForStudent };
})();
