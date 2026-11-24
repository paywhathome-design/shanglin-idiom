// ============================================================================
// 上林成語小鎮 - 低、中、高年段「每日 5 分鐘」成語打卡任務互動引擎
// 強化：每題答對即時更新本地與伺服器進度、明確題目進度條、防重複計分與無跳動更新
// ============================================================================
window.StudentTasks = (function () {
  const { toArray, Sound, Speech, showToast } = window.IdiomAPI;

  let ctx = {
    student: null,
    curriculum: null,
    writings: [],
    onStateUpdated: null
  };

  let lowState = {
    step: "anim",
    animIdx: 0,
    sceneIdx: 0,
    playing: false,
    timerId: null,
    elapsedSec: 0,
    matchIdx: 0,
    matchFeedback: null,
    solvedMatchIds: new Set(),
    numIdx: 0,
    numFilled: [],
    numFeedback: null,
    solvedNumIds: new Set()
  };

  let midState = {
    step: "dialogue",
    dlgIdx: 0,
    dlgFeedback: null,
    solvedDlgIds: new Set(),
    natIdx: 0,
    natFeedback: null,
    solvedNatIds: new Set()
  };

  let highState = {
    stage: 1,
    subTab1: "news",
    newsIdx: 0,
    spottedWrong: false,
    newsFixed: false,
    newsFeedback: null,
    solvedNewsIds: new Set(),
    storyFeedback: null,
    storyReading: false,
    selectedIdiom: "破釜沉舟",
    writingFilter: "全校",
    lastWritingsSig: ""
  };

  function stopMedia() {
    if (lowState.timerId) {
      clearInterval(lowState.timerId);
      lowState.timerId = null;
    }
    lowState.playing = false;
    highState.storyReading = false;
    Speech.stop();
  }

  function ensureProgressObj() {
    if (!ctx.student.todayProgress) {
      ctx.student.todayProgress = {};
    }
    return ctx.student.todayProgress;
  }

  function init(student, curriculum, writings, onStateUpdated) {
    stopMedia();
    ctx.student = student;
    ctx.curriculum = JSON.parse(JSON.stringify(curriculum || {}));
    ctx.writings = toArray(writings);
    ctx.onStateUpdated = onStateUpdated;

    // 若頁面載入每日每人隨機引擎 (index2.html)，依「日期 × 學生 ID」自動派發專屬不重複的當日成語題目！
    if (window.DailyContentPack) {
      ctx.curriculum = window.DailyContentPack.buildDailyPackForStudent(student, ctx.curriculum);
    } else if (window.IdiomBank500) {
      if (student.band === "low") {
        const extraNums = window.IdiomBank500.generateNumberGames(40);
        if (extraNums.length) ctx.curriculum.numberGames = extraNums;
      } else if (student.band === "mid") {
        ctx.curriculum.dialogues = window.IdiomBank500.generateDialogueQuestions(toArray(ctx.curriculum.dialogues), 30);
        const extraNats = window.IdiomBank500.generateNatureGames(40);
        if (extraNats.length) ctx.curriculum.natureGames = extraNats;
      } else {
        ctx.curriculum.newsBugs = window.IdiomBank500.generateNewsBugs(toArray(ctx.curriculum.newsBugs), 40);
      }
    }

    const p = ensureProgressObj();

    // 重置本輪作答狀態
    lowState.solvedMatchIds = new Set();
    lowState.solvedNumIds = new Set();
    midState.solvedDlgIds = new Set();
    midState.solvedNatIds = new Set();
    highState.solvedNewsIds = new Set();

    if (student.band === "low") {
      const mCnt = Number(p.pictureMatchCount || 0);
      const nCnt = Number(p.numberGameCount || 0);
      lowState.matchIdx = Math.min(mCnt, Math.max(0, toArray(curriculum.pictureMatches).length - 1));
      lowState.numIdx = Math.min(nCnt, Math.max(0, toArray(curriculum.numberGames).length - 1));
      lowState.numFilled = [];
      lowState.matchFeedback = null;
      lowState.numFeedback = null;
      if (!p.animationDone) lowState.step = "anim";
      else if (mCnt < 2) lowState.step = "match";
      else lowState.step = "number";
    } else if (student.band === "mid") {
      const dCnt = Number(p.dialogueCount || 0);
      const natCnt = Number(p.natureGameCount || 0);
      midState.dlgIdx = Math.min(dCnt, Math.max(0, toArray(curriculum.dialogues).length - 1));
      midState.natIdx = Math.min(natCnt, Math.max(0, toArray(curriculum.natureGames).length - 1));
      midState.dlgFeedback = null;
      midState.natFeedback = null;
      midState.step = dCnt < 2 ? "dialogue" : "nature";
    } else {
      const nbCnt = Number(p.newsBugCount || 0);
      highState.newsIdx = Math.min(nbCnt, Math.max(0, toArray(curriculum.newsBugs).length - 1));
      highState.spottedWrong = false;
      highState.newsFixed = false;
      highState.newsFeedback = null;
      highState.storyFeedback = null;
      const stage1Done = nbCnt >= 2 && Boolean(p.storyDone);
      highState.stage = stage1Done ? 2 : 1;
      highState.subTab1 = nbCnt >= 2 ? "story" : "news";
      highState.selectedIdiom = (curriculum.microWritingPrompt && curriculum.microWritingPrompt.idiom) || "破釜沉舟";
      highState.lastWritingsSig = JSON.stringify(ctx.writings);
    }
    render();
  }

  function updateWritings(writings) {
    const arr = toArray(writings);
    const sig = JSON.stringify(arr);
    if (sig === highState.lastWritingsSig) return;
    highState.lastWritingsSig = sig;
    ctx.writings = arr;
    if (ctx.student && ctx.student.band === "high" && highState.stage === 2) {
      const wall = document.getElementById("writingsWallContainer");
      if (wall) {
        wall.innerHTML = renderWritingsWallHtml();
        bindWritingWallEvents();
      }
    }
  }

  function syncStudent(student) {
    if (student) ctx.student = student;
  }

  function escapeHtml(str) {
    return String(str || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function renderProgressBar(current, target, label) {
    const safeCur = Math.min(target, Math.max(0, Number(current || 0)));
    const pct = Math.round((safeCur / target) * 100);
    return `
      <div style="margin-bottom:16px;">
        <div style="display:flex;justify-content:space-between;align-items:center;font-size:13.5px;font-weight:700;color:var(--ink-body);margin-bottom:6px;">
          <span>${escapeHtml(label)}</span>
          <span style="color:${safeCur >= target ? "#108552" : "var(--purple-deep)"};">答對進度 ${safeCur} / ${target} 題（${pct}%）</span>
        </div>
        <div class="rate-bar-wrap" style="height:12px;margin:0;">
          <div class="rate-bar-fill ${safeCur >= target ? "gold" : ""}" style="width:${pct}%"></div>
        </div>
      </div>
    `;
  }

  async function persistProgress(patch) {
    // 1. 立即同步更新本地進度，確保畫面百分百即時反映
    const p = ensureProgressObj();
    Object.keys(patch).forEach((k) => {
      if (typeof patch[k] === "number") {
        p[k] = Math.max(Number(p[k] || 0), patch[k]);
      } else {
        p[k] = patch[k];
      }
    });
    render();

    // 2. 寫入後端或單機資料庫，並檢查打卡完成與獎勵觸發
    try {
      const res = await window.IdiomAPI.saveProgress(patch);
      if (res && res.student) {
        ctx.student = res.student;
      }
      if (ctx.onStateUpdated) ctx.onStateUpdated(res);
      render();
    } catch (err) {
      showToast(err.message);
    }
  }

  function render() {
    const container = document.getElementById("dailyTaskWorkspace");
    if (!container || !ctx.student || !ctx.curriculum) return;

    if (ctx.student.band === "low") renderLowGrade(container);
    else if (ctx.student.band === "mid") renderMidGrade(container);
    else renderHighGrade(container);
  }

  // ==========================================================================
  // 一、低年級（1-2 年級）：1 分鐘成語動畫 + 2 題看圖配對 + 3 題數字成語遊戲
  // ==========================================================================
  function renderLowGrade(container) {
    const p = ensureProgressObj();
    const animDone = Boolean(p.animationDone);
    const matchCount = Number(p.pictureMatchCount || 0);
    const numCount = Number(p.numberGameCount || 0);

    const stepperHtml = `
      <div class="task-stepper">
        <button type="button" class="step-chip ${lowState.step === "anim" ? "active" : ""} ${animDone ? "done" : ""}" data-low-step="anim">
          ${animDone ? "✅" : "🎬"} 任務 1・1 分鐘動畫 (${animDone ? "1/1" : "0/1"})
        </button>
        <button type="button" class="step-chip ${lowState.step === "match" ? "active" : ""} ${matchCount >= 2 ? "done" : ""}" data-low-step="match">
          ${matchCount >= 2 ? "✅" : "🖼️"} 任務 2・看圖選成語 (${Math.min(matchCount, 2)}/2)
        </button>
        <button type="button" class="step-chip ${lowState.step === "number" ? "active" : ""} ${numCount >= 3 ? "done" : ""}" data-low-step="number">
          ${numCount >= 3 ? "✅" : "🔢"} 任務 3・數字成語遊戲 (${Math.min(numCount, 3)}/3)
        </button>
      </div>
    `;

    let bodyHtml = "";
    if (lowState.step === "anim") bodyHtml = renderLowAnimationCard(animDone);
    else if (lowState.step === "match") bodyHtml = renderLowPictureMatchCard(matchCount);
    else bodyHtml = renderLowNumberGameCard(numCount);

    container.innerHTML = stepperHtml + bodyHtml;

    container.querySelectorAll("[data-low-step]").forEach((btn) => {
      btn.addEventListener("click", () => {
        Sound.click();
        stopMedia();
        lowState.step = btn.dataset.lowStep;
        render();
      });
    });

    if (lowState.step === "anim") bindLowAnimationEvents();
    else if (lowState.step === "match") bindLowPictureMatchEvents();
    else bindLowNumberGameEvents();
  }

  function renderLowAnimationCard(animDone) {
    const anims = toArray(ctx.curriculum.animations);
    const anim = anims[lowState.animIdx] || anims[0];
    const scenes = toArray(anim.scenes);
    const scene = scenes[lowState.sceneIdx] || scenes[0];
    const pct = Math.min(100, Math.round((lowState.elapsedSec / anim.durationSec) * 100));

    return `
      <div class="task-card glass-card no-pop-anim">
        <div class="task-header">
          <div>
            <span class="pill-tag pill-purple">低年級任務 1・60 秒互動成語劇場</span>
            <h3 style="margin-top:8px;">🎬 ${escapeHtml(anim.idiom)} <small style="font-size:14px;color:var(--ink-muted);">${escapeHtml(anim.zhuyin)}</small></h3>
          </div>
          <div class="task-header-actions">
            <a class="btn btn-secondary" href="${escapeHtml(anim.externalUrl)}" target="_blank" rel="noopener noreferrer">
              📺 開啟外部成語動畫
            </a>
          </div>
        </div>

        ${
          anims.length > 1
            ? `<div class="anim-switcher">
                ${anims
                  .map(
                    (a, i) => `
                    <button type="button" class="btn ${i === lowState.animIdx ? "btn-primary" : "btn-chip"}" data-anim-pick="${i}">
                      🎬 ${escapeHtml(a.idiom)}
                    </button>`
                  )
                  .join("")}
              </div>`
            : `<div style="margin-bottom:12px;"><span class="pill-tag pill-blue">🎲 本日專屬隨機成語動畫（每日每位同學皆不同）</span></div>`
        }

        <div class="theater-box">
          <div class="theater-stage">
            <div class="theater-svg-wrap" id="theaterSvgWrap">
              ${window.IdiomArt.animationSceneSvg(scene.sceneKey, scene)}
            </div>
            <div class="theater-caption-box">
              <p id="theaterCaption">${escapeHtml(scene.caption)}</p>
            </div>
          </div>

          <div class="theater-progress-track">
            <div class="theater-progress-fill" id="theaterProgressFill" style="width:${pct}%"></div>
          </div>

          <div class="theater-controls">
            <div class="theater-btn-group">
              <button type="button" class="btn btn-primary" id="btnPlayAnim">
                ${lowState.playing ? "⏸ 暫停播放" : "▶️ 播放 1 分鐘動畫"}
              </button>
              <button type="button" class="btn btn-secondary" id="btnPrevScene">⏮ 上一幕</button>
              <button type="button" class="btn btn-secondary" id="btnNextScene">⏭ 下一幕</button>
              <span class="pill-tag pill-blue" id="theaterTimeTag">第 ${lowState.sceneIdx + 1} / ${scenes.length} 幕・${lowState.elapsedSec}s / ${anim.durationSec}s</span>
            </div>

            <div class="theater-btn-group">
              <button type="button" class="btn ${animDone ? "btn-mint" : "btn-pink"}" id="btnCompleteAnim">
                ${animDone ? "✅ 已完成觀看・前往看圖配對" : "✨ 我看完動畫囉，前往下一關"}
              </button>
            </div>
          </div>

          <div class="moral-callout">
            <strong>💡 星語小啟示：</strong>${escapeHtml(anim.moral)}
          </div>
        </div>
      </div>
    `;
  }

  function bindLowAnimationEvents() {
    const anims = toArray(ctx.curriculum.animations);
    const anim = anims[lowState.animIdx] || anims[0];
    const scenes = toArray(anim.scenes);

    document.querySelectorAll("[data-anim-pick]").forEach((btn) => {
      btn.addEventListener("click", () => {
        Sound.click();
        stopMedia();
        lowState.animIdx = Number(btn.dataset.animPick);
        lowState.sceneIdx = 0;
        lowState.elapsedSec = 0;
        render();
      });
    });

    const speakCurrent = () => {
      const sc = scenes[lowState.sceneIdx];
      if (sc) Speech.speak(sc.narration);
    };

    const btnPlay = document.getElementById("btnPlayAnim");
    if (btnPlay) {
      btnPlay.addEventListener("click", () => {
        Sound.click();
        if (lowState.playing) {
          stopMedia();
          render();
        } else {
          if (lowState.elapsedSec >= anim.durationSec) {
            lowState.elapsedSec = 0;
            lowState.sceneIdx = 0;
          }
          lowState.playing = true;
          speakCurrent();
          render();
          lowState.timerId = setInterval(async () => {
            lowState.elapsedSec += 1;
            const targetScene = Math.min(scenes.length - 1, Math.floor(lowState.elapsedSec / 15));
            if (targetScene !== lowState.sceneIdx) {
              lowState.sceneIdx = targetScene;
              speakCurrent();
              render();
            } else {
              const fill = document.getElementById("theaterProgressFill");
              const tag = document.getElementById("theaterTimeTag");
              if (fill) fill.style.width = Math.min(100, Math.round((lowState.elapsedSec / anim.durationSec) * 100)) + "%";
              if (tag) tag.textContent = `第 ${lowState.sceneIdx + 1} / ${scenes.length} 幕・${lowState.elapsedSec}s / ${anim.durationSec}s`;
            }
            if (lowState.elapsedSec >= anim.durationSec) {
              stopMedia();
              await completeLowAnimation(false);
            }
          }, 1000);
        }
      });
    }

    const btnPrev = document.getElementById("btnPrevScene");
    if (btnPrev) {
      btnPrev.addEventListener("click", () => {
        Sound.click();
        stopMedia();
        lowState.sceneIdx = Math.max(0, lowState.sceneIdx - 1);
        lowState.elapsedSec = lowState.sceneIdx * 15;
        speakCurrent();
        render();
      });
    }

    const btnNext = document.getElementById("btnNextScene");
    if (btnNext) {
      btnNext.addEventListener("click", () => {
        Sound.click();
        stopMedia();
        lowState.sceneIdx = Math.min(scenes.length - 1, lowState.sceneIdx + 1);
        lowState.elapsedSec = lowState.sceneIdx * 15;
        speakCurrent();
        render();
      });
    }

    const btnDone = document.getElementById("btnCompleteAnim");
    if (btnDone) {
      btnDone.addEventListener("click", async () => {
        Sound.correct();
        stopMedia();
        await completeLowAnimation(true);
      });
    }
  }

  async function completeLowAnimation(goNext) {
    if (goNext) lowState.step = "match";
    showToast("🎬 太棒了！已完成 1 分鐘成語動畫任務！");
    await persistProgress({ animationDone: true });
  }

  function renderLowPictureMatchCard(matchCount) {
    const items = toArray(ctx.curriculum.pictureMatches);
    const q = items[lowState.matchIdx % items.length];
    const isSolved = lowState.matchFeedback && lowState.matchFeedback.ok;

    return `
      <div class="task-card glass-card no-pop-anim">
        <div class="task-header">
          <div>
            <span class="pill-tag pill-blue">低年級任務 2・觸控看圖配對（需完成 2 題）</span>
            <h3 style="margin-top:8px;">🖼️ 看圖選成語｜第 ${lowState.matchIdx + 1} 題</h3>
          </div>
          <span class="pill-tag ${matchCount >= 2 ? "pill-mint" : "pill-purple"}">已完成 ${Math.min(matchCount, 2)} / 2 題</span>
        </div>

        ${renderProgressBar(matchCount, 2, "看圖選成語進度")}

        <div class="picture-match-grid">
          <div class="picture-card-frame">
            ${window.IdiomArt.pictureCardSvg(q.illustrationKey, q)}
          </div>
          <div>
            <p class="pretty-paragraph" style="font-size:16.5px;font-weight:700;color:var(--ink-dark);">
              ${escapeHtml(q.prompt)}
            </p>
            <div class="touch-options-grid">
              ${toArray(q.options)
                .map((opt) => {
                  let cls = "option-btn";
                  if (lowState.matchFeedback && lowState.matchFeedback.picked === opt) {
                    cls += lowState.matchFeedback.ok ? " correct" : " wrong";
                  }
                  return `<button type="button" class="${cls}" data-match-opt="${escapeHtml(opt)}" ${isSolved ? "disabled" : ""}>${escapeHtml(opt)}</button>`;
                })
                .join("")}
            </div>

            ${
              lowState.matchFeedback
                ? `<div class="feedback-banner ${lowState.matchFeedback.ok ? "success" : "error"}">
                    <strong>${lowState.matchFeedback.ok ? "🌟 答對囉！" : "💭 再仔細看看圖片喔！"}</strong>
                    ${escapeHtml(lowState.matchFeedback.message)}
                   </div>`
                : ""
            }

            <div style="margin-top:16px;display:flex;flex-wrap:wrap;gap:10px;">
              ${
                isSolved && matchCount < 2
                  ? `<button type="button" class="btn btn-primary" id="btnNextMatch">➡️ 挑戰下一題配對</button>`
                  : ""
              }
              ${
                matchCount >= 2
                  ? `<button type="button" class="btn btn-mint" id="btnGoNumberGame">🎮 已完成配對・前往數字成語小遊戲</button>`
                  : ""
              }
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function bindLowPictureMatchEvents() {
    const items = toArray(ctx.curriculum.pictureMatches);
    const q = items[lowState.matchIdx % items.length];

    document.querySelectorAll("[data-match-opt]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const picked = btn.dataset.matchOpt;
        if (picked === q.answer) {
          Sound.correct();
          lowState.matchFeedback = { ok: true, picked, message: q.explanation };
          const alreadyCounted = lowState.solvedMatchIds.has(q.id);
          lowState.solvedMatchIds.add(q.id);
          const cur = Number(ensureProgressObj().pictureMatchCount || 0);
          const nextCount = alreadyCounted ? cur : Math.min(2, cur + 1);
          await persistProgress({ pictureMatchCount: nextCount });
        } else {
          Sound.wrong();
          lowState.matchFeedback = { ok: false, picked, message: "別氣餒，點選其他成語卡片再試一次吧！" };
          render();
        }
      });
    });

    const btnNext = document.getElementById("btnNextMatch");
    if (btnNext) {
      btnNext.addEventListener("click", () => {
        Sound.click();
        lowState.matchIdx = (lowState.matchIdx + 1) % items.length;
        lowState.matchFeedback = null;
        render();
      });
    }

    const btnGoNum = document.getElementById("btnGoNumberGame");
    if (btnGoNum) {
      btnGoNum.addEventListener("click", () => {
        Sound.click();
        lowState.step = "number";
        render();
      });
    }
  }

  function renderLowNumberGameCard(numCount) {
    const games = toArray(ctx.curriculum.numberGames);
    const g = games[lowState.numIdx % games.length];
    const template = toArray(g.template);
    const blanks = toArray(g.blanks);
    const isSolved = lowState.numFeedback && lowState.numFeedback.ok;

    return `
      <div class="task-card glass-card no-pop-anim">
        <div class="task-header">
          <div>
            <span class="pill-tag pill-pink">低年級任務 3・數字成語小遊戲（答對 3 題完成本日打卡！）</span>
            <h3 style="margin-top:8px;">🔢 數字泡泡填成語｜第 ${lowState.numIdx + 1} 題</h3>
          </div>
          <span class="pill-tag ${numCount >= 3 ? "pill-mint" : "pill-purple"}">答對進度 ${Math.min(numCount, 3)} / 3 題</span>
        </div>

        ${renderProgressBar(numCount, 3, "數字成語闖關進度")}

        <div class="number-game-board">
          <p class="pretty-paragraph" style="font-size:16px;font-weight:700;text-align:center;">
            💡 線索提示：${escapeHtml(g.hint)}
          </p>

          <div class="idiom-slots-row">
            ${template
              .map((ch, idx) => {
                const blankPos = blanks.indexOf(idx);
                if (blankPos >= 0) {
                  const val = lowState.numFilled[blankPos] || "？";
                  const cls = lowState.numFilled[blankPos] ? "idiom-char-tile filled" : "idiom-char-tile blank";
                  return `<div class="${cls}" data-clear-blank="${blankPos}" title="點擊清除重填">${escapeHtml(val)}</div>`;
                }
                return `<div class="idiom-char-tile">${escapeHtml(ch)}</div>`;
              })
              .join("")}
          </div>

          <div class="num-bubbles-row">
            ${toArray(g.choices)
              .map(
                (numChar) =>
                  `<button type="button" class="num-bubble" data-num-pick="${escapeHtml(numChar)}" ${isSolved ? "disabled" : ""}>${escapeHtml(numChar)}</button>`
              )
              .join("")}
          </div>

          <div style="display:flex;flex-wrap:wrap;gap:10px;justify-content:center;">
            ${
              !isSolved
                ? `<button type="button" class="btn btn-secondary" id="btnResetNumSlots">🔄 重新填寫</button>
                   <button type="button" class="btn btn-primary" id="btnCheckNumIdiom">✨ 確認答案</button>`
                : ""
            }
            ${
              isSolved && numCount < 3
                ? `<button type="button" class="btn btn-mint" id="btnNextNumGame">➡️ 挑戰下一題數字成語</button>`
                : ""
            }
          </div>

          ${
            lowState.numFeedback
              ? `<div class="feedback-banner ${lowState.numFeedback.ok ? "success" : "error"}" style="width:100%;max-width:600px;">
                  <strong>${lowState.numFeedback.ok ? "🎉 太厲害了！" : "🫧 差一點點喔！"}</strong>
                  ${escapeHtml(lowState.numFeedback.message)}
                 </div>`
              : ""
          }
        </div>
      </div>
    `;
  }

  function bindLowNumberGameEvents() {
    const games = toArray(ctx.curriculum.numberGames);
    const g = games[lowState.numIdx % games.length];
    const blanks = toArray(g.blanks);
    const answers = toArray(g.answers);

    document.querySelectorAll("[data-num-pick]").forEach((btn) => {
      btn.addEventListener("click", () => {
        Sound.click();
        if (lowState.numFilled.length < blanks.length) {
          lowState.numFilled.push(btn.dataset.numPick);
          lowState.numFeedback = null;
          render();
        }
      });
    });

    document.querySelectorAll("[data-clear-blank]").forEach((tile) => {
      tile.addEventListener("click", () => {
        if (lowState.numFeedback && lowState.numFeedback.ok) return;
        Sound.click();
        lowState.numFilled = [];
        lowState.numFeedback = null;
        render();
      });
    });

    const btnReset = document.getElementById("btnResetNumSlots");
    if (btnReset) {
      btnReset.addEventListener("click", () => {
        Sound.click();
        lowState.numFilled = [];
        lowState.numFeedback = null;
        render();
      });
    }

    const btnCheck = document.getElementById("btnCheckNumIdiom");
    if (btnCheck) {
      btnCheck.addEventListener("click", async () => {
        if (lowState.numFilled.length < blanks.length) {
          Sound.wrong();
          lowState.numFeedback = { ok: false, message: "請點選上方數字泡泡，把兩個空缺都填滿喔！" };
          render();
          return;
        }
        const ok = answers.every((ans, i) => lowState.numFilled[i] === ans);
        if (ok) {
          Sound.correct();
          lowState.numFeedback = { ok: true, message: `「${g.fullIdiom}」答對了！例句：${g.example}` };
          const alreadyCounted = lowState.solvedNumIds.has(g.id);
          lowState.solvedNumIds.add(g.id);
          const cur = Number(ensureProgressObj().numberGameCount || 0);
          const nextCount = alreadyCounted ? cur : Math.min(3, cur + 1);
          await persistProgress({ numberGameCount: nextCount });
        } else {
          Sound.wrong();
          lowState.numFeedback = { ok: false, message: "這個數字組合不太對喔，按「重新填寫」再試試看！" };
          render();
        }
      });
    }

    const btnNext = document.getElementById("btnNextNumGame");
    if (btnNext) {
      btnNext.addEventListener("click", () => {
        Sound.click();
        lowState.numIdx = (lowState.numIdx + 1) % games.length;
        lowState.numFilled = [];
        lowState.numFeedback = null;
        render();
      });
    }
  }

  // ==========================================================================
  // 二、中年級（3-4 年級）：2 題生活對話選成語 + 3 題動植物成語小遊戲
  // ==========================================================================
  function renderMidGrade(container) {
    const p = ensureProgressObj();
    const dlgCount = Number(p.dialogueCount || 0);
    const natCount = Number(p.natureGameCount || 0);

    const stepperHtml = `
      <div class="task-stepper">
        <button type="button" class="step-chip ${midState.step === "dialogue" ? "active" : ""} ${dlgCount >= 2 ? "done" : ""}" data-mid-step="dialogue">
          ${dlgCount >= 2 ? "✅" : "💬"} 任務 1・生活對話選成語 (${Math.min(dlgCount, 2)}/2)
        </button>
        <button type="button" class="step-chip ${midState.step === "nature" ? "active" : ""} ${natCount >= 3 ? "done" : ""}" data-mid-step="nature">
          ${natCount >= 3 ? "✅" : "🦊"} 任務 2・動植物成語遊戲 (${Math.min(natCount, 3)}/3)
        </button>
      </div>
    `;

    const bodyHtml = midState.step === "dialogue" ? renderMidDialogueCard(dlgCount) : renderMidNatureCard(natCount);
    container.innerHTML = stepperHtml + bodyHtml;

    container.querySelectorAll("[data-mid-step]").forEach((btn) => {
      btn.addEventListener("click", () => {
        Sound.click();
        midState.step = btn.dataset.midStep;
        render();
      });
    });

    if (midState.step === "dialogue") bindMidDialogueEvents();
    else bindMidNatureEvents();
  }

  function renderMidDialogueCard(dlgCount) {
    const list = toArray(ctx.curriculum.dialogues);
    const item = list[midState.dlgIdx % list.length];
    const avatarEmoji = (a) => (a === "teacher" ? "👩‍🏫" : a === "girl" ? "👧" : "👦");
    const isSolved = midState.dlgFeedback && midState.dlgFeedback.ok;

    return `
      <div class="task-card glass-card no-pop-anim">
        <div class="task-header">
          <div>
            <span class="pill-tag pill-blue">中年級任務 1・生活情境對話（完成 2 題）</span>
            <h3 style="margin-top:8px;">💬 情境：${escapeHtml(item.sceneTitle)}（第 ${midState.dlgIdx + 1} 題）</h3>
          </div>
          <span class="pill-tag ${dlgCount >= 2 ? "pill-mint" : "pill-purple"}">已完成 ${Math.min(dlgCount, 2)} / 2 題</span>
        </div>

        ${renderProgressBar(dlgCount, 2, "生活對話選成語進度")}

        <div class="dialogue-stage">
          <div class="dialogue-bubbles">
            ${toArray(item.lines)
              .map(
                (line, i) => `
                <div class="chat-bubble ${i % 2 === 1 ? "right" : ""}">
                  <div class="chat-avatar">${avatarEmoji(line.avatar)}</div>
                  <div>
                    <div class="chat-speaker">${escapeHtml(line.speaker)}</div>
                    <div class="chat-text">${escapeHtml(line.text)}</div>
                  </div>
                </div>`
              )
              .join("")}
          </div>
        </div>

        <div class="touch-options-grid" style="margin-top:20px;">
          ${toArray(item.options)
            .map((opt) => {
              let cls = "option-btn";
              if (midState.dlgFeedback && midState.dlgFeedback.picked === opt) {
                cls += midState.dlgFeedback.ok ? " correct" : " wrong";
              }
              return `<button type="button" class="${cls}" data-dlg-opt="${escapeHtml(opt)}" ${isSolved ? "disabled" : ""}>${escapeHtml(opt)}</button>`;
            })
            .join("")}
        </div>

        ${
          midState.dlgFeedback
            ? `<div class="feedback-banner ${midState.dlgFeedback.ok ? "success" : "error"}">
                <strong>${midState.dlgFeedback.ok ? "🌟 選得太貼切了！" : "💡 再讀一次對話情境看看！"}</strong>
                ${escapeHtml(midState.dlgFeedback.message)}
               </div>`
            : ""
        }

        <div style="margin-top:16px;display:flex;flex-wrap:wrap;gap:10px;">
          ${
            isSolved && dlgCount < 2
              ? `<button type="button" class="btn btn-primary" id="btnNextDlg">➡️ 進入第 2 題生活對話</button>`
              : ""
          }
          ${
            dlgCount >= 2
              ? `<button type="button" class="btn btn-mint" id="btnGoNature">🦊 已完成對話・前往動植物成語小遊戲</button>`
              : ""
          }
        </div>
      </div>
    `;
  }

  function bindMidDialogueEvents() {
    const list = toArray(ctx.curriculum.dialogues);
    const item = list[midState.dlgIdx % list.length];

    document.querySelectorAll("[data-dlg-opt]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const picked = btn.dataset.dlgOpt;
        if (picked === item.answer) {
          Sound.correct();
          midState.dlgFeedback = { ok: true, picked, message: item.explanation };
          const alreadyCounted = midState.solvedDlgIds.has(item.id);
          midState.solvedDlgIds.add(item.id);
          const cur = Number(ensureProgressObj().dialogueCount || 0);
          const nextCount = alreadyCounted ? cur : Math.min(2, cur + 1);
          await persistProgress({ dialogueCount: nextCount });
        } else {
          Sound.wrong();
          midState.dlgFeedback = { ok: false, picked, message: "這個成語放在這段對話裡好像不太自然喔，再想想看！" };
          render();
        }
      });
    });

    const btnNext = document.getElementById("btnNextDlg");
    if (btnNext) {
      btnNext.addEventListener("click", () => {
        Sound.click();
        midState.dlgIdx = (midState.dlgIdx + 1) % list.length;
        midState.dlgFeedback = null;
        render();
      });
    }

    const btnGoNat = document.getElementById("btnGoNature");
    if (btnGoNat) {
      btnGoNat.addEventListener("click", () => {
        Sound.click();
        midState.step = "nature";
        render();
      });
    }
  }

  function renderMidNatureCard(natCount) {
    const games = toArray(ctx.curriculum.natureGames);
    const g = games[midState.natIdx % games.length];
    const isSolved = midState.natFeedback && midState.natFeedback.ok;

    return `
      <div class="task-card glass-card no-pop-anim">
        <div class="task-header">
          <div>
            <span class="pill-tag pill-pink">中年級任務 2・動植物成語小遊戲（答對 3 題完成本日打卡！）</span>
            <h3 style="margin-top:8px;">🦊 動植物線索大挑戰｜第 ${midState.natIdx + 1} 題</h3>
          </div>
          <span class="pill-tag ${natCount >= 3 ? "pill-mint" : "pill-purple"}">答對進度 ${Math.min(natCount, 3)} / 3 題</span>
        </div>

        ${renderProgressBar(natCount, 3, "動植物成語闖關進度")}

        <div class="nature-clue-card">
          <span class="pill-tag pill-blue" style="margin-bottom:10px;">主題分類：${escapeHtml(g.category)}成語</span>
          <div class="nature-emoji-badge">${escapeHtml(g.badgeIcon)}</div>
          <p class="pretty-paragraph" style="font-size:17px;font-weight:700;max-width:620px;margin:0 auto;">
            ${escapeHtml(g.clue)}
          </p>
        </div>

        <div class="touch-options-grid" style="margin-top:18px;">
          ${toArray(g.options)
            .map((opt) => {
              let cls = "option-btn";
              if (midState.natFeedback && midState.natFeedback.picked === opt) {
                cls += midState.natFeedback.ok ? " correct" : " wrong";
              }
              return `<button type="button" class="${cls}" data-nat-opt="${escapeHtml(opt)}" ${isSolved ? "disabled" : ""}>${escapeHtml(opt)}</button>`;
            })
            .join("")}
        </div>

        ${
          midState.natFeedback
            ? `<div class="feedback-banner ${midState.natFeedback.ok ? "success" : "error"}">
                <strong>${midState.natFeedback.ok ? "🎉 答對了！" : "🌿 再想一下動植物的特徵喔！"}</strong>
                ${escapeHtml(midState.natFeedback.message)}
               </div>`
            : ""
        }

        <div style="margin-top:16px;display:flex;flex-wrap:wrap;gap:10px;">
          ${
            isSolved && natCount < 3
              ? `<button type="button" class="btn btn-primary" id="btnNextNat">➡️ 挑戰下一題動植物成語</button>`
              : ""
          }
        </div>
      </div>
    `;
  }

  function bindMidNatureEvents() {
    const games = toArray(ctx.curriculum.natureGames);
    const g = games[midState.natIdx % games.length];

    document.querySelectorAll("[data-nat-opt]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const picked = btn.dataset.natOpt;
        if (picked === g.answer) {
          Sound.correct();
          midState.natFeedback = { ok: true, picked, message: g.explanation };
          const alreadyCounted = midState.solvedNatIds.has(g.id);
          midState.solvedNatIds.add(g.id);
          const cur = Number(ensureProgressObj().natureGameCount || 0);
          const nextCount = alreadyCounted ? cur : Math.min(3, cur + 1);
          await persistProgress({ natureGameCount: nextCount });
        } else {
          Sound.wrong();
          midState.natFeedback = { ok: false, picked, message: "不是這個成語喔，看看可愛的動植物圖示再選一次！" };
          render();
        }
      });
    });

    const btnNext = document.getElementById("btnNextNat");
    if (btnNext) {
      btnNext.addEventListener("click", () => {
        Sound.click();
        midState.natIdx = (midState.natIdx + 1) % games.length;
        midState.natFeedback = null;
        render();
      });
    }
  }

  // ==========================================================================
  // 三、高年級（5-6 年級）：切分為二個階段
  // ==========================================================================
  function renderHighGrade(container) {
    const p = ensureProgressObj();
    const newsCount = Number(p.newsBugCount || 0);
    const storyDone = Boolean(p.storyDone);
    const writingDone = Boolean(p.writingDone);
    const likesCount = Number(p.likesGivenCount || 0);

    const stage1Done = newsCount >= 2 && storyDone;
    const stage2Done = writingDone && likesCount >= 2;

    const stageBannerHtml = `
      <div class="stage-banner-grid">
        <div class="stage-card ${highState.stage === 1 ? "active" : ""} ${stage1Done ? "completed" : ""}" data-high-stage="1">
          <div class="stage-card-top">
            <span class="pill-tag ${stage1Done ? "pill-mint" : "pill-purple"}">${stage1Done ? "✅ 第一階段已完成" : "第一階段・語文探索"}</span>
            <span style="font-size:13px;font-weight:700;color:var(--ink-muted);">約 2～3 分鐘</span>
          </div>
          <h3 style="font-size:18px;margin-bottom:6px;">新聞抓漏王 ＋ 聽我說故事</h3>
          <p class="pretty-paragraph" style="font-size:13.5px;">
            完成題型 A 抓出 2 則新聞錯字 (${Math.min(newsCount, 2)}/2)，並聆聽題型 C 歷史典故 (${storyDone ? "1/1" : "0/1"})。
          </p>
        </div>

        <div class="stage-card ${highState.stage === 2 ? "active" : ""} ${stage2Done ? "completed" : ""}" data-high-stage="2">
          <div class="stage-card-top">
            <span class="pill-tag ${stage2Done ? "pill-mint" : "pill-blue"}">${stage2Done ? "✅ 第二階段已完成" : "第二階段・創作共學"}</span>
            <span style="font-size:13px;font-weight:700;color:var(--ink-muted);">約 2 分鐘</span>
          </div>
          <h3 style="font-size:18px;margin-bottom:6px;">微寫作接龍 ＋ 幫 2 位同學按愛心</h3>
          <p class="pretty-paragraph" style="font-size:13.5px;">
            完成題型 B 造句發布 (${writingDone ? "已完成" : "未完成"})，並幫 2 位同學按愛心 (${Math.min(likesCount, 2)}/2)，即完成今日打卡！
          </p>
        </div>
      </div>
    `;

    let bodyHtml = "";
    if (highState.stage === 1) {
      bodyHtml = `
        <div class="task-stepper">
          <button type="button" class="step-chip ${highState.subTab1 === "news" ? "active" : ""} ${newsCount >= 2 ? "done" : ""}" data-high-sub="news">
            ${newsCount >= 2 ? "✅" : "🗞️"} 題型 A・新聞抓漏王 (${Math.min(newsCount, 2)}/2)
          </button>
          <button type="button" class="step-chip ${highState.subTab1 === "story" ? "active" : ""} ${storyDone ? "done" : ""}" data-high-sub="story">
            ${storyDone ? "✅" : "📖"} 題型 C・聽我說故事 (${storyDone ? "1/1" : "0/1"})
          </button>
        </div>
        ${highState.subTab1 === "news" ? renderHighNewsBugCard(newsCount) : renderHighStoryCard(storyDone)}
      `;
    } else {
      bodyHtml = renderHighMicroWritingCard(writingDone, likesCount);
    }

    container.innerHTML = stageBannerHtml + bodyHtml;

    container.querySelectorAll("[data-high-stage]").forEach((card) => {
      card.addEventListener("click", () => {
        Sound.click();
        stopMedia();
        highState.stage = Number(card.dataset.highStage);
        render();
      });
    });

    container.querySelectorAll("[data-high-sub]").forEach((btn) => {
      btn.addEventListener("click", () => {
        Sound.click();
        stopMedia();
        highState.subTab1 = btn.dataset.highSub;
        render();
      });
    });

    if (highState.stage === 1) {
      if (highState.subTab1 === "news") bindHighNewsEvents();
      else bindHighStoryEvents();
    } else {
      bindHighWritingEvents();
    }
  }

  function renderHighNewsBugCard(newsCount) {
    const bugs = toArray(ctx.curriculum.newsBugs);
    const b = bugs[highState.newsIdx % bugs.length];
    const chars = Array.from(b.headline);
    const wrongStart = b.headline.indexOf(b.wrongSegment);
    const wrongEnd = wrongStart >= 0 ? wrongStart + b.wrongSegment.length - 1 : -1;

    return `
      <div class="task-card glass-card no-pop-anim">
        <div class="task-header">
          <div>
            <span class="pill-tag pill-purple">第一階段・題型 A（新聞抓漏王）</span>
            <h3 style="margin-top:8px;">🗞️ 抓出新聞標題裡的錯別字或誤用成語（第 ${highState.newsIdx + 1} 則）</h3>
          </div>
          <span class="pill-tag ${newsCount >= 2 ? "pill-mint" : "pill-blue"}">已抓漏 ${Math.min(newsCount, 2)} / 2 則</span>
        </div>

        ${renderProgressBar(newsCount, 2, "新聞抓漏進度")}

        <div class="newspaper-card">
          <div class="news-masthead">
            <span class="pill-tag pill-gold">📰 ${escapeHtml(b.category)}</span>
            <span style="font-size:13px;color:var(--ink-muted);font-weight:700;">👇 請直接點擊標題中寫錯的那個字或成語！</span>
          </div>

          <div class="news-headline-chars" id="newsHeadlineChars">
            ${chars
              .map((ch, i) => {
                let cls = "news-char-btn";
                const inWrongSeg = wrongStart >= 0 && i >= wrongStart && i <= wrongEnd;
                let displayChar = ch;
                if (highState.newsFixed && inWrongSeg) {
                  cls += " fixed";
                  displayChar = Array.from(b.correctSegment)[i - wrongStart] || ch;
                } else if (highState.spottedWrong && inWrongSeg) {
                  cls += " spotted";
                }
                return `<button type="button" class="${cls}" data-char-idx="${i}">${escapeHtml(displayChar)}</button>`;
              })
              .join("")}
          </div>

          ${
            highState.spottedWrong && !highState.newsFixed
              ? `<div style="margin-top:14px;padding:16px;border-radius:16px;background:#FFF4F8;border:1.5px solid #FFB3C8;">
                  <p style="font-weight:800;color:#B51F52;margin-bottom:10px;">
                    🔍 抓到了！「${escapeHtml(b.wrongSegment)}」有錯字，請選擇正確的成語來修正：
                  </p>
                  <div style="display:flex;flex-wrap:wrap;gap:10px;">
                    ${toArray(b.options)
                      .map(
                        (opt) =>
                          `<button type="button" class="btn btn-secondary" data-news-fix="${escapeHtml(opt)}">${escapeHtml(opt)}</button>`
                      )
                      .join("")}
                  </div>
                 </div>`
              : ""
          }

          ${
            highState.newsFeedback
              ? `<div class="feedback-banner ${highState.newsFeedback.ok ? "success" : "error"}">
                  <strong>${highState.newsFeedback.ok ? "🏆 抓漏成功！" : "🔎 提示小幫手："}</strong>
                  ${escapeHtml(highState.newsFeedback.message)}
                 </div>`
              : ""
          }

          <div style="margin-top:16px;display:flex;flex-wrap:wrap;gap:10px;">
            ${
              !highState.spottedWrong && !highState.newsFixed
                ? `<button type="button" class="btn btn-secondary" id="btnHintNews">💡 給我一點提示</button>`
                : ""
            }
            ${
              highState.newsFixed && newsCount < 2
                ? `<button type="button" class="btn btn-primary" id="btnNextNewsBug">➡️ 挑戰第 2 則新聞</button>`
                : ""
            }
            ${
              newsCount >= 2
                ? `<button type="button" class="btn btn-mint" id="btnGoStory">📖 前往題型 C・聽我說故事</button>`
                : ""
            }
          </div>
        </div>
      </div>
    `;
  }

  function bindHighNewsEvents() {
    const bugs = toArray(ctx.curriculum.newsBugs);
    const b = bugs[highState.newsIdx % bugs.length];
    const wrongStart = b.headline.indexOf(b.wrongSegment);
    const wrongEnd = wrongStart >= 0 ? wrongStart + b.wrongSegment.length - 1 : -1;

    document.querySelectorAll("[data-char-idx]").forEach((btn) => {
      btn.addEventListener("click", () => {
        if (highState.newsFixed) return;
        const idx = Number(btn.dataset.charIdx);
        if (idx >= wrongStart && idx <= wrongEnd) {
          Sound.correct();
          highState.spottedWrong = true;
          highState.newsFeedback = null;
        } else {
          Sound.wrong();
          highState.newsFeedback = { ok: false, message: "這個字沒有寫錯喔！再找找標題中的四字成語吧！" };
        }
        render();
      });
    });

    document.querySelectorAll("[data-news-fix]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const picked = btn.dataset.newsFix;
        if (picked === b.correctSegment) {
          Sound.correct();
          highState.newsFixed = true;
          highState.newsFeedback = { ok: true, message: b.explanation };
          const alreadyCounted = highState.solvedNewsIds.has(b.id);
          highState.solvedNewsIds.add(b.id);
          const cur = Number(ensureProgressObj().newsBugCount || 0);
          const nextCount = alreadyCounted ? cur : Math.min(2, cur + 1);
          await persistProgress({ newsBugCount: nextCount });
        } else {
          Sound.wrong();
          highState.newsFeedback = { ok: false, message: "這個寫法還不太對喔，想想字義再選一次！" };
          render();
        }
      });
    });

    const btnHint = document.getElementById("btnHintNews");
    if (btnHint) {
      btnHint.addEventListener("click", () => {
        Sound.click();
        highState.newsFeedback = { ok: false, message: `注意標題裡的四字成語「${b.wrongSegment}」，裡面藏著一個錯別字喔！` };
        render();
      });
    }

    const btnNext = document.getElementById("btnNextNewsBug");
    if (btnNext) {
      btnNext.addEventListener("click", () => {
        Sound.click();
        highState.newsIdx = (highState.newsIdx + 1) % bugs.length;
        highState.spottedWrong = false;
        highState.newsFixed = false;
        highState.newsFeedback = null;
        render();
      });
    }

    const btnGoStory = document.getElementById("btnGoStory");
    if (btnGoStory) {
      btnGoStory.addEventListener("click", () => {
        Sound.click();
        highState.subTab1 = "story";
        render();
      });
    }
  }

  function renderHighStoryCard(storyDone) {
    const st = ctx.curriculum.story;
    return `
      <div class="task-card glass-card no-pop-anim">
        <div class="task-header">
          <div>
            <span class="pill-tag pill-purple">第一階段・題型 C（聽我說故事）</span>
            <h3 style="margin-top:8px;">📖 歷史典故：《${escapeHtml(st.idiom)}》</h3>
          </div>
          <div class="task-header-actions">
            <button type="button" class="btn btn-primary" id="btnReadStoryAloud">
              ${highState.storyReading ? "⏹ 停止語音朗讀" : "🎧 播放說書人朗讀"}
            </button>
          </div>
        </div>

        ${renderProgressBar(storyDone ? 1 : 0, 1, "聽我說故事理解進度")}

        <div class="story-book-box">
          <div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:10px;">
            <span class="pill-tag pill-blue">⏳ 時代：${escapeHtml(st.dynasty)}</span>
            <span class="pill-tag pill-gold">🌟 主角：${escapeHtml(st.hero)}</span>
          </div>

          <div class="story-paragraphs">
            ${toArray(st.paragraphs).map((para) => `<p class="pretty-paragraph">${escapeHtml(para)}</p>`).join("")}
          </div>

          <div class="moral-callout">
            <strong>✨ 成語釋義：</strong>${escapeHtml(st.summary)}
          </div>

          <div style="margin-top:18px;padding-top:16px;border-top:2px dashed rgba(124,108,240,0.22);">
            <h4 style="font-size:16.5px;margin-bottom:8px;">💬 聽完故事小思考：${escapeHtml(st.quiz.question)}</h4>
            <div class="story-quiz-options">
              ${toArray(st.quiz.options)
                .map((opt) => {
                  let cls = "story-quiz-option";
                  if (highState.storyFeedback && highState.storyFeedback.picked === opt) {
                    cls += highState.storyFeedback.ok ? " correct" : " wrong";
                  }
                  return `<button type="button" class="${cls}" data-story-opt="${escapeHtml(opt)}" ${storyDone ? "disabled" : ""}>${escapeHtml(opt)}</button>`;
                })
                .join("")}
            </div>

            ${
              highState.storyFeedback
                ? `<div class="feedback-banner ${highState.storyFeedback.ok ? "success" : "error"}">
                    <strong>${highState.storyFeedback.ok ? "🎓 理解滿分！" : "💭 再回顧一下故事第二段喔！"}</strong>
                    ${escapeHtml(highState.storyFeedback.message)}
                   </div>`
                : ""
            }

            ${
              storyDone
                ? `<div style="margin-top:16px;">
                    <button type="button" class="btn btn-mint" id="btnGoStage2">🚀 進入第二階段：微寫作接龍與按愛心</button>
                   </div>`
                : ""
            }
          </div>
        </div>
      </div>
    `;
  }

  function bindHighStoryEvents() {
    const st = ctx.curriculum.story;

    const btnRead = document.getElementById("btnReadStoryAloud");
    if (btnRead) {
      btnRead.addEventListener("click", () => {
        Sound.click();
        if (highState.storyReading) {
          Speech.stop();
          highState.storyReading = false;
        } else {
          highState.storyReading = true;
          const fullText = `歷史典故，${st.idiom}。` + toArray(st.paragraphs).join(" ");
          Speech.speak(fullText, () => {
            highState.storyReading = false;
            const b = document.getElementById("btnReadStoryAloud");
            if (b) b.textContent = "🎧 播放說書人朗讀";
          });
        }
        render();
      });
    }

    document.querySelectorAll("[data-story-opt]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const picked = btn.dataset.storyOpt;
        if (picked === st.quiz.answer) {
          Sound.correct();
          highState.storyFeedback = { ok: true, picked, message: st.quiz.explanation };
          await persistProgress({ storyDone: true });
        } else {
          Sound.wrong();
          highState.storyFeedback = { ok: false, picked, message: "再想一想，項羽為什麼只帶三天乾糧還要砸破鍋子呢？" };
          render();
        }
      });
    });

    const btnStage2 = document.getElementById("btnGoStage2");
    if (btnStage2) {
      btnStage2.addEventListener("click", () => {
        Sound.click();
        stopMedia();
        highState.stage = 2;
        render();
      });
    }
  }

  function renderHighMicroWritingCard(writingDone, likesCount) {
    const prompt = ctx.curriculum.microWritingPrompt || { idiom: "破釜沉舟", altIdioms: [], guide: "" };
    const idiomChoices = [prompt.idiom].concat(toArray(prompt.altIdioms));

    return `
      <div class="task-card glass-card no-pop-anim">
        <div class="task-header">
          <div>
            <span class="pill-tag pill-blue">第二階段・題型 B（微寫作接龍＋同學互評按愛心）</span>
            <h3 style="margin-top:8px;">✍️ 成語微寫作接龍牆</h3>
          </div>
          <div class="task-header-actions">
            <span class="pill-tag ${writingDone ? "pill-mint" : "pill-purple"}">${writingDone ? "✅ 已發表造句" : "✍️ 尚未發表造句"}</span>
            <span class="pill-tag ${likesCount >= 2 ? "pill-mint" : "pill-pink"}">❤️ 已幫同學按愛心 ${Math.min(likesCount, 2)} / 2 位</span>
          </div>
        </div>

        ${renderProgressBar((writingDone ? 1 : 0) + Math.min(likesCount, 2), 3, "第二階段完成進度（造句 1 篇＋愛心 2 位同學）")}

        <div class="writing-composer">
          <p class="pretty-paragraph" style="font-size:14.5px;font-weight:600;">${escapeHtml(prompt.guide)}</p>
          <div class="idiom-chip-selector">
            ${idiomChoices
              .map(
                (idm) => `
                <button type="button" class="btn ${highState.selectedIdiom === idm ? "btn-primary" : "btn-chip"}" data-pick-idiom="${escapeHtml(idm)}">
                  ${escapeHtml(idm)}
                </button>`
              )
              .join("")}
            ${window.IdiomBank500 ? `<button type="button" class="btn btn-secondary" id="btnRollWritingIdioms">🎲 換一組隨機成語</button>` : ""}
          </div>
          <div class="form-field">
            <textarea id="microWritingInput" rows="3" placeholder="例如：為了班際籃球決賽，我們全隊破釜沉舟、每天早自習練習傳球，終於拿到冠軍！"></textarea>
          </div>
          <div style="margin-top:12px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px;">
            <span style="font-size:13px;color:var(--ink-muted);">💡 發布後全校同學與老師都能即時看到你的創意造句喔！</span>
            <button type="button" class="btn btn-primary" id="btnSubmitWriting">🚀 發布我的微寫作造句</button>
          </div>
        </div>

        <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px;margin-bottom:14px;">
          <h4 style="font-size:17px;">💖 全校同學微寫作接龍牆（幫 2 位同學按愛心即可完成共學任務！）</h4>
          <div style="display:flex;flex-wrap:wrap;gap:8px;">
            <button type="button" class="btn ${highState.writingFilter === "全校" ? "btn-primary" : "btn-chip"}" data-w-filter="全校">全校作品</button>
            <button type="button" class="btn ${highState.writingFilter === ctx.student.classId ? "btn-primary" : "btn-chip"}" data-w-filter="${escapeHtml(ctx.student.classId)}">只看本班</button>
          </div>
        </div>

        <div class="writings-wall" id="writingsWallContainer">
          ${renderWritingsWallHtml()}
        </div>
      </div>
    `;
  }

  function renderWritingsWallHtml() {
    const list = ctx.writings.filter((w) => highState.writingFilter === "全校" || w.classId === highState.writingFilter);
    if (!list.length) {
      return `<p class="pretty-paragraph">目前還沒有作品，快來當第一位微寫作接龍小作家吧！</p>`;
    }
    return list
      .map((w) => {
        const likedBy = toArray(w.likedBy);
        const isMine = w.studentId === ctx.student.id;
        const iLiked = likedBy.includes(ctx.student.id);
        return `
          <article class="writing-card ${w.featured ? "featured" : ""}">
            <div>
              <div class="writing-card-head">
                <span class="writing-author">${escapeHtml(w.classId)} ${w.seatNo}號・${escapeHtml(w.studentName)}</span>
                <span class="pill-tag pill-purple">${escapeHtml(w.idiom)}</span>
              </div>
              ${w.featured ? `<div style="margin-top:6px;"><span class="pill-tag pill-gold">⭐ 師長精選佳作（${escapeHtml(w.featuredBy || "師長推薦")}）</span></div>` : ""}
              <p class="writing-content pretty-paragraph" style="margin-top:10px;">${escapeHtml(w.content)}</p>
            </div>
            <div class="writing-card-foot">
              <span style="font-size:12.5px;color:var(--ink-muted);">發布時間 ${escapeHtml(w.createdAt)}</span>
              <button type="button" class="heart-btn ${iLiked ? "liked" : ""}" data-like-writing="${escapeHtml(w.id)}" ${isMine ? "disabled" : ""}>
                ${isMine ? "✨ 我的作品" : iLiked ? "❤️ 已按愛心" : "🤍 按愛心"} (${Number(w.likes || 0)})
              </button>
            </div>
          </article>
        `;
      })
      .join("");
  }

  function bindHighWritingEvents() {
    document.querySelectorAll("[data-pick-idiom]").forEach((btn) => {
      btn.addEventListener("click", () => {
        Sound.click();
        highState.selectedIdiom = btn.dataset.pickIdiom;
        render();
      });
    });

    const btnRoll = document.getElementById("btnRollWritingIdioms");
    if (btnRoll && window.IdiomBank500) {
      btnRoll.addEventListener("click", () => {
        Sound.click();
        const picked = window.IdiomBank500.pickRandomIdioms(4);
        ctx.curriculum.microWritingPrompt = Object.assign({}, ctx.curriculum.microWritingPrompt || {}, {
          idiom: picked[0],
          altIdioms: picked.slice(1)
        });
        highState.selectedIdiom = picked[0];
        render();
      });
    }

    document.querySelectorAll("[data-w-filter]").forEach((btn) => {
      btn.addEventListener("click", () => {
        Sound.click();
        highState.writingFilter = btn.dataset.wFilter;
        render();
      });
    });

    const btnPost = document.getElementById("btnSubmitWriting");
    if (btnPost) {
      btnPost.addEventListener("click", async () => {
        const input = document.getElementById("microWritingInput");
        const content = (input ? input.value : "").trim();
        if (content.length < 10) {
          Sound.wrong();
          showToast("✍️ 造句內容請至少寫 10 個字喔！");
          return;
        }
        if (!content.includes(highState.selectedIdiom)) {
          Sound.wrong();
          showToast(`💡 記得在造句裡用上選擇的成語「${highState.selectedIdiom}」喔！`);
          return;
        }
        try {
          btnPost.disabled = true;
          const res = await window.IdiomAPI.postWriting({
            idiom: highState.selectedIdiom,
            content
          });
          Sound.correct();
          showToast("🎉 微寫作發布成功！現在去幫 2 位同學按愛心吧！");
          const wRes = await window.IdiomAPI.getWritings();
          ctx.writings = toArray(wRes.writings);
          highState.lastWritingsSig = JSON.stringify(ctx.writings);
          if (ctx.onStateUpdated) ctx.onStateUpdated(res);
          render();
        } catch (err) {
          Sound.wrong();
          showToast(err.message);
          btnPost.disabled = false;
        }
      });
    }

    bindWritingWallEvents();
  }

  function bindWritingWallEvents() {
    document.querySelectorAll("[data-like-writing]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const wid = btn.dataset.likeWriting;
        try {
          const res = await window.IdiomAPI.likeWriting(wid);
          Sound.correct();
          showToast("❤️ 已送出暖心愛心給同學！");
          const wRes = await window.IdiomAPI.getWritings();
          ctx.writings = toArray(wRes.writings);
          highState.lastWritingsSig = JSON.stringify(ctx.writings);
          if (ctx.onStateUpdated) ctx.onStateUpdated(res);
          render();
        } catch (err) {
          Sound.wrong();
          showToast(err.message);
        }
      });
    });
  }

  return {
    init,
    render,
    stopMedia,
    syncStudent,
    updateWritings
  };
})();
