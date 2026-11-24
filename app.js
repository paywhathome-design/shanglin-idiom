// ============================================================================
// 上林成語小鎮 - 主應用程式控制器（跨裝置身分登入、無跳動即時連線與七階 15 天晉升系統）
// ============================================================================
(function () {
  const { RANK_TIERS, getRankProgress, toArray, Sound, Speech, showToast } = window.IdiomAPI;

  const appState = {
    userType: null, // student | staff
    student: null,
    staff: null,
    classStat: null,
    liveSchool: null,
    activeStuTab: "tasks", // tasks | rewards | campus
    selectedStaffRole: "管理者校長",
    cozySecRemaining: 300,
    cozyTimerId: null,
    livePollId: null,
    tickerIdx: 0,
    lastCampusSig: "",
    roster: [],
    rosterClass: "1年甲班",
    selectedRosterStudent: null,
    emblemTapCount: 0,
    emblemTapTimer: null,
    bankQuiz: {
      cat: "all",
      current: null,
      feedback: null,
      solvedCount: 0,
      combo: 0,
      bestCombo: 0,
      recentIds: []
    }
  };

  const DEFAULT_STAFF_NAMES = {
    "管理者校長": "洪珮華校長",
    "管理者閱推教師": "閱推教師",
    "管理者教務處主任": "教務處主任",
    "管理者教學組長": "教學組長",
    "教師": "班級導師"
  };

  function escapeHtml(str) {
    return String(str || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function initStaticArt() {
    const brandSlot = document.getElementById("brandLogoSlot");
    if (brandSlot) brandSlot.innerHTML = window.IdiomArt.mascotSvg(48, "happy");
    const loginMascot = document.getElementById("loginMascotSlot");
    if (loginMascot) loginMascot.innerHTML = window.IdiomArt.mascotSvg(156, "happy");
    const stuMascot = document.getElementById("studentMascotMini");
    if (stuMascot) stuMascot.innerHTML = window.IdiomArt.mascotSvg(84, "happy");
  }

  function updateSoundBtn() {
    const btn = document.getElementById("soundToggleBtn");
    if (!btn) return;
    btn.textContent = Sound.isEnabled() ? "🔊 音效開" : "🔇 音效關";
  }

  function startCozyTimer() {
    if (appState.cozyTimerId) clearInterval(appState.cozyTimerId);
    appState.cozySecRemaining = 300;
    const renderTimer = () => {
      const el = document.getElementById("cozyTimerDisplay");
      if (!el) return;
      const m = String(Math.floor(appState.cozySecRemaining / 60)).padStart(2, "0");
      const s = String(appState.cozySecRemaining % 60).padStart(2, "0");
      el.textContent = `⏱ ${m}:${s}`;
    };
    renderTimer();
    appState.cozyTimerId = setInterval(() => {
      if (appState.cozySecRemaining > 0) {
        appState.cozySecRemaining -= 1;
        renderTimer();
      }
    }, 1000);
  }

  // -------------------- 全校即時連線同步引擎（防跳動差異更新） --------------------
  async function pollLiveSchool() {
    try {
      const data = await window.IdiomAPI.getLiveSchool();
      appState.liveSchool = data;

      const statusEl = document.getElementById("liveStatusText");
      if (statusEl) {
        if (window.IdiomAPI.isCloudConnected && window.IdiomAPI.isCloudConnected()) {
          statusEl.textContent = "☁️ 上林雲端試算表即時連線中";
        } else if (window.IdiomAPI.isLocalMode()) {
          statusEl.textContent = "單機體驗模式｜設定雲端網址或啟動伺服器即同步";
        } else {
          statusEl.textContent = `全校即時連線中｜線上 ${data.onlineCount} 裝置`;
        }
      }

      const footerLan = document.getElementById("footerLanHint");
      if (footerLan && data.lanUrl) {
        footerLan.textContent = `跨裝置區網連線網址：${data.lanUrl}`;
      }

      const rEl = document.getElementById("loginSchoolRate");
      const lEl = document.getElementById("loginLeaderCount");
      const sEl = document.getElementById("loginScholarCount");
      if (rEl && data.summary) rEl.textContent = `${data.summary.schoolRate}%`;
      if (lEl && data.summary) lEl.textContent = `${data.summary.leaderClassCount} 班`;
      if (sEl && data.summary) sEl.textContent = `${data.summary.scholarCount} 位`;

      const feed = toArray(data.liveFeed);
      const tickerBar = document.getElementById("liveTickerBar");
      const tickerText = document.getElementById("liveTickerText");
      if (tickerBar && tickerText) {
        tickerBar.classList.remove("hidden");
        if (feed.length > 0) {
          const evt = feed[appState.tickerIdx % feed.length];
          tickerText.textContent = `[${evt.time}] ${evt.text}`;
          appState.tickerIdx = (appState.tickerIdx + 1) % feed.length;
        } else {
          tickerText.textContent = "🌱 雙溪區上林國小成語打卡正式啟航，等待第一位同學完成今日打卡！";
        }
      }

      if (appState.userType === "student" && appState.student) {
        const myCls = toArray(data.classes).find((c) => c.classId === appState.student.classId);
        if (myCls) {
          appState.classStat = myCls;
          const rateEl = document.getElementById("stuClassRateNum");
          if (rateEl) rateEl.textContent = `${myCls.checkInRate}%`;
        }
        // 僅在資料實際有變動時靜默更新全校領航班，絕不重播跳動動畫！
        if (appState.activeStuTab === "campus") {
          renderStudentCampusPanel(false);
        }
        if (appState.student.band === "high" && appState.activeStuTab === "tasks") {
          window.IdiomAPI.getWritings()
            .then((wRes) => window.StudentTasks.updateWritings(wRes.writings))
            .catch(() => {});
        }
      }
    } catch {
      const statusEl = document.getElementById("liveStatusText");
      if (statusEl) statusEl.textContent = "重新連線中...";
    }
  }

  function startLivePolling() {
    pollLiveSchool();
    if (appState.livePollId) clearInterval(appState.livePollId);
    const intervalMs = window.IdiomAPI.isCloudConnected && window.IdiomAPI.isCloudConnected() ? 8000 : 4000;
    appState.livePollId = setInterval(pollLiveSchool, intervalMs);
  }

  // -------------------- 檢視切換 --------------------
  function showView(viewName) {
    document.getElementById("authView").classList.toggle("hidden", viewName !== "auth");
    document.getElementById("studentView").classList.toggle("hidden", viewName !== "student");
    document.getElementById("adminView").classList.toggle("hidden", viewName !== "admin");

    const chip = document.getElementById("userChip");
    const logoutBtn = document.getElementById("logoutBtn");
    const goTeacherBtn = document.getElementById("goTeacherPortalBtn");
    if (viewName === "auth") {
      chip.classList.add("hidden");
    } else {
      chip.classList.remove("hidden");
      const badge = document.getElementById("userChipBadge");
      const name = document.getElementById("userChipName");
      if (viewName === "student" && appState.student) {
        const isDemo = Boolean(appState.student.isDemo);
        const canSwitchNext = Boolean(appState.student.checkedInToday && !isDemo);
        badge.textContent = isDemo ? "🎬 示範模式" : `${appState.student.classId} ${String(appState.student.seatNo).padStart(2, "0")}號`;
        name.textContent = appState.student.name;
        // 學生未完成今日打卡前不顯示切換按鈕；完成今日打卡練習後立刻顯示「換下一位同學」，方便共用平板／手機接續登入
        if (logoutBtn) {
          logoutBtn.textContent = "👋 換下一位同學";
          logoutBtn.classList.toggle("hidden", !canSwitchNext);
        }
        if (goTeacherBtn) goTeacherBtn.classList.toggle("hidden", isDemo);
      } else if (viewName === "admin" && appState.staff) {
        badge.textContent = appState.staff.role;
        name.textContent = appState.staff.name;
        // 教師與管理者端保留切換帳號按鈕
        if (logoutBtn) {
          logoutBtn.textContent = "切換帳號";
          logoutBtn.classList.remove("hidden");
        }
        if (goTeacherBtn) goTeacherBtn.classList.add("hidden");
      }
    }
  }

  // -------------------- 載入學生畫面（支援真實學生與管理者虛擬示範生） --------------------
  async function enterStudentPortal(student, classStat) {
    appState.userType = "student";
    appState.student = student;
    appState.classStat = classStat;
    appState.activeStuTab = "tasks";
    appState.lastCampusSig = "";

    const demoBar = document.getElementById("demoModeBar");
    if (demoBar) {
      demoBar.classList.toggle("hidden", !student.isDemo);
      if (student.isDemo) {
        demoBar.querySelectorAll("[data-demo-band]").forEach((btn) => {
          btn.classList.toggle("btn-primary", btn.dataset.demoBand === student.band);
          btn.classList.toggle("btn-chip", btn.dataset.demoBand !== student.band);
        });
      }
    }

    showView("student");
    renderStudentBanner();
    startCozyTimer();
    setActiveStudentTab("tasks");

    try {
      const [taskRes, wRes] = await Promise.all([
        window.IdiomAPI.getDailyTasks(student.band),
        student.band === "high" ? window.IdiomAPI.getWritings() : Promise.resolve({ writings: [] })
      ]);
      window.StudentTasks.init(student, taskRes.curriculum, wRes.writings, handleStudentProgressUpdated);
    } catch (err) {
      showToast("載入每日任務失敗：" + err.message);
    }
    pollLiveSchool();
  }

  async function enterDemoStudent(band) {
    if (!window.IdiomAPI.DemoSandbox) return;
    window.StudentTasks.stopMedia();
    Speech.stop();
    const { student, classStat } = window.IdiomAPI.DemoSandbox.start(band);
    showToast(`🎬 已啟動「${student.name}」教學示範（絕不計入全校統計）`);
    await enterStudentPortal(student, classStat);
  }

  async function exitDemoToAdmin() {
    if (window.IdiomAPI.DemoSandbox) window.IdiomAPI.DemoSandbox.stop();
    window.StudentTasks.stopMedia();
    Speech.stop();
    const demoBar = document.getElementById("demoModeBar");
    if (demoBar) demoBar.classList.add("hidden");
    appState.student = null;
    if (appState.staff) {
      await enterStaffPortal(appState.staff);
      showToast("🔙 已返回教師與管理者戰情室（全校數據未受示範影響）");
    } else {
      showView("auth");
    }
  }

  function switchToNextStudent() {
    if (window.IdiomAPI.DemoSandbox) window.IdiomAPI.DemoSandbox.stop();
    window.StudentTasks.stopMedia();
    Speech.stop();
    if (appState.timerId) {
      clearInterval(appState.timerId);
      appState.timerId = null;
    }
    const modal = document.getElementById("celebrationModal");
    if (modal) modal.classList.add("hidden");
    window.IdiomAPI.setToken("", true);
    appState.userType = null;
    appState.student = null;
    appState.staff = null;
    appState.selectedRosterStudent = null;
    appState.lastCampusSig = "";
    showView("auth");
    // 自動切換至學生點名登入頁籤並刷新名單，讓下一位同學立刻點選名字登入
    const tabStuEl = document.getElementById("tabStudentMode");
    if (tabStuEl) tabStuEl.click();
    loadRosterPicker();
    window.scrollTo({ top: 0, behavior: "smooth" });
    showToast("👋 練習完成已登出！請下一位同學選擇班級與自己的名字登入");
  }

  window.AppActions = { enterDemoStudent, exitDemoToAdmin, switchToNextStudent };

  function renderStudentBanner() {
    const st = appState.student;
    if (!st) return;
    const rank = getRankProgress(st.streakDays);
    const bandLabel = st.band === "low" ? "低年段（1～2 年級）" : st.band === "mid" ? "中年段（3～4 年級）" : "高年段（5～6 年級）";

    document.getElementById("stuBandPill").textContent = bandLabel;
    document.getElementById("stuClassSeatPill").textContent = `${st.classId} ${st.seatNo}號`;
    document.getElementById("stuDonePill").classList.toggle("hidden", !st.checkedInToday);
    document.getElementById("stuGreetingTitle").textContent = st.checkedInToday
      ? `🎉 太棒了，${st.name}！你已完成今天的 5 分鐘成語打卡！`
      : `哈囉，${st.name}！準備好今天的 5 分鐘成語冒險了嗎？`;

    const subEl = document.getElementById("stuGreetingSub");
    if (subEl) {
      subEl.textContent = rank.isMax
        ? `你已登上最高殿堂「${rank.currentTitle}」，繼續保持每天 5 分鐘語文好習慣吧！`
        : `目前稱號「${rank.currentTitle}」，再連續打卡 ${rank.remainDays} 天即可晉升「${rank.nextTier.title}」！`;
    }

    // 學生完成今日打卡後，在橫幅區與頂部同步顯示「👋 練習完成・換下一位同學登入」大按鈕
    const canSwitchNext = Boolean(st.checkedInToday && !st.isDemo);
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn && appState.userType === "student") {
      logoutBtn.textContent = "👋 換下一位同學";
      logoutBtn.classList.toggle("hidden", !canSwitchNext);
    }
    if (subEl && subEl.parentElement) {
      let nextWrap = document.getElementById("nextStudentBannerAction");
      if (!nextWrap) {
        nextWrap = document.createElement("div");
        nextWrap.id = "nextStudentBannerAction";
        nextWrap.style.marginTop = "12px";
        nextWrap.innerHTML = `<button type="button" class="btn btn-primary" id="btnNextStudentBanner">👋 練習完成！換下一位同學登入</button>`;
        subEl.parentElement.appendChild(nextWrap);
        const btnEl = nextWrap.querySelector("#btnNextStudentBanner");
        if (btnEl) {
          btnEl.addEventListener("click", () => {
            Sound.click();
            switchToNextStudent();
          });
        }
      }
      nextWrap.classList.toggle("hidden", !canSwitchNext);
    }

    document.getElementById("stuStreakNum").textContent = String(rank.streakDays);
    const titleShort = document.getElementById("stuRankTitleShort");
    if (titleShort) titleShort.textContent = rank.currentTitle;
    const rankLabel = document.getElementById("stuRankLabel");
    if (rankLabel) {
      rankLabel.textContent = rank.isMax
        ? "最高殿堂稱號"
        : `衝刺 ${rank.nextTier.title} (${rank.stageProgress}/15)`;
    }

    const rate = appState.classStat ? appState.classStat.checkInRate : 0;
    document.getElementById("stuClassRateNum").textContent = `${rate}%`;

    const mascotSlot = document.getElementById("studentMascotMini");
    if (mascotSlot) {
      mascotSlot.innerHTML = window.IdiomArt.mascotSvg(84, st.checkedInToday ? "celebrate" : "happy");
    }
  }

  function handleStudentProgressUpdated(res) {
    if (res && res.student) {
      appState.student = res.student;
      window.StudentTasks.syncStudent(res.student);
    }
    if (res && res.classStat) {
      appState.classStat = res.classStat;
    }
    renderStudentBanner();
    renderStudentRewardsPanel();
    pollLiveSchool();

    if (res && (res.newlyEarnedScholar || res.newlyEarnedClassAward || res.newlyCheckedIn)) {
      Sound.celebrate();
      openCelebrationModal(res);
    }
  }

  function openCelebrationModal(res) {
    const st = appState.student;
    const cls = appState.classStat;
    const rank = getRankProgress(st.streakDays);
    let html = "";

    if (res.newlyEarnedScholar && rank.currentTier) {
      html += `
        <div style="margin-bottom:14px;">${window.IdiomArt.scholarBadgeSvg(146, true, rank.currentTier.title, rank.currentTier.requiredDays)}</div>
        <span class="pill-tag pill-gold">第 ${rank.currentTier.level} 階晉升成功・連續滿 ${rank.streakDays} 天！</span>
        <h2 style="font-size:25px;margin:10px 0 8px;">${rank.currentTier.icon} 恭喜晉升「${escapeHtml(rank.currentTier.title)}」！</h2>
        <p class="pretty-paragraph">
          ${escapeHtml(st.classId)} ${st.seatNo}號 <strong>${escapeHtml(st.name)}</strong> 連續打卡滿 <strong>${rank.streakDays} 天</strong>，
          正式獲得「<strong>${escapeHtml(rank.currentTier.title)}</strong>」數位榮耀徽章！
          ${rank.isMax ? "你已登上成語最高殿堂！" : `下一階段將邁向「<strong>${escapeHtml(rank.nextTier.title)}</strong>」（滿 ${rank.nextTier.requiredDays} 天）！`}
        </p>
      `;
    } else {
      html += `
        <div style="margin-bottom:12px;">${window.IdiomArt.mascotSvg(124, "celebrate")}</div>
        <span class="pill-tag ${st.isDemo ? "pill-gold" : "pill-mint"}">${st.isDemo ? "🎬 教學示範打卡完成（不計入全校統計）" : "✨ 本日 5 分鐘打卡成功！"}</span>
        <h2 style="font-size:24px;margin:10px 0 8px;">太厲害了，${escapeHtml(st.name)}！</h2>
        <p class="pretty-paragraph">
          ${
            st.isDemo
              ? "本次為管理者虛擬學生示範操作，完整展示打卡流程與獎勵彈窗，不會寫入任何真實班級或全校累計數據喔！"
              : `你已連續打卡 <strong>${rank.streakDays} 天</strong>，${rank.isMax ? "穩居最高殿堂「成語大宗師」！" : `再堅持 <strong>${rank.remainDays} 天</strong> 就能晉升下一階段「<strong>${escapeHtml(rank.nextTier.title)}</strong>」囉！`}`
          }
        </p>
      `;
    }

    if (res.newlyEarnedClassAward && cls) {
      const starsCount = Number(cls.invincibleStars || 0);
      const leaderDays = Number(cls.leaderDays || 0);
      const justEarnedStar = leaderDays > 0 && leaderDays % 15 === 0;
      html += `
        <div style="margin-top:18px;padding:16px;border-radius:18px;background:linear-gradient(135deg,#FFF9E6,#FFEFC2);border:2px solid #F4B400;">
          <div style="font-size:28px;margin-bottom:4px;">${justEarnedStar ? "🏆⭐" : "🏆"}</div>
          <h3 style="color:#9A6200;margin-bottom:6px;">第二獎同步引爆！「數位語文領航班」</h3>
          <p class="pretty-paragraph" style="font-size:14.5px;color:#7A4E00;">
            因為你的關鍵打卡，<strong>${escapeHtml(cls.classId)}</strong> 今日開機打卡率已突破 <strong>${cls.checkInRate}%</strong>（達 90% 以上），立即閃耀金色光芒並獲頒「數位語文領航班」獎！
            ${justEarnedStar ? `<br><strong>⭐ 恭喜全班累計達標滿 ${leaderDays} 日，獲得第 ${starsCount} 顆「無敵星星」！</strong>` : ""}
          </p>
        </div>
      `;
    }

    if (!st.isDemo) {
      html += `
        <div style="margin-top:18px;display:flex;justify-content:center;flex-wrap:wrap;gap:10px;">
          <button type="button" class="btn btn-primary" id="celebrationNextStudentBtn">👋 練習完成！換下一位同學登入</button>
        </div>
      `;
    }

    document.getElementById("celebrationModalBody").innerHTML = html;
    const nextBtn = document.getElementById("celebrationNextStudentBtn");
    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        Sound.click();
        switchToNextStudent();
      });
    }
    document.getElementById("celebrationModal").classList.remove("hidden");
  }

  function setActiveStudentTab(tabName) {
    appState.activeStuTab = tabName;
    document.querySelectorAll("[data-stu-tab]").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.stuTab === tabName);
    });
    const tasksEl = document.getElementById("stuTabTasks");
    const bankEl = document.getElementById("stuTabBank500");
    const rewardsEl = document.getElementById("stuTabRewards");
    const campusEl = document.getElementById("stuTabCampus");

    if (tasksEl) tasksEl.classList.toggle("hidden", tabName !== "tasks");
    if (bankEl) bankEl.classList.toggle("hidden", tabName !== "bank500");
    if (rewardsEl) rewardsEl.classList.toggle("hidden", tabName !== "rewards");
    if (campusEl) campusEl.classList.toggle("hidden", tabName !== "campus");

    if (tabName === "bank500") renderBank500Panel();
    if (tabName === "rewards") renderStudentRewardsPanel();
    if (tabName === "campus") {
      appState.lastCampusSig = "";
      renderStudentCampusPanel(true);
    }
  }

  // -------------------- 分頁一之二：500+ 成語隨機大挑戰刷題區 (index2.html) --------------------
  function renderBank500Panel() {
    const root = document.getElementById("studentBank500Panel");
    if (!root || !window.IdiomBank500) return;

    const stats = window.IdiomBank500.getStats();
    const bq = appState.bankQuiz;
    if (!bq.current) {
      bq.current = window.IdiomBank500.drawRandomQuiz(bq.cat, bq.recentIds);
    }
    const q = bq.current;
    const isSolved = Boolean(bq.feedback && bq.feedback.ok);

    const cats = [
      { id: "all", label: `🌟 全部成語 (${stats.total})` },
      { id: "num", label: `🔢 數字成語 (${stats.num})` },
      { id: "nature", label: `🦊 動植物自然 (${stats.nature})` },
      { id: "bug", label: `🗞️ 易錯字必考 (${stats.bug})` },
      { id: "life", label: `💬 生活常用 (${stats.life})` },
      { id: "study", label: `📚 學習勵志 (${stats.study})` },
      { id: "story", label: `📖 歷史典故 (${stats.story})` }
    ];

    root.innerHTML = `
      <div class="task-card glass-card no-pop-anim">
        <div class="task-header">
          <div>
            <span class="pill-tag pill-purple">📚 上林國小專屬・${stats.total} 個成語隨機大題庫</span>
            <h3 style="margin-top:8px;">🎲 500+ 成語隨機刷題大挑戰</h3>
            <p class="pretty-paragraph" style="margin-top:4px;">
              可自由切換六大主題分類，每次隨機從 <strong>${stats.total} 個</strong>不重複成語中出題，一起累積連勝紀錄吧！
            </p>
          </div>
          <div style="display:flex;flex-wrap:wrap;gap:8px;">
            <span class="pill-tag pill-mint">✔ 本次答對 ${bq.solvedCount} 題</span>
            <span class="pill-tag pill-gold">🔥 目前連勝 ${bq.combo} 題（最高 ${bq.bestCombo}）</span>
          </div>
        </div>

        <div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:18px;">
          ${cats
            .map(
              (c) => `
              <button type="button" class="btn ${bq.cat === c.id ? "btn-primary" : "btn-chip"}" data-bank-cat="${c.id}">
                ${c.label}
              </button>`
            )
            .join("")}
        </div>

        <div class="nature-clue-card">
          <div style="display:flex;justify-content:center;gap:8px;flex-wrap:wrap;margin-bottom:10px;">
            <span class="pill-tag pill-blue">${escapeHtml(q.catLabel)}</span>
            <span class="pill-tag pill-purple">隨機題號 #${escapeHtml(q.id.replace("idm-", ""))} / ${stats.total}</span>
          </div>
          <div class="nature-emoji-badge">${escapeHtml(q.extra || "✨")}</div>
          <p class="pretty-paragraph" style="font-size:18px;font-weight:800;color:var(--ink-dark);max-width:660px;margin:0 auto;">
            「${escapeHtml(q.meaning)}」
          </p>
          <p style="font-size:13.5px;color:var(--ink-muted);margin-top:8px;font-weight:700;">
            👇 請選出最符合上述釋義的四字成語！
          </p>
        </div>

        <div class="touch-options-grid" style="margin-top:18px;">
          ${q.options
            .map((opt) => {
              let cls = "option-btn";
              if (bq.feedback && bq.feedback.picked === opt) {
                cls += bq.feedback.ok ? " correct" : " wrong";
              }
              return `<button type="button" class="${cls}" data-bank-opt="${escapeHtml(opt)}" ${isSolved ? "disabled" : ""}>${escapeHtml(opt)}</button>`;
            })
            .join("")}
        </div>

        ${
          bq.feedback
            ? `<div class="feedback-banner ${bq.feedback.ok ? "success" : "error"}">
                <strong>${bq.feedback.ok ? "🎉 答對了！" : "💭 再想想看喔！"}</strong>
                ${escapeHtml(bq.feedback.message)}
               </div>`
            : ""
        }

        <div style="margin-top:16px;display:flex;flex-wrap:wrap;gap:10px;">
          <button type="button" class="btn ${isSolved ? "btn-primary" : "btn-secondary"}" id="btnBankNext">
            ${isSolved ? "➡️ 下一題隨機成語" : "🎲 跳過換一題隨機成語"}
          </button>
        </div>
      </div>
    `;

    root.querySelectorAll("[data-bank-cat]").forEach((btn) => {
      btn.addEventListener("click", () => {
        Sound.click();
        bq.cat = btn.dataset.bankCat;
        bq.feedback = null;
        bq.current = window.IdiomBank500.drawRandomQuiz(bq.cat, bq.recentIds);
        renderBank500Panel();
      });
    });

    root.querySelectorAll("[data-bank-opt]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const picked = btn.dataset.bankOpt;
        if (picked === q.idiom) {
          Sound.correct();
          bq.solvedCount += 1;
          bq.combo += 1;
          if (bq.combo > bq.bestCombo) bq.bestCombo = bq.combo;
          bq.recentIds.push(q.id);
          if (bq.recentIds.length > 120) bq.recentIds.shift();
          const extraTip = q.wrongSeg ? `（小心別寫成「${q.wrongSeg}」：${q.wrongExplain}）` : "";
          bq.feedback = { ok: true, picked, message: `正解「${q.idiom}」：${q.meaning}${extraTip}` };
        } else {
          Sound.wrong();
          bq.combo = 0;
          bq.feedback = { ok: false, picked, message: `「${picked}」不太符合喔，再讀一次釋義試試看！` };
        }
        renderBank500Panel();
      });
    });

    const btnNext = document.getElementById("btnBankNext");
    if (btnNext) {
      btnNext.addEventListener("click", () => {
        Sound.click();
        bq.feedback = null;
        bq.current = window.IdiomBank500.drawRandomQuiz(bq.cat, bq.recentIds);
        renderBank500Panel();
      });
    }
  }

  // -------------------- 分頁二：七階 15 天晉升徽章牆 --------------------
  function renderStudentRewardsPanel() {
    const root = document.getElementById("studentRewardsPanel");
    const st = appState.student;
    if (!root || !st) return;

    const rank = getRankProgress(st.streakDays);

    // 7 階科舉稱號晉升路線圖（每一階簡潔呈現，去掉「成語」二字）
    const ladderHtml = RANK_TIERS.map((tier) => {
      const unlocked = rank.streakDays >= tier.requiredDays;
      const isTarget = !rank.isMax && rank.nextTier.level === tier.level;
      const isHighest = rank.currentTier && rank.currentTier.level === tier.level;
      let cls = "rank-tier-card";
      if (isHighest) cls += " unlocked highest";
      else if (unlocked) cls += " unlocked";
      else if (isTarget) cls += " current-target";

      const shortName = tier.shortTitle || tier.title.replace(/^成語/, "");

      return `
        <div class="${cls}">
          <span style="font-size:26px;line-height:1.1;">${tier.icon}</span>
          <strong style="font-size:15.5px;">第 ${tier.level} 階・${escapeHtml(shortName)}</strong>
          <span style="font-size:12px;font-weight:700;">滿 ${tier.requiredDays} 天</span>
          <span class="pill-tag ${unlocked ? "pill-mint" : isTarget ? "pill-gold" : "pill-purple"}" style="font-size:11.5px;padding:3px 9px;">
            ${isHighest ? "✨ 目前稱號" : unlocked ? "✔ 已晉升" : isTarget ? "🔥 挑戰中" : "🔒 未解鎖"}
          </span>
        </div>
      `;
    }).join("");

    // 本階段 15 天集星格（集滿 15 天自動進入下一個 15 天區間！）
    const stamps = Array.from({ length: 15 }, (_, i) => {
      const actualDay = rank.stageStartDay + i;
      const isEarned = actualDay <= rank.streakDays;
      const isMilestone = i === 14;
      const milestoneShort = rank.isMax ? "大宗師" : (rank.nextTier.shortTitle || rank.nextTier.title.replace(/^成語/, ""));
      return `
        <div class="day-stamp ${isEarned ? (isMilestone ? "milestone" : "earned") : ""}">
          <span style="font-size:22px;">${isEarned ? (isMilestone ? rank.nextTier.icon : "⭐") : "☁️"}</span>
          <strong style="font-size:14px;">第 ${actualDay} 天</strong>
          <span style="font-size:12px;">${isMilestone ? milestoneShort : isEarned ? "已打卡" : "集星中"}</span>
        </div>
      `;
    }).join("");

    const certTier = rank.currentTier || rank.nextTier;
    const certUnlocked = Boolean(rank.currentTier);
    const nextShortName = rank.nextTier.shortTitle || rank.nextTier.title.replace(/^成語/, "");

    root.innerHTML = `
      <div class="task-card glass-card no-pop-anim">
        <div class="task-header no-print">
          <div>
            <span class="pill-tag pill-gold">第一獎・每滿 15 天自動晉升下一階段</span>
            <h3 style="margin-top:8px;">🎓 七階成語榮耀晉升路線圖</h3>
            <p class="pretty-paragraph" style="margin-top:4px;">
              ${
                rank.isMax
                  ? `恭喜 ${escapeHtml(st.name)}！你已連續打卡 <strong>${rank.streakDays} 天</strong>，榮登最高殿堂「<strong>${escapeHtml(rank.currentTitle)}</strong>」！`
                  : `目前連續打卡 <strong>${rank.streakDays} 天</strong>（目前稱號：<strong>${escapeHtml(rank.currentTitle)}</strong>），本階段集星 <strong>${rank.stageProgress} / 15 天</strong>，再堅持 <strong>${rank.remainDays} 天</strong> 即晉升「<strong>${escapeHtml(nextShortName)}</strong>」！`
              }
            </p>
          </div>
          <span class="pill-tag pill-purple">
            ${rank.isMax ? "🐉 已達最高第 7 階" : `本階段 ${rank.stageProgress} / 15 天`}
          </span>
        </div>

        <div class="rank-ladder-grid no-print">${ladderHtml}</div>

        <h4 class="no-print" style="font-size:17px;margin-top:8px;">
          ✨ 本階段 15 天連續打卡集星牆（第 ${rank.stageStartDay} ～ ${rank.stageEndDay} 天 → 目標：${escapeHtml(nextShortName)}）
        </h4>
        <div class="streak-grid-15 no-print">${stamps}</div>

        <div class="badge-certificate" id="printableCertificate">
          <div style="display:flex;align-items:center;justify-content:center;gap:10px;margin-bottom:10px;">
            <img src="assets/shanglin-emblem.png" alt="雙溪區上林國小校徽" style="width:40px;height:40px;object-fit:contain;">
            <span style="font-family:var(--font-display);font-size:16px;font-weight:900;color:var(--purple-deep);letter-spacing:0.08em;">
              新北市雙溪區上林國小・上林成語小鎮
            </span>
          </div>
          <div>${window.IdiomArt.scholarBadgeSvg(160, certUnlocked, certTier.title, certTier.requiredDays)}</div>
          <h3 style="font-size:23px;margin:12px 0 10px;">
            ${certUnlocked ? `✨ 榮譽數位證書：${escapeHtml(certTier.title)} ✨` : `🔒 距離第 1 階「${escapeHtml(certTier.title)}」還差 ${rank.remainDays} 天`}
          </h3>
          <p class="pretty-paragraph" style="max-width:560px;margin:0 auto 16px;font-size:16px;color:var(--ink-dark);">
            茲證明 <strong>${escapeHtml(st.classId)} ${st.seatNo}號 ${escapeHtml(st.name)}</strong> 同學，
            持之以恆完成每日 5 分鐘成語打卡（累計連續 <strong>${rank.streakDays} 天</strong>），展現卓越語文實力，特頒此數位榮譽徽章！
          </p>
          <div class="no-print">
            ${
              certUnlocked
                ? `<button type="button" class="btn btn-primary" onclick="window.print()">🖨️ 列印或收藏數位徽章證書</button>`
                : `<button type="button" class="btn btn-secondary" id="btnBackToTasksFromReward">🎯 回到今日任務繼續集星</button>`
            }
          </div>
        </div>
      </div>
    `;

    const backBtn = document.getElementById("btnBackToTasksFromReward");
    if (backBtn) {
      backBtn.addEventListener("click", () => {
        Sound.click();
        setActiveStudentTab("tasks");
      });
    }
  }

  // -------------------- 分頁三：第二獎・全校即時連線班級領航班（穩定無跳動） --------------------
  function renderStudentCampusPanel(forceRender = false) {
    const root = document.getElementById("studentCampusPanel");
    const data = appState.liveSchool;
    if (!root || !data) return;

    const myClassId = appState.student ? appState.student.classId : "";
    const sig = JSON.stringify({
      myClassId,
      summary: data.summary,
      classes: data.classes,
      scholars: toArray(data.scholars).map((s) => ({ id: s.id, streakDays: s.streakDays })),
      liveFeed: toArray(data.liveFeed).slice(0, 8)
    });

    if (!forceRender && sig === appState.lastCampusSig) {
      return; // 資料無變動，不重建 DOM，徹底杜絕頁面跳動！
    }
    appState.lastCampusSig = sig;

    const classes = toArray(data.classes);
    const scholars = toArray(data.scholars);
    const feed = toArray(data.liveFeed);

    root.innerHTML = `
      <div class="task-card glass-card no-pop-anim">
        <div class="task-header">
          <div>
            <span class="pill-tag pill-gold">第二獎・班級團體激勵機制</span>
            <h3 style="margin-top:8px;">🏆 全校即時連線・90%「數位語文領航班」榮譽榜</h3>
            <p class="pretty-paragraph" style="margin-top:4px;">
              全班每日開機打卡率達 <strong>90% 以上</strong>，立即閃耀金色光芒並獲頒「數位語文領航班」獎；累計達標滿 <strong>15 日</strong> 即得一顆「<strong>無敵星星 ⭐</strong>」，依序累計呈現！
            </p>
          </div>
          <div style="display:flex;align-items:center;gap:10px;">
            ${window.IdiomArt.leaderTrophySvg(72)}
            <div>
              <div style="font-size:13px;color:var(--ink-muted);font-weight:700;">今日已達標班級</div>
              <div style="font-family:var(--font-display);font-size:24px;font-weight:900;color:var(--purple-deep);">
                ${data.summary.leaderClassCount} / ${data.summary.totalClasses} 班
              </div>
            </div>
          </div>
        </div>

        <div class="class-board-grid">
          ${classes
            .map((c) => {
              const isMine = myClassId && c.classId === myClassId;
              const leaderDays = Number(c.leaderDays || 0);
              const stars = Number(c.invincibleStars !== undefined ? c.invincibleStars : Math.floor(leaderDays / 15));
              const progressInCycle = leaderDays % 15;
              const remainToNext = 15 - progressInCycle;
              const starsHtml =
                stars > 0
                  ? Array.from({ length: stars }, (_, idx) => `<span class="invincible-star-item" title="第 ${idx + 1} 顆無敵星星">⭐</span>`).join("")
                  : `<span class="invincible-star-empty" title="累計 15 日即解鎖第 1 顆無敵星星">☆</span>`;

              return `
                <div class="class-rate-card ${c.isLeaderClass ? "leader" : ""}">
                  <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap;">
                    <div>
                      <strong style="font-size:19px;">${escapeHtml(c.classId)}</strong>
                      ${isMine ? '<span class="pill-tag pill-purple" style="margin-left:6px;">我的班級</span>' : ""}
                    </div>
                    ${
                      c.isLeaderClass
                        ? '<span class="pill-tag pill-gold">🏆 數位語文領航班</span>'
                        : '<span class="pill-tag pill-blue">加油衝刺中</span>'
                    }
                  </div>
                  <div class="rate-bar-wrap">
                    <div class="rate-bar-fill ${c.isLeaderClass ? "gold" : ""}" style="width:${c.checkInRate}%"></div>
                    <div class="rate-threshold-line"></div>
                  </div>
                  <div style="display:flex;justify-content:space-between;font-size:14px;font-weight:700;">
                    <span>今日已打卡 ${c.checkedInCount} / ${c.totalStudents} 人</span>
                    <span style="color:${c.isLeaderClass ? "#B87400" : "var(--purple-deep)"};">${c.checkInRate}%</span>
                  </div>

                  <div class="invincible-stars-box">
                    <div class="invincible-stars-row">
                      <span class="star-meta-text">✨ 無敵星星（累計 ${stars} 顆）</span>
                      <div class="stars-sequence">${starsHtml}</div>
                    </div>
                    <div style="font-size:12px;color:var(--ink-body);font-weight:600;">
                      已累計達標 90% 共 <strong>${leaderDays}</strong> 日（本輪 ${progressInCycle}/15 日，再 ${remainToNext} 日得第 ${stars + 1} 顆無敵星星！）
                    </div>
                  </div>
                </div>`;
            })
            .join("")}
        </div>
      </div>

      <div class="task-card glass-card no-pop-anim">
        <h3 style="margin-bottom:12px;">🌟 全校七階成語榮譽名人堂（連續滿 15 天以上）</h3>
        <div style="display:flex;flex-wrap:wrap;gap:10px;margin-bottom:22px;">
          ${
            scholars.length > 0
              ? scholars
                  .map((s) => {
                    const rk = getRankProgress(s.streakDays);
                    return `<span class="pill-tag pill-gold">${rk.currentIcon} ${escapeHtml(s.classId)} ${escapeHtml(s.name)}・${escapeHtml(rk.currentTitle)}（${s.streakDays}天）</span>`;
                  })
                  .join("")
              : `<p class="pretty-paragraph" style="font-size:14.5px;color:var(--ink-muted);">目前尚未有同學達到第 1 階，大家一起努力成為第一位「成語小童生」吧！</p>`
          }
        </div>

        <h3 style="margin-bottom:12px;">📡 全校即時連線打卡動態</h3>
        <div style="display:flex;flex-direction:column;gap:8px;">
          ${
            feed.length > 0
              ? feed
                  .slice(0, 8)
                  .map(
                    (e) => `
                    <div style="padding:10px 14px;border-radius:14px;background:#F7F5FF;border:1px solid rgba(139,121,246,0.18);font-size:14px;line-height:1.6;">
                      <strong style="color:var(--purple-deep);margin-right:8px;">${escapeHtml(e.time)}</strong>
                      <span>${escapeHtml(e.text)}</span>
                    </div>`
                  )
                  .join("")
              : `<p class="pretty-paragraph" style="font-size:14.5px;color:var(--ink-muted);">🌱 目前尚無打卡紀錄，完成今天的 5 分鐘成語任務就會立刻登上全校即時動態喔！</p>`
          }
        </div>
      </div>
    `;
  }

  // -------------------- 載入教師/管理者畫面 --------------------
  async function enterStaffPortal(staff) {
    appState.userType = "staff";
    appState.staff = staff;
    showView("admin");
    await window.AdminPanel.init(staff);
    pollLiveSchool();
  }

  // -------------------- 綁定全域與登入表單事件 --------------------
  function bindGlobalEvents() {
    document.getElementById("soundToggleBtn").addEventListener("click", () => {
      Sound.toggle();
      updateSoundBtn();
    });

    document.getElementById("closeCelebrationBtn").addEventListener("click", () => {
      Sound.click();
      document.getElementById("celebrationModal").classList.add("hidden");
    });

    document.getElementById("logoutBtn").addEventListener("click", () => {
      Sound.click();
      if (appState.userType === "student") {
        switchToNextStudent();
        return;
      }
      if (window.IdiomAPI.DemoSandbox) window.IdiomAPI.DemoSandbox.stop();
      window.StudentTasks.stopMedia();
      Speech.stop();
      window.IdiomAPI.setToken("", true);
      appState.userType = null;
      appState.student = null;
      appState.staff = null;
      appState.lastCampusSig = "";
      showView("auth");
      showToast("已登出，歡迎切換其他師長或學生帳號！");
    });

    // 管理者教學示範控制條事件 (index3.html)
    document.querySelectorAll("[data-demo-band]").forEach((btn) => {
      btn.addEventListener("click", () => {
        Sound.click();
        enterDemoStudent(btn.dataset.demoBand);
      });
    });
    const btnResetDemoProg = document.getElementById("btnResetDemoProgress");
    if (btnResetDemoProg) {
      btnResetDemoProg.addEventListener("click", () => {
        Sound.click();
        if (appState.student && appState.student.isDemo) {
          enterDemoStudent(appState.student.band);
        }
      });
    }
    const btnExitDemo = document.getElementById("btnExitDemoToAdmin");
    if (btnExitDemo) {
      btnExitDemo.addEventListener("click", () => {
        Sound.click();
        exitDemoToAdmin();
      });
    }

    const tabStu = document.getElementById("tabStudentMode");
    const tabStf = document.getElementById("tabStaffMode");
    const formStu = document.getElementById("studentLoginForm");
    const formStf = document.getElementById("staffLoginForm");

    tabStu.addEventListener("click", () => {
      Sound.click();
      tabStu.classList.add("active");
      tabStf.classList.remove("active");
      formStu.classList.remove("hidden");
      formStf.classList.add("hidden");
    });

    tabStf.addEventListener("click", () => {
      Sound.click();
      tabStf.classList.add("active");
      tabStu.classList.remove("active");
      formStf.classList.remove("hidden");
      formStu.classList.add("hidden");
    });

    document.querySelectorAll("[data-demo-stu]").forEach((btn) => {
      btn.addEventListener("click", () => {
        Sound.click();
        const [cls, seat, name] = btn.dataset.demoStu.split("|");
        document.getElementById("stuClassInput").value = cls;
        document.getElementById("stuSeatInput").value = seat;
        document.getElementById("stuNameInput").value = name;
        formStu.requestSubmit();
      });
    });

    // 學生端右上角「👩‍🏫 教師端登入」按鈕與師長驗證彈窗
    const goTeacherBtn = document.getElementById("goTeacherPortalBtn");
    const staffModal = document.getElementById("staffSwitchModal");
    const closeStaffModalBtn = document.getElementById("closeStaffModalBtn");
    const modalStaffForm = document.getElementById("modalStaffLoginForm");
    const btnBackHomeStaff = document.getElementById("btnBackToHomeStaff");
    let modalRole = "管理者校長";

    if (goTeacherBtn && staffModal) {
      goTeacherBtn.addEventListener("click", () => {
        Sound.click();
        const errEl = document.getElementById("modalStaffLoginError");
        if (errEl) errEl.classList.add("hidden");
        staffModal.classList.remove("hidden");
      });
    }
    if (closeStaffModalBtn && staffModal) {
      closeStaffModalBtn.addEventListener("click", () => {
        Sound.click();
        staffModal.classList.add("hidden");
      });
    }
    if (btnBackHomeStaff && staffModal) {
      btnBackHomeStaff.addEventListener("click", () => {
        Sound.click();
        const passVal = (document.getElementById("modalStaffPassInput")?.value || "").trim();
        if (!["school2026", "1234", "admin"].includes(passVal)) {
          const errEl = document.getElementById("modalStaffLoginError");
          if (errEl) {
            errEl.textContent = "請先輸入正確的校內通行碼（預設 school2026）才能返回首頁教師登入喔！";
            errEl.classList.remove("hidden");
          }
          return;
        }
        staffModal.classList.add("hidden");
        window.StudentTasks.stopMedia();
        Speech.stop();
        window.IdiomAPI.setToken("");
        appState.userType = null;
        appState.student = null;
        showView("auth");
        // 自動切換至首頁的「教師與管理者登入」頁籤
        const tabStfEl = document.getElementById("tabStaffMode");
        if (tabStfEl) tabStfEl.click();
        showToast("👩‍🏫 已返回教師與管理者登入畫面");
      });
    }
    document.querySelectorAll("#modalStaffRoleGrid .role-pill").forEach((pill) => {
      pill.addEventListener("click", () => {
        Sound.click();
        document.querySelectorAll("#modalStaffRoleGrid .role-pill").forEach((p) => p.classList.remove("active"));
        pill.classList.add("active");
        modalRole = pill.dataset.modalRole;
        const clsField = document.getElementById("modalTeacherClassField");
        if (clsField) clsField.classList.toggle("hidden", modalRole !== "教師");
        const nameInp = document.getElementById("modalStaffNameInput");
        if (nameInp) nameInp.value = DEFAULT_STAFF_NAMES[modalRole] || "";
      });
    });
    if (modalStaffForm && staffModal) {
      modalStaffForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const errBox = document.getElementById("modalStaffLoginError");
        errBox.classList.add("hidden");
        try {
          const res = await window.IdiomAPI.loginStaff({
            role: modalRole,
            name: document.getElementById("modalStaffNameInput").value,
            passcode: document.getElementById("modalStaffPassInput").value,
            assignedClass: modalRole === "教師" ? document.getElementById("modalTeacherClassSelect").value : "全校"
          });
          staffModal.classList.add("hidden");
          window.StudentTasks.stopMedia();
          Speech.stop();
          window.IdiomAPI.setToken(res.token);
          Sound.correct();
          showToast(`🏫 歡迎 ${res.staff.role} ${res.staff.name} 進入管理戰情室！`);
          await enterStaffPortal(res.staff);
        } catch (err) {
          Sound.wrong();
          errBox.textContent = err.message;
          errBox.classList.remove("hidden");
        }
      });
    }

    // 教師公用裝置專用隱蔽解鎖：連點版頭校徽 5 下輸入師長通行碼即可切回登入頁（學生無切換帳號按鈕）
    const brandBtn = document.getElementById("brandHomeBtn");
    if (brandBtn) {
      brandBtn.addEventListener("click", () => {
        if (appState.userType !== "student") return;
        appState.emblemTapCount += 1;
        clearTimeout(appState.emblemTapTimer);
        appState.emblemTapTimer = setTimeout(() => { appState.emblemTapCount = 0; }, 2200);
        if (appState.emblemTapCount >= 5) {
          appState.emblemTapCount = 0;
          const pwd = prompt("【教師專用解鎖】請輸入校內管理通行碼以登出目前學生裝置：");
          if (pwd === "school2026" || pwd === "1234" || pwd === "admin") {
            window.StudentTasks.stopMedia();
            Speech.stop();
            window.IdiomAPI.setToken("");
            appState.userType = null;
            appState.student = null;
            showView("auth");
            loadRosterPicker();
            showToast("🔓 師長已解鎖並返回身分選擇頁");
          } else if (pwd !== null) {
            showToast("通行碼錯誤");
          }
        }
      });
    }

    // 學生登入送出（同時支援 index2 點名卡片與 index1 手動輸入）
    formStu.addEventListener("submit", async (e) => {
      e.preventDefault();
      const errBox = document.getElementById("studentLoginError");
      errBox.classList.add("hidden");
      try {
        let payload = null;
        if (document.getElementById("studentNameGrid")) {
          if (!appState.selectedRosterStudent) {
            throw new Error("請先點選班級與自己的名字喔！");
          }
          payload = {
            classId: appState.selectedRosterStudent.classId,
            seatNo: Number(appState.selectedRosterStudent.seatNo),
            name: appState.selectedRosterStudent.name
          };
        } else {
          payload = {
            classId: document.getElementById("stuClassInput").value,
            seatNo: Number(document.getElementById("stuSeatInput").value),
            name: document.getElementById("stuNameInput").value
          };
        }
        const res = await window.IdiomAPI.loginStudent(payload);
        // 學生登入僅保存在記憶體中（不寫入 localStorage），重開或重整網頁即可直接換下一位同學登入！
        window.IdiomAPI.setToken(res.token, false);
        Sound.correct();
        showToast(`✨ 歡迎 ${res.student.classId} ${res.student.name}！今日專屬隨機成語已準備好囉`);
        await enterStudentPortal(res.student, res.classStat);
      } catch (err) {
        Sound.wrong();
        errBox.textContent = err.message;
        errBox.classList.remove("hidden");
      }
    });

    document.querySelectorAll("#staffRoleGrid .role-pill").forEach((pill) => {
      pill.addEventListener("click", () => {
        Sound.click();
        document.querySelectorAll("#staffRoleGrid .role-pill").forEach((p) => p.classList.remove("active"));
        pill.classList.add("active");
        appState.selectedStaffRole = pill.dataset.role;

        const clsField = document.getElementById("teacherClassField");
        clsField.classList.toggle("hidden", appState.selectedStaffRole !== "教師");
        document.getElementById("staffNameInput").value = DEFAULT_STAFF_NAMES[appState.selectedStaffRole] || "";
      });
    });

    formStf.addEventListener("submit", async (e) => {
      e.preventDefault();
      const errBox = document.getElementById("staffLoginError");
      errBox.classList.add("hidden");
      try {
        const res = await window.IdiomAPI.loginStaff({
          role: appState.selectedStaffRole,
          name: document.getElementById("staffNameInput").value,
          passcode: document.getElementById("staffPassInput").value,
          assignedClass: appState.selectedStaffRole === "教師" ? document.getElementById("teacherClassSelect").value : "全校"
        });
        window.IdiomAPI.setToken(res.token);
        Sound.correct();
        showToast(`🏫 歡迎 ${res.staff.role} ${res.staff.name} 登入戰情室！`);
        await enterStaffPortal(res.staff);
      } catch (err) {
        Sound.wrong();
        errBox.textContent = err.message;
        errBox.classList.remove("hidden");
      }
    });

    document.querySelectorAll("[data-stu-tab]").forEach((btn) => {
      btn.addEventListener("click", () => {
        Sound.click();
        window.StudentTasks.stopMedia();
        setActiveStudentTab(btn.dataset.stuTab);
      });
    });
  }

  // -------------------- 載入上林國小真實學生名單點名登入 (index2.html) --------------------
  async function loadRosterPicker() {
    const tabsEl = document.getElementById("rosterClassTabs");
    const gridEl = document.getElementById("studentNameGrid");
    if (!tabsEl || !gridEl) return;

    try {
      const res = await window.IdiomAPI.getRoster();
      appState.roster = toArray(res.students);
      const classIds = Array.from(new Set(appState.roster.map((s) => s.classId)));
      if (classIds.length && !classIds.includes(appState.rosterClass)) {
        appState.rosterClass = classIds[0];
      }
      renderRosterPicker(classIds);
    } catch (err) {
      gridEl.innerHTML = `<p class="pretty-paragraph">載入學生名單失敗：${escapeHtml(err.message)}</p>`;
    }
  }

  function renderRosterPicker(classIds) {
    const tabsEl = document.getElementById("rosterClassTabs");
    const gridEl = document.getElementById("studentNameGrid");
    const bannerEl = document.getElementById("selectedStudentBanner");
    const textEl = document.getElementById("selectedStudentText");
    const confirmBtn = document.getElementById("studentConfirmLoginBtn");
    if (!tabsEl || !gridEl) return;

    tabsEl.innerHTML = classIds
      .map(
        (cid) => `
        <button type="button" class="role-pill ${appState.rosterClass === cid ? "active" : ""}" data-roster-cls="${escapeHtml(cid)}">
          ${escapeHtml(cid)}
        </button>`
      )
      .join("");

    const list = appState.roster
      .filter((s) => s.classId === appState.rosterClass)
      .sort((a, b) => Number(a.seatNo) - Number(b.seatNo));

    gridEl.innerHTML = list
      .map((s) => {
        const isSel = appState.selectedRosterStudent && appState.selectedRosterStudent.id === s.id;
        return `
          <button type="button" class="student-name-card ${isSel ? "selected" : ""}" data-pick-stu="${escapeHtml(s.id)}">
            <span class="stu-seat-tag">${String(s.seatNo).padStart(2, "0")} 號</span>
            <span class="stu-name-main">${escapeHtml(s.name)}</span>
          </button>`;
      })
      .join("");

    if (appState.selectedRosterStudent) {
      const st = appState.selectedRosterStudent;
      if (bannerEl) bannerEl.classList.remove("hidden");
      if (textEl) textEl.textContent = `${st.classId} ${String(st.seatNo).padStart(2, "0")}號・${st.name}`;
      if (confirmBtn) {
        confirmBtn.disabled = false;
        confirmBtn.textContent = `✨ 我是 ${st.name}，進入今日成語打卡`;
      }
    } else {
      if (bannerEl) bannerEl.classList.add("hidden");
      if (confirmBtn) {
        confirmBtn.disabled = true;
        confirmBtn.textContent = "✨ 請先點選自己的名字";
      }
    }

    tabsEl.querySelectorAll("[data-roster-cls]").forEach((btn) => {
      btn.addEventListener("click", () => {
        Sound.click();
        appState.rosterClass = btn.dataset.rosterCls;
        renderRosterPicker(classIds);
      });
    });

    gridEl.querySelectorAll("[data-pick-stu]").forEach((btn) => {
      btn.addEventListener("click", () => {
        Sound.click();
        const found = appState.roster.find((x) => x.id === btn.dataset.pickStu);
        if (found) {
          appState.selectedRosterStudent = found;
          renderRosterPicker(classIds);
        }
      });
    });
  }

  async function bootstrap() {
    initStaticArt();
    updateSoundBtn();
    bindGlobalEvents();
    if (window.IdiomAPI.isCloudConnected && window.IdiomAPI.isCloudConnected()) {
      const added = await window.IdiomAPI.syncCustomContentFromCloud();
      const totalAdded = (added.idioms || 0) + (added.animations || 0) + (added.stories || 0);
      if (totalAdded > 0) {
        showToast(`☁️ 已同步試算表擴充題庫（成語+${added.idioms}、動畫+${added.animations}、典故+${added.stories}）`);
      }
    }
    startLivePolling();
    await loadRosterPicker();

    const savedToken = window.IdiomAPI.getToken();
    if (savedToken) {
      try {
        const me = await window.IdiomAPI.getMe();
        if (me.userType === "student") {
          // 清除舊版殘留的學生自動登入快取，確保重開網頁一律回到選名單頁，不卡在上一個學生！
          window.IdiomAPI.setToken("", true);
          showView("auth");
          return;
        }
        if (me.userType === "staff" && me.staff) {
          await enterStaffPortal(me.staff);
          return;
        }
      } catch {
        window.IdiomAPI.setToken("", true);
      }
    }
    showView("auth");
  }

  document.addEventListener("DOMContentLoaded", bootstrap);
})();
