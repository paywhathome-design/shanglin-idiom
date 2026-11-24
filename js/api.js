// ============================================================================
// 上林成語小鎮 - API 連線引擎、七階稱號進階運算、記憶體+本地雙重持久化、音效與語音朗讀
// ============================================================================
window.IdiomAPI = (function () {
  const TOKEN_KEY = "idiom_cloud_token_v2";
  const CLIENT_KEY = "idiom_cloud_client_v1";
  const SOUND_KEY = "idiom_cloud_sound_v1";

  // 清除舊版快取金鑰，確保資料歸零後不殘留任何舊測試紀錄或舊登入狀態
  try {
    ["idiom_cloud_token_v1", "idiom_cloud_local_db_v1", "idiom_cloud_local_db_v2", "idiom_cloud_local_db_v3", "idiom_cloud_local_db_v4", "idiom_cloud_local_db_v5"].forEach((k) => {
      localStorage.removeItem(k);
    });
  } catch {}

  let useLocalMode = location.protocol === "file:";
  let memToken = "";
  let memClientId = "";
  const GAS_URL_STORAGE_KEY = "shanglin_gas_webapp_url_v1";

  function getCloudUrl() {
    try {
      const qs = new URLSearchParams(location.search);
      const fromQuery = (qs.get("api") || "").trim();
      if (fromQuery && /^https:\/\/script\.google\.com\//i.test(fromQuery)) {
        safeStorageSet(GAS_URL_STORAGE_KEY, fromQuery);
        return fromQuery;
      }
    } catch {}
    const fromCfg = (window.SHANGLIN_CLOUD_CONFIG && window.SHANGLIN_CLOUD_CONFIG.gasWebAppUrl || "").trim();
    if (fromCfg && /^https:\/\/script\.google\.com\//i.test(fromCfg)) return fromCfg;
    const fromStore = safeStorageGet(GAS_URL_STORAGE_KEY).trim();
    if (fromStore && /^https:\/\/script\.google\.com\//i.test(fromStore)) return fromStore;
    return "";
  }

  function setCloudUrl(url) {
    const clean = String(url || "").trim();
    safeStorageSet(GAS_URL_STORAGE_KEY, clean);
    if (window.SHANGLIN_CLOUD_CONFIG) window.SHANGLIN_CLOUD_CONFIG.gasWebAppUrl = clean;
    if (clean) useLocalMode = false;
  }

  function isCloudConnected() {
    return Boolean(getCloudUrl());
  }

  // 七階 15 天進階成語榮耀稱號（每集滿 15 天晉升下一階段）
  const RANK_TIERS = [
    { level: 1, id: "rank_1", shortTitle: "小童生", title: "成語小童生", requiredDays: 15, icon: "🌱", desc: "初入成語書院，連續打卡滿 15 天！" },
    { level: 2, id: "rank_2", shortTitle: "小秀才", title: "成語小秀才", requiredDays: 30, icon: "📜", desc: "文思漸進，連續打卡滿 30 天晉升！" },
    { level: 3, id: "rank_3", shortTitle: "小舉人", title: "成語小舉人", requiredDays: 45, icon: "🏮", desc: "出口成章，連續打卡滿 45 天晉升！" },
    { level: 4, id: "rank_4", shortTitle: "小貢士", title: "成語小貢士", requiredDays: 60, icon: "🎖️", desc: "博學多聞，連續打卡滿 60 天晉升！" },
    { level: 5, id: "rank_5", shortTitle: "小進士", title: "成語小進士", requiredDays: 75, icon: "👑", desc: "語文菁英，連續打卡滿 75 天晉升！" },
    { level: 6, id: "rank_6", shortTitle: "小狀元", title: "成語小狀元", requiredDays: 90, icon: "🌟", desc: "獨占鰲頭，連續打卡滿 90 天晉升！" },
    { level: 7, id: "rank_7", shortTitle: "大宗師", title: "成語大宗師", requiredDays: 105, icon: "🐉", desc: "登峰造極，連續打卡滿 105 天最高殿堂！" }
  ];

  function getRankProgress(streakDays) {
    const days = Math.max(0, Number(streakDays || 0));
    let currentTier = null;
    for (let i = 0; i < RANK_TIERS.length; i++) {
      if (days >= RANK_TIERS[i].requiredDays) currentTier = RANK_TIERS[i];
    }
    const unlockedCount = currentTier ? currentTier.level : 0;
    const isMax = unlockedCount >= RANK_TIERS.length;
    const nextTier = isMax ? RANK_TIERS[RANK_TIERS.length - 1] : RANK_TIERS[unlockedCount];
    const stageStartDay = isMax ? 91 : unlockedCount * 15 + 1;
    const stageEndDay = isMax ? 105 : (unlockedCount + 1) * 15;
    const stageProgress = isMax ? 15 : days - unlockedCount * 15;
    const remainDays = isMax ? 0 : Math.max(0, nextTier.requiredDays - days);

    return {
      streakDays: days,
      currentTier,
      currentTitle: currentTier ? currentTier.title : "成語小新手",
      currentIcon: currentTier ? currentTier.icon : "☁️",
      nextTier,
      isMax,
      unlockedCount,
      stageStartDay,
      stageEndDay,
      stageProgress,
      remainDays
    };
  }

  function safeStorageGet(key) {
    try {
      return localStorage.getItem(key) || "";
    } catch {
      return "";
    }
  }

  function safeStorageSet(key, val) {
    try {
      if (val) localStorage.setItem(key, val);
      else localStorage.removeItem(key);
    } catch {}
  }

  function getClientId() {
    if (memClientId) return memClientId;
    let cid = safeStorageGet(CLIENT_KEY);
    if (!cid) {
      cid = "dev-" + Math.random().toString(36).slice(2, 10) + "-" + Date.now().toString(36);
      safeStorageSet(CLIENT_KEY, cid);
    }
    memClientId = cid;
    return cid;
  }

  function getToken() {
    return memToken || safeStorageGet(TOKEN_KEY) || "";
  }

  function setToken(token) {
    memToken = token || "";
    safeStorageSet(TOKEN_KEY, memToken);
  }

  function toArray(val) {
    if (val === null || val === undefined) return [];
    return Array.isArray(val) ? val : [val];
  }

  async function requestGas(action, method = "GET", payload = {}) {
    const gasUrl = getCloudUrl();
    const token = getToken();
    let res;
    if (method === "GET") {
      const params = new URLSearchParams({ action, token });
      Object.keys(payload || {}).forEach((k) => {
        if (payload[k] !== undefined && payload[k] !== null) params.set(k, String(payload[k]));
      });
      res = await fetch(gasUrl + (gasUrl.includes("?") ? "&" : "?") + params.toString(), {
        method: "GET",
        redirect: "follow",
        cache: "no-store"
      });
    } else {
      // 使用 text/plain;charset=utf-8 避免 Google Apps Script 跨網域 CORS preflight 失敗！
      res = await fetch(gasUrl, {
        method: "POST",
        redirect: "follow",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({ action, token, payload: payload || {} })
      });
    }
    const text = await res.text();
    let data = {};
    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      throw new Error("Google 試算表回應異常，請確認部署權限已設為「所有人」");
    }
    if (!res.ok || data.ok === false || data.error) {
      throw new Error(data.error || "雲端連線失敗");
    }
    return data;
  }

  // 從 Google 試算表的 3 個「擴充_」工作表即時同步師長新增的成語、低年級動畫與高年級典故！
  async function syncCustomContentFromCloud() {
    if (!isCloudConnected()) return { idioms: 0, animations: 0, stories: 0 };
    try {
      const data = await requestGas("custom_content", "GET");
      let addedIdioms = 0;
      let addedAnims = 0;
      let addedStories = 0;

      if (window.IdiomBank500 && Array.isArray(data.idioms)) {
        const existing = new Set(window.IdiomBank500.ALL_IDIOMS.map((x) => x.idiom));
        data.idioms.forEach((item) => {
          if (item.idiom && item.idiom.length === 4 && !existing.has(item.idiom)) {
            existing.add(item.idiom);
            window.IdiomBank500.ALL_IDIOMS.push({
              id: "cloud-idm-" + (window.IdiomBank500.ALL_IDIOMS.length + 1),
              idiom: item.idiom,
              meaning: item.meaning,
              cat: item.cat || "life",
              extra: item.extra || "✨",
              wrongSeg: item.wrongSeg || "",
              wrongExplain: item.wrongExplain || ""
            });
            addedIdioms++;
          }
        });
      }

      if (window.LowGradeContent30 && Array.isArray(data.animations)) {
        const existingA = new Set(window.LowGradeContent30.ANIMATIONS_30.map((x) => x.idiom));
        data.animations.forEach((a) => {
          if (a.idiom && !existingA.has(a.idiom)) {
            existingA.add(a.idiom);
            window.LowGradeContent30.ANIMATIONS_30.push(a);
            addedAnims++;
          }
        });
      }

      if (window.HighGradeStories45 && Array.isArray(data.stories)) {
        const existingS = new Set(window.HighGradeStories45.STORIES_45.map((x) => x.idiom));
        data.stories.forEach((s) => {
          if (s.idiom && !existingS.has(s.idiom)) {
            existingS.add(s.idiom);
            window.HighGradeStories45.STORIES_45.push(s);
            addedStories++;
          }
        });
      }

      return { idioms: addedIdioms, animations: addedAnims, stories: addedStories };
    } catch {
      return { idioms: 0, animations: 0, stories: 0 };
    }
  }

  async function request(path, options = {}) {
    if (isCloudConnected()) {
      const method = (options.method || "GET").toUpperCase();
      const [pathOnly, qs] = path.split("?");
      const q = {};
      if (qs) {
        new URLSearchParams(qs).forEach((v, k) => { q[k] = v; });
      }
      const body = Object.assign({}, q, options.body || {});
      const routeMap = {
        "GET /api/health": ["health", "GET"],
        "GET /api/roster": ["roster", "GET"],
        "POST /api/auth/student": ["auth_student", "POST"],
        "POST /api/auth/staff": ["auth_staff", "POST"],
        "GET /api/auth/me": ["auth_me", "GET"],
        "GET /api/tasks/daily": ["tasks_daily", "GET"],
        "POST /api/tasks/progress": ["tasks_progress", "POST"],
        "GET /api/writings": ["writings_list", "GET"],
        "POST /api/writings": ["writings_post", "POST"],
        "POST /api/writings/like": ["writings_like", "POST"],
        "POST /api/writings/feature": ["writings_feature", "POST"],
        "GET /api/live/school": ["live_school", "GET"],
        "GET /api/admin/overview": ["admin_overview", "GET"],
        "POST /api/admin/curriculum/news": ["admin_add_news", "POST"],
        "POST /api/admin/reset-demo": ["admin_reset_all", "POST"]
      };
      const mapped = routeMap[method + " " + pathOnly];
      if (mapped) {
        return requestGas(mapped[0], mapped[1], body);
      }
    }

    if (useLocalMode && window.IdiomLocalFallback) {
      return window.IdiomLocalFallback.handle(path, options, getToken());
    }

    const headers = Object.assign(
      {
        "Content-Type": "application/json",
        "X-Client-Id": getClientId()
      },
      options.headers || {}
    );
    const token = getToken();
    if (token) {
      headers["Authorization"] = "Bearer " + token;
    }

    try {
      const res = await fetch(path, {
        method: options.method || "GET",
        headers,
        body: options.body ? JSON.stringify(options.body) : undefined,
        cache: "no-store"
      });

      const text = await res.text();
      let data = {};
      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        data = { error: "伺服器回傳格式異常" };
      }

      if (!res.ok) {
        throw new Error(data.error || ("連線錯誤 (" + res.status + ")"));
      }
      return data;
    } catch (err) {
      if (window.IdiomLocalFallback && (err instanceof TypeError || /Failed to fetch/i.test(err.message))) {
        useLocalMode = true;
        return window.IdiomLocalFallback.handle(path, options, getToken());
      }
      throw err;
    }
  }

  // -------------------- 軟萌互動音效 (Web Audio API) --------------------
  let audioCtx = null;
  let soundEnabled = safeStorageGet(SOUND_KEY) !== "off";

  function ensureAudio() {
    if (!audioCtx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (AC) audioCtx = new AC();
    }
    if (audioCtx && audioCtx.state === "suspended") {
      audioCtx.resume().catch(() => {});
    }
    return audioCtx;
  }

  function playTone(freq, duration, startOffset = 0, type = "sine", gainVal = 0.12) {
    if (!soundEnabled) return;
    const ctx = ensureAudio();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime + startOffset);
    gain.gain.setValueAtTime(0.001, ctx.currentTime + startOffset);
    gain.gain.exponentialRampToValueAtTime(gainVal, ctx.currentTime + startOffset + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + startOffset + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime + startOffset);
    osc.stop(ctx.currentTime + startOffset + duration + 0.02);
  }

  const Sound = {
    isEnabled: () => soundEnabled,
    toggle() {
      soundEnabled = !soundEnabled;
      safeStorageSet(SOUND_KEY, soundEnabled ? "on" : "off");
      if (soundEnabled) this.click();
      return soundEnabled;
    },
    click() {
      playTone(660, 0.08, 0, "triangle", 0.08);
    },
    correct() {
      playTone(587.33, 0.14, 0, "sine", 0.13);
      playTone(783.99, 0.16, 0.11, "sine", 0.13);
      playTone(1046.5, 0.24, 0.22, "triangle", 0.14);
    },
    wrong() {
      playTone(320, 0.16, 0, "sine", 0.1);
      playTone(260, 0.22, 0.14, "sine", 0.1);
    },
    celebrate() {
      const notes = [523.25, 659.25, 783.99, 1046.5, 1318.5];
      notes.forEach((n, idx) => playTone(n, 0.22, idx * 0.09, "triangle", 0.13));
    }
  };

  // -------------------- 國語語音朗讀 (Web Speech API) --------------------
  const Speech = {
    stop() {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    },
    speak(text, onEnd) {
      if (!("speechSynthesis" in window)) {
        if (onEnd) onEnd();
        return false;
      }
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = "zh-TW";
      utter.rate = 0.96;
      utter.pitch = 1.08;
      const voices = window.speechSynthesis.getVoices();
      const zhVoice = voices.find((v) => /zh[-_]TW/i.test(v.lang)) || voices.find((v) => /zh/i.test(v.lang));
      if (zhVoice) utter.voice = zhVoice;
      if (onEnd) utter.onend = onEnd;
      window.speechSynthesis.speak(utter);
      return true;
    }
  };

  function showToast(msg) {
    const box = document.getElementById("toastContainer");
    if (!box) return;
    const item = document.createElement("div");
    item.className = "toast-item";
    item.textContent = msg;
    box.appendChild(item);
    setTimeout(() => {
      item.style.opacity = "0";
      item.style.transform = "translateY(8px)";
      item.style.transition = "all 0.25s ease";
      setTimeout(() => item.remove(), 260);
    }, 3400);
  }

  // -------------------- 管理者專用「虛擬學生示範沙盒」(絕不計入全校與班級累計) --------------------
  const DEMO_PROFILES = {
    low: { id: "demo-low", classId: "低年級示範班", seatNo: 99, name: "小雲朵（低年級示範）", grade: 1, band: "low" },
    mid: { id: "demo-mid", classId: "中年級示範班", seatNo: 99, name: "小太陽（中年級示範）", grade: 3, band: "mid" },
    high: { id: "demo-high", classId: "高年級示範班", seatNo: 99, name: "小星語（高年級示範）", grade: 5, band: "high" }
  };

  let demoState = {
    active: false,
    student: null,
    writings: []
  };

  function createDemoStudentObj(band) {
    const base = DEMO_PROFILES[band] || DEMO_PROFILES.low;
    const progress =
      base.band === "low"
        ? { animationDone: false, pictureMatchCount: 0, numberGameCount: 0 }
        : base.band === "mid"
        ? { dialogueCount: 0, natureGameCount: 0 }
        : { newsBugCount: 0, storyDone: false, writingDone: false, likesGivenCount: 0, likedWritingIds: [] };
    return Object.assign({}, base, {
      isDemo: true,
      streakDays: 0,
      checkedInToday: false,
      totalCheckIns: 0,
      badges: [],
      todayProgress: progress
    });
  }

  function createDemoSampleWritings() {
    return [
      {
        id: "demo-w-1",
        studentId: "demo-peer-1",
        classId: "高年級示範班",
        seatNo: 91,
        studentName: "小晨光（示範範例）",
        idiom: "持之以恆",
        content: "每天花五分鐘學習成語，只要持之以恆不間斷，我們的語文表達能力一定會越來越棒！",
        likes: 3,
        likedBy: ["demo-a", "demo-b", "demo-c"],
        featured: true,
        featuredBy: "教學示範範例",
        createdAt: "示範範例"
      },
      {
        id: "demo-w-2",
        studentId: "demo-peer-2",
        classId: "高年級示範班",
        seatNo: 92,
        studentName: "小晴風（示範範例）",
        idiom: "迫不及待",
        content: "今天聽完有趣的歷史典故後，我迫不及待想把這個成語分享給家人和好朋友聽！",
        likes: 2,
        likedBy: ["demo-a", "demo-b"],
        featured: false,
        featuredBy: "",
        createdAt: "示範範例"
      }
    ];
  }

  function evaluateDemoCompletion() {
    const st = demoState.student;
    if (!st) return { newlyCheckedIn: false, newlyEarnedScholar: false, newlyEarnedClassAward: false };
    const p = st.todayProgress;
    let done = false;
    if (st.band === "low") done = Boolean(p.animationDone) && Number(p.pictureMatchCount || 0) >= 2 && Number(p.numberGameCount || 0) >= 3;
    else if (st.band === "mid") done = Number(p.dialogueCount || 0) >= 2 && Number(p.natureGameCount || 0) >= 3;
    else done = Number(p.newsBugCount || 0) >= 2 && Boolean(p.storyDone) && Boolean(p.writingDone) && Number(p.likesGivenCount || 0) >= 2;

    let newlyCheckedIn = false;
    if (done && !st.checkedInToday) {
      st.checkedInToday = true;
      st.streakDays += 1;
      st.totalCheckIns += 1;
      newlyCheckedIn = true;
    }
    return { newlyCheckedIn, newlyEarnedScholar: false, newlyEarnedClassAward: false };
  }

  const DemoSandbox = {
    isActive: () => demoState.active,
    start(band) {
      demoState.active = true;
      demoState.student = createDemoStudentObj(band);
      demoState.writings = createDemoSampleWritings();
      return {
        student: JSON.parse(JSON.stringify(demoState.student)),
        classStat: { classId: demoState.student.classId, checkInRate: 0, isDemo: true }
      };
    },
    stop() {
      demoState.active = false;
      demoState.student = null;
      demoState.writings = [];
    },
    saveProgress(patch) {
      const st = demoState.student;
      const p = st.todayProgress;
      if (st.band === "low") {
        if (patch.animationDone !== undefined) p.animationDone = Boolean(patch.animationDone);
        if (patch.pictureMatchCount !== undefined) p.pictureMatchCount = Math.max(Number(p.pictureMatchCount || 0), Number(patch.pictureMatchCount));
        if (patch.numberGameCount !== undefined) p.numberGameCount = Math.max(Number(p.numberGameCount || 0), Number(patch.numberGameCount));
      } else if (st.band === "mid") {
        if (patch.dialogueCount !== undefined) p.dialogueCount = Math.max(Number(p.dialogueCount || 0), Number(patch.dialogueCount));
        if (patch.natureGameCount !== undefined) p.natureGameCount = Math.max(Number(p.natureGameCount || 0), Number(patch.natureGameCount));
      } else {
        if (patch.newsBugCount !== undefined) p.newsBugCount = Math.max(Number(p.newsBugCount || 0), Number(patch.newsBugCount));
        if (patch.storyDone !== undefined) p.storyDone = Boolean(patch.storyDone);
      }
      const ev = evaluateDemoCompletion();
      return Object.assign(
        { ok: true, isDemo: true, student: JSON.parse(JSON.stringify(st)), classStat: { classId: st.classId, checkInRate: 0, isDemo: true } },
        ev
      );
    },
    getWritings() {
      return { ok: true, writings: JSON.parse(JSON.stringify(demoState.writings)) };
    },
    postWriting(payload) {
      const st = demoState.student;
      const content = String(payload.content || "").trim();
      if (content.length < 10) throw new Error("造句內容請至少寫 10 個字喔！");
      const w = {
        id: "demo-w-" + Date.now().toString(36),
        studentId: st.id,
        classId: st.classId,
        seatNo: st.seatNo,
        studentName: st.name,
        idiom: payload.idiom || "破釜沉舟",
        content,
        likes: 0,
        likedBy: [],
        featured: false,
        featuredBy: "",
        createdAt: "示範創作"
      };
      demoState.writings.unshift(w);
      st.todayProgress.writingDone = true;
      const ev = evaluateDemoCompletion();
      return Object.assign(
        { ok: true, isDemo: true, writing: w, student: JSON.parse(JSON.stringify(st)), classStat: { classId: st.classId, checkInRate: 0, isDemo: true } },
        ev
      );
    },
    likeWriting(writingId) {
      const st = demoState.student;
      const w = demoState.writings.find((x) => x.id === writingId);
      if (!w) throw new Error("找不到示範作品");
      if (w.studentId === st.id) throw new Error("把愛心送給其他示範同學吧！");
      if (!w.likedBy.includes(st.id)) {
        w.likedBy.push(st.id);
        w.likes = w.likedBy.length;
        if (!st.todayProgress.likedWritingIds.includes(w.id)) st.todayProgress.likedWritingIds.push(w.id);
        st.todayProgress.likesGivenCount = st.todayProgress.likedWritingIds.length;
      }
      const ev = evaluateDemoCompletion();
      return Object.assign(
        { ok: true, isDemo: true, writing: w, student: JSON.parse(JSON.stringify(st)), classStat: { classId: st.classId, checkInRate: 0, isDemo: true } },
        ev
      );
    }
  };

  function buildCsvFromStudents(students) {
    const lines = ["班級,座號,姓名,年段,今日是否打卡,連續打卡天數,累計打卡次數,目前榮譽稱號"];
    toArray(students).forEach((st) => {
      const bandName = st.band === "low" ? "低年段" : st.band === "mid" ? "中年段" : "高年段";
      const checked = st.checkedInToday ? "已完成" : "未打卡";
      const rk = getRankProgress(st.streakDays);
      const badgeTxt = rk.currentTier ? rk.currentTitle : `衝刺小童生(${rk.stageProgress}/15)`;
      lines.push(`${st.classId},${st.seatNo},${st.name},${bandName},${checked},${st.streakDays},${st.totalCheckIns},${badgeTxt}`);
    });
    return "data:text/csv;charset=utf-8,\uFEFF" + encodeURIComponent(lines.join("\r\n"));
  }

  return {
    RANK_TIERS,
    getRankProgress,
    DemoSandbox,
    getCloudUrl,
    setCloudUrl,
    isCloudConnected,
    syncCustomContentFromCloud,
    buildCsvFromStudents,
    isLocalMode: () => !isCloudConnected() && useLocalMode,
    getToken,
    setToken,
    toArray,
    Sound,
    Speech,
    showToast,
    health: () => request("/api/health"),
    getRoster: () => request("/api/roster"),
    loginStudent: (payload) => request("/api/auth/student", { method: "POST", body: payload }),
    loginStaff: (payload) => request("/api/auth/staff", { method: "POST", body: payload }),
    getMe: () => request("/api/auth/me"),
    getDailyTasks: (band) => request("/api/tasks/daily?band=" + encodeURIComponent(band)),
    saveProgress: (payload) =>
      demoState.active ? Promise.resolve(DemoSandbox.saveProgress(payload)) : request("/api/tasks/progress", { method: "POST", body: payload }),
    getWritings: (classId = "全校") =>
      demoState.active ? Promise.resolve(DemoSandbox.getWritings()) : request("/api/writings?classId=" + encodeURIComponent(classId)),
    postWriting: (payload) =>
      demoState.active ? Promise.resolve(DemoSandbox.postWriting(payload)) : request("/api/writings", { method: "POST", body: payload }),
    likeWriting: (writingId) =>
      demoState.active ? Promise.resolve(DemoSandbox.likeWriting(writingId)) : request("/api/writings/like", { method: "POST", body: { writingId } }),
    featureWriting: (writingId) => request("/api/writings/feature", { method: "POST", body: { writingId } }),
    getLiveSchool: () => request("/api/live/school"),
    getAdminOverview: (classId = "全校") => request("/api/admin/overview?classId=" + encodeURIComponent(classId)),
    addNewsBug: (payload) => request("/api/admin/curriculum/news", { method: "POST", body: payload }),
    resetDemo: () => request("/api/admin/reset-demo", { method: "POST" }),
    getExportCsvUrl: (classId = "全校") => {
      if (useLocalMode && window.IdiomLocalFallback) {
        return window.IdiomLocalFallback.buildCsvDataUrl(classId);
      }
      return "/api/admin/export-csv?classId=" + encodeURIComponent(classId) + "&token=" + encodeURIComponent(getToken());
    }
  };
})();
