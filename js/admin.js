// ============================================================================
// 上林成語小鎮 - 教師與管理者五大身分全校語文管理戰情室
// 支援：管理者校長、管理者閱推教師、管理者教務處主任、管理者教學組長、教師
// ============================================================================
window.AdminPanel = (function () {
  const { toArray, Sound, showToast } = window.IdiomAPI;

  let state = {
    staff: null,
    overview: null,
    activeTab: "classes", // classes | students | writings | curriculum
    selectedClass: "全校"
  };

  function escapeHtml(str) {
    return String(str || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function getRoleSummary(role) {
    switch (role) {
      case "管理者校長":
        return "全校語文推動總覽：掌握各年段打卡趨勢，表揚「數位語文領航班」與七階成語榮譽稱號得主。";
      case "管理者閱推教師":
        return "閱讀推動專屬視角：精選推薦學生微寫作佳作，並即時擴充校內新聞抓漏與成語故事題庫。";
      case "管理者教務處主任":
        return "教務處數據戰情室：追蹤全校各班每日開機打卡率，一鍵匯出全校語文學習報表。";
      case "管理者教學組長":
        return "教學推動管理視角：檢視低、中、高年段任務進度，協助各班達成 90% 領航班目標。";
      default:
        return "班級導師專屬視角：即時關注本班學生今日打卡進度、連續打卡天數與微寫作表現。";
    }
  }

  async function init(staff) {
    state.staff = staff;
    state.selectedClass = staff.role === "教師" && staff.assignedClass ? staff.assignedClass : "全校";
    state.activeTab = staff.role === "管理者閱推教師" ? "writings" : "classes";
    await refresh();
  }

  async function refresh() {
    if (!state.staff) return;
    try {
      const data = await window.IdiomAPI.getAdminOverview(state.selectedClass);
      state.overview = data;
      render();
    } catch (err) {
      showToast(err.message);
    }
  }

  function render() {
    const root = document.getElementById("adminWorkspace");
    if (!root || !state.overview || !state.staff) return;

    const classes = toArray(state.overview.classes);
    const students = toArray(state.overview.students);
    const writings = toArray(state.overview.writings);
    const newsBugs = toArray(state.overview.newsBugs);

    const totalStudents = classes.reduce((s, c) => s + Number(c.totalStudents || 0), 0);
    const checkedToday = classes.reduce((s, c) => s + Number(c.checkedInCount || 0), 0);
    const schoolRate = totalStudents > 0 ? Math.round((checkedToday / totalStudents) * 100) : 0;
    const leaderCount = classes.filter((c) => c.isLeaderClass).length;
    const scholarCount = classes.reduce((s, c) => s + Number(c.scholarCount || 0), 0);

    const csvHref = window.IdiomAPI.isCloudConnected && window.IdiomAPI.isCloudConnected()
      ? window.IdiomAPI.buildCsvFromStudents(students)
      : window.IdiomAPI.getExportCsvUrl(state.selectedClass);
    const cloudUrl = window.IdiomAPI.getCloudUrl ? window.IdiomAPI.getCloudUrl() : "";
    const isCloud = Boolean(cloudUrl);

    root.innerHTML = `
      <div class="admin-header-card glass-card">
        <div>
          <div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:8px;">
            <span class="pill-tag pill-purple">${escapeHtml(state.staff.role)}</span>
            <span class="pill-tag pill-blue">管轄範圍：${escapeHtml(state.staff.assignedClass || "全校")}</span>
            <span class="pill-tag ${isCloud ? "pill-mint" : "pill-gold"}">${isCloud ? "☁️ 已連線 Google 試算表雲端" : "📡 " + escapeHtml(state.overview.lanUrl || location.origin)}</span>
          </div>
          <h2 style="font-size:24px;margin-bottom:6px;">${escapeHtml(state.staff.name)}，您好！歡迎進入全校語文管理戰情室</h2>
          <p class="pretty-paragraph" style="font-size:14.5px;">${escapeHtml(getRoleSummary(state.staff.role))}</p>
        </div>
        <div style="display:flex;flex-wrap:wrap;gap:10px;">
          <button type="button" class="btn btn-secondary" id="btnAdminRefresh">🔄 即時更新數據</button>
          <a class="btn btn-primary" href="${csvHref}" download="shanglin_idiom_report.csv">
            📥 匯出學習報表 CSV
          </a>
          <button type="button" class="btn btn-outline-sm" id="btnAdminResetDemo">🧹 清空全校打卡紀錄</button>
        </div>
      </div>

      ${
        document.body.dataset.cloudEdition === "true"
          ? `<div class="admin-demo-box glass-card" style="border-color:rgba(90,155,255,0.4);">
              <div style="flex:1;min-width:260px;">
                <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:6px;">
                  <span class="pill-tag ${isCloud ? "pill-mint" : "pill-blue"}">${isCloud ? "✅ Google 試算表雲端已連線" : "☁️ Google 試算表雲端連線設定"}</span>
                  <span style="font-size:13px;color:var(--ink-muted);font-weight:700;">設定後全校 24H 跨裝置同步累積，並自動載入試算表擴充題庫！</span>
                </div>
                <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;">
                  <input type="url" id="cloudGasUrlInput" value="${escapeHtml(cloudUrl)}" placeholder="貼上 https://script.google.com/macros/s/.../exec 網址" style="flex:1;min-width:260px;padding:9px 14px;border-radius:14px;border:2px solid rgba(139,121,246,0.28);font-size:14px;">
                  <button type="button" class="btn btn-primary" id="btnSaveCloudUrl">☁️ 儲存並測試雲端連線</button>
                </div>
              </div>
            </div>`
          : ""
      }

      ${
        document.body.dataset.demoSupport === "true"
          ? `<div class="admin-demo-box glass-card">
              <div>
                <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:6px;">
                  <span class="pill-tag pill-gold">🎬 管理者教學示範專區</span>
                  <span class="pill-tag pill-purple">虛擬學生・不計入全校與班級累計</span>
                </div>
                <p class="pretty-paragraph" style="font-size:14px;">
                  低、中、高年級各備有一組獨立虛擬示範生，供師長簡報與課堂教學操作示範，絕不影響真實學童與班級統計數據！
                </p>
              </div>
              <div style="display:flex;flex-wrap:wrap;gap:9px;">
                <button type="button" class="btn btn-secondary" data-launch-demo="low">🌱 示範低年級（小雲朵）</button>
                <button type="button" class="btn btn-secondary" data-launch-demo="mid">🌤️ 示範中年級（小太陽）</button>
                <button type="button" class="btn btn-secondary" data-launch-demo="high">🌟 示範高年級（小星語）</button>
              </div>
            </div>`
          : ""
      }

      <div class="admin-kpi-grid">
        <div class="kpi-card">
          <div class="kpi-label">全校今日開機打卡率</div>
          <div class="kpi-val">${schoolRate}%</div>
          <div style="font-size:13px;color:var(--ink-muted);margin-top:4px;">已完成 ${checkedToday} / ${totalStudents} 人</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-label">🏆 數位語文領航班 (≥90%)</div>
          <div class="kpi-val">${leaderCount} 班</div>
          <div style="font-size:13px;color:var(--ink-muted);margin-top:4px;">全校共 ${classes.length} 個班級</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-label">🎓 七階稱號得主 (≥15 天)</div>
          <div class="kpi-val">${scholarCount} 位</div>
          <div style="font-size:13px;color:var(--ink-muted);margin-top:4px;">小童生～大宗師累計人數</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-label">✍️ 微寫作接龍佳作數</div>
          <div class="kpi-val">${writings.length} 篇</div>
          <div style="font-size:13px;color:var(--ink-muted);margin-top:4px;">高年段即時創作共學牆</div>
        </div>
      </div>

      <nav class="sub-nav-bar" aria-label="管理後台分頁">
        <button type="button" class="nav-pill ${state.activeTab === "classes" ? "active" : ""}" data-admin-tab="classes">🏆 各班打卡與領航班</button>
        <button type="button" class="nav-pill ${state.activeTab === "students" ? "active" : ""}" data-admin-tab="students">📋 學生打卡與徽章明細</button>
        <button type="button" class="nav-pill ${state.activeTab === "writings" ? "active" : ""}" data-admin-tab="writings">✍️ 微寫作佳作推薦</button>
        <button type="button" class="nav-pill ${state.activeTab === "curriculum" ? "active" : ""}" data-admin-tab="curriculum">🗞️ 題庫管理與擴充</button>
      </nav>

      <div id="adminTabContent">
        ${
          state.activeTab === "classes"
            ? renderClassesTab(classes)
            : state.activeTab === "students"
            ? renderStudentsTab(classes, students)
            : state.activeTab === "writings"
            ? renderWritingsTab(writings)
            : renderCurriculumTab(newsBugs)
        }
      </div>
    `;

    bindEvents();
  }

  function renderClassesTab(classes) {
    return `
      <div class="task-card glass-card">
        <div class="task-header">
          <div>
            <h3>🏆 全校各班今日打卡進度與「數位語文領航班」即時監控</h3>
            <p class="pretty-paragraph" style="font-size:14px;margin-top:4px;">紅色標記線為 90% 達標門檻，達 90% 以上班級立即自動獲頒「數位語文領航班」大獎。</p>
          </div>
        </div>
        <div class="class-board-grid">
          ${classes
            .map(
              (c) => `
              <div class="class-rate-card ${c.isLeaderClass ? "leader" : ""}">
                <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap;">
                  <div>
                    <strong style="font-size:19px;">${escapeHtml(c.classId)}</strong>
                    <span class="pill-tag pill-blue" style="margin-left:6px;">${escapeHtml(c.bandLabel)}</span>
                  </div>
                  ${
                    c.isLeaderClass
                      ? `<span class="pill-tag pill-gold">🏆 數位語文領航班</span>`
                      : `<span class="pill-tag pill-purple">衝刺 90% 中</span>`
                  }
                </div>
                <div style="margin-top:8px;font-size:13.5px;color:var(--ink-muted);">
                  導師：${escapeHtml(c.teacherName)}｜七階稱號得主：${c.scholarCount} 位
                </div>
                <div class="rate-bar-wrap">
                  <div class="rate-bar-fill ${c.isLeaderClass ? "gold" : ""}" style="width:${c.checkInRate}%"></div>
                  <div class="rate-threshold-line" title="90% 領航班門檻"></div>
                </div>
                <div style="display:flex;justify-content:space-between;align-items:center;font-size:14px;font-weight:700;">
                  <span>已打卡 ${c.checkedInCount} / ${c.totalStudents} 人</span>
                  <span style="color:${c.isLeaderClass ? "#B87400" : "var(--purple-deep)"};font-size:17px;">${c.checkInRate}%</span>
                </div>
                <div class="invincible-stars-box">
                  <div class="invincible-stars-row">
                    <span class="star-meta-text">✨ 無敵星星（${Number(c.invincibleStars || 0)} 顆）</span>
                    <div class="stars-sequence">
                      ${
                        Number(c.invincibleStars || 0) > 0
                          ? Array.from({ length: Number(c.invincibleStars || 0) }, () => `<span class="invincible-star-item">⭐</span>`).join("")
                          : `<span class="invincible-star-empty">☆</span>`
                      }
                    </div>
                  </div>
                  <div style="font-size:12px;color:var(--ink-body);font-weight:600;">
                    累計達 90% 共 <strong>${Number(c.leaderDays || 0)}</strong> 日（每滿 15 日得 1 顆無敵星星）
                  </div>
                </div>
              </div>`
            )
            .join("")}
        </div>
      </div>
    `;
  }

  function renderStudentsTab(classes, students) {
    const sorted = [...students].sort((a, b) => {
      if (a.classId !== b.classId) return a.classId.localeCompare(b.classId);
      return Number(a.seatNo) - Number(b.seatNo);
    });

    return `
      <div class="task-card glass-card">
        <div class="task-header">
          <div>
            <h3>📋 學生每日打卡與七階成語稱號晉升明細</h3>
            <p class="pretty-paragraph" style="font-size:14px;margin-top:4px;">每連續打卡滿 15 天自動晉升一階（小童生 → 小秀才 → 小舉人 → 小貢士 → 小進士 → 小狀元 → 大宗師）。</p>
          </div>
          <div style="display:flex;flex-wrap:wrap;gap:8px;">
            <button type="button" class="btn ${state.selectedClass === "全校" ? "btn-primary" : "btn-chip"}" data-filter-cls="全校">全校</button>
            ${classes
              .map(
                (c) => `
                <button type="button" class="btn ${state.selectedClass === c.classId ? "btn-primary" : "btn-chip"}" data-filter-cls="${escapeHtml(c.classId)}">
                  ${escapeHtml(c.classId)}
                </button>`
              )
              .join("")}
          </div>
        </div>

        <div class="data-table-wrap">
          <table class="data-table">
            <thead>
              <tr>
                <th>班級</th>
                <th>座號</th>
                <th>姓名</th>
                <th>年段</th>
                <th>今日打卡狀態</th>
                <th>連續打卡天數</th>
                <th>累計打卡</th>
                <th>目前榮譽稱號</th>
              </tr>
            </thead>
            <tbody>
              ${sorted
                .map((st) => {
                  const rk = window.IdiomAPI.getRankProgress(st.streakDays);
                  const bandName = st.band === "low" ? "低年段" : st.band === "mid" ? "中年段" : "高年段";
                  return `
                    <tr>
                      <td><strong>${escapeHtml(st.classId)}</strong></td>
                      <td>${st.seatNo} 號</td>
                      <td>${escapeHtml(st.name)}</td>
                      <td><span class="pill-tag pill-blue">${bandName}</span></td>
                      <td>${st.checkedInToday ? '<span class="pill-tag pill-mint">✔ 已完成打卡</span>' : '<span class="pill-tag pill-pink">尚未完成</span>'}</td>
                      <td><strong>${st.streakDays}</strong> 天</td>
                      <td>${st.totalCheckIns} 次</td>
                      <td>${rk.currentTier ? `<span class="pill-tag pill-gold">${rk.currentIcon} ${escapeHtml(rk.currentTitle)}</span>` : `<span style="color:var(--ink-muted);">衝刺小童生 (${rk.stageProgress}/15)</span>`}</td>
                    </tr>`;
                })
                .join("")}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  function renderWritingsTab(writings) {
    return `
      <div class="task-card glass-card">
        <div class="task-header">
          <div>
            <h3>✍️ 高年級微寫作接龍佳作審核與師長精選</h3>
            <p class="pretty-paragraph" style="font-size:14px;margin-top:4px;">點選「設為師長精選」可立即於全校學生端亮起金色推薦徽章，並推播至全校即時快報！</p>
          </div>
        </div>
        <div class="writings-wall">
          ${writings
            .map(
              (w) => `
              <article class="writing-card ${w.featured ? "featured" : ""}">
                <div>
                  <div class="writing-card-head">
                    <span class="writing-author">${escapeHtml(w.classId)} ${w.seatNo}號・${escapeHtml(w.studentName)}</span>
                    <span class="pill-tag pill-purple">${escapeHtml(w.idiom)}</span>
                  </div>
                  ${w.featured ? `<div style="margin-top:6px;"><span class="pill-tag pill-gold">⭐ ${escapeHtml(w.featuredBy || "師長精選")}</span></div>` : ""}
                  <p class="writing-content pretty-paragraph" style="margin-top:10px;">${escapeHtml(w.content)}</p>
                </div>
                <div class="writing-card-foot">
                  <span style="font-size:13px;font-weight:700;color:#D6336C;">❤️ ${Number(w.likes || 0)} 個同學愛心</span>
                  <button type="button" class="btn ${w.featured ? "btn-secondary" : "btn-primary"}" data-feature-writing="${escapeHtml(w.id)}">
                    ${w.featured ? "取消精選" : "⭐ 設為師長精選"}
                  </button>
                </div>
              </article>`
            )
            .join("")}
        </div>
      </div>
    `;
  }

  function renderCurriculumTab(newsBugs) {
    return `
      <div class="task-card glass-card">
        <div class="task-header">
          <div>
            <h3>🗞️ 校內成語題庫管理（新增高年級「新聞抓漏王」挑戰題）</h3>
            <p class="pretty-paragraph" style="font-size:14px;margin-top:4px;">師長可結合時事或校園活動新增錯別字新聞標題，送出後立即存入資料庫並同步給高年段學生挑戰！</p>
          </div>
        </div>

        <form id="addNewsBugForm" style="padding:20px;border-radius:18px;background:#F6F3FF;border:2px solid rgba(139,121,246,0.24);margin-bottom:20px;display:flex;flex-direction:column;gap:14px;">
          <div class="form-row-2">
            <div class="form-field">
              <label for="newBugCat">新聞分類</label>
              <input type="text" id="newBugCat" value="校園特派快報" required>
            </div>
            <div class="form-field">
              <label for="newBugWrong">刻意寫錯的成語</label>
              <input type="text" id="newBugWrong" placeholder="例如：一曝十寒寫錯為 一爆十寒" required>
            </div>
          </div>
          <div class="form-row-2">
            <div class="form-field">
              <label for="newBugCorrect">正確成語</label>
              <input type="text" id="newBugCorrect" placeholder="例如：一曝十寒" required>
            </div>
            <div class="form-field">
              <label for="newBugExplain">成語字義解析</label>
              <input type="text" id="newBugExplain" placeholder="簡短說明為何應該這樣寫" required>
            </div>
          </div>
          <div class="form-field">
            <label for="newBugHeadline">完整新聞標題（須包含上方刻意寫錯的成語）</label>
            <input type="text" id="newBugHeadline" placeholder="例如：校長勉勵同學練習書法要持之以恆，千萬別一爆十寒！" required>
          </div>
          <div>
            <button type="submit" class="btn btn-primary">➕ 新增至全校題庫資料庫</button>
          </div>
        </form>

        <h4 style="font-size:17px;margin-bottom:12px;">📚 目前題庫中的「新聞抓漏王」題目（共 ${newsBugs.length} 題）</h4>
        <div style="display:flex;flex-direction:column;gap:10px;">
          ${newsBugs
            .map(
              (b) => `
              <div style="padding:14px 18px;border-radius:16px;background:#FFFFFF;border:1.5px solid var(--purple-border);">
                <div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:6px;">
                  <span class="pill-tag pill-gold">${escapeHtml(b.category)}</span>
                  <span class="pill-tag pill-pink">錯：${escapeHtml(b.wrongSegment)}</span>
                  <span class="pill-tag pill-mint">正：${escapeHtml(b.correctSegment)}</span>
                </div>
                <p class="pretty-paragraph" style="font-weight:700;color:var(--ink-dark);">${escapeHtml(b.headline)}</p>
                <p class="pretty-paragraph" style="font-size:13.5px;margin-top:4px;">解析：${escapeHtml(b.explanation)}</p>
              </div>`
            )
            .join("")}
        </div>
      </div>
    `;
  }

  function bindEvents() {
    const btnRef = document.getElementById("btnAdminRefresh");
    if (btnRef) {
      btnRef.addEventListener("click", async () => {
        Sound.click();
        await refresh();
        showToast("🔄 已同步最新全校即時打卡數據！");
      });
    }

    document.querySelectorAll("[data-launch-demo]").forEach((btn) => {
      btn.addEventListener("click", () => {
        Sound.click();
        if (window.AppActions && window.AppActions.enterDemoStudent) {
          window.AppActions.enterDemoStudent(btn.dataset.launchDemo);
        }
      });
    });

    const btnSaveCloud = document.getElementById("btnSaveCloudUrl");
    if (btnSaveCloud) {
      btnSaveCloud.addEventListener("click", async () => {
        const inp = document.getElementById("cloudGasUrlInput");
        const val = (inp ? inp.value : "").trim();
        if (val && !/^https:\/\/script\.google\.com\//i.test(val)) {
          Sound.wrong();
          showToast("請輸入正確的 Google Apps Script 網路應用程式網址（開頭為 https://script.google.com/）");
          return;
        }
        window.IdiomAPI.setCloudUrl(val);
        if (!val) {
          showToast("已清除自訂雲端網址，切回本機／單機模式");
          await refresh();
          return;
        }
        try {
          btnSaveCloud.disabled = true;
          const h = await window.IdiomAPI.health();
          await window.IdiomAPI.syncCustomContentFromCloud();
          Sound.correct();
          showToast(`☁️ 雲端試算表連線成功！（日期：${h.date}）`);
          await refresh();
        } catch (err) {
          Sound.wrong();
          showToast("雲端連線測試失敗：" + err.message);
        } finally {
          btnSaveCloud.disabled = false;
        }
      });
    }

    const btnReset = document.getElementById("btnAdminResetDemo");
    if (btnReset) {
      btnReset.addEventListener("click", async () => {
        if (!confirm("確定要清空全校所有學童的打卡、個人徽章、班級累計與微寫作紀錄嗎？")) return;
        try {
          await window.IdiomAPI.resetDemo();
          Sound.correct();
          showToast("🧹 已徹底清空全校與所有學童紀錄！");
          await refresh();
        } catch (err) {
          showToast(err.message);
        }
      });
    }

    document.querySelectorAll("[data-admin-tab]").forEach((btn) => {
      btn.addEventListener("click", () => {
        Sound.click();
        state.activeTab = btn.dataset.adminTab;
        render();
      });
    });

    document.querySelectorAll("[data-filter-cls]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        Sound.click();
        state.selectedClass = btn.dataset.filterCls;
        await refresh();
      });
    });

    document.querySelectorAll("[data-feature-writing]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        try {
          await window.IdiomAPI.featureWriting(btn.dataset.featureWriting);
          Sound.correct();
          showToast("⭐ 已更新師長精選狀態！");
          await refresh();
        } catch (err) {
          showToast(err.message);
        }
      });
    });

    const form = document.getElementById("addNewsBugForm");
    if (form) {
      form.addEventListener("submit", async (e) => {
        e.preventDefault();
        try {
          await window.IdiomAPI.addNewsBug({
            category: document.getElementById("newBugCat").value,
            wrongSegment: document.getElementById("newBugWrong").value,
            correctSegment: document.getElementById("newBugCorrect").value,
            explanation: document.getElementById("newBugExplain").value,
            headline: document.getElementById("newBugHeadline").value
          });
          Sound.correct();
          showToast("🎉 已成功新增新聞抓漏題至全校資料庫！");
          await refresh();
        } catch (err) {
          Sound.wrong();
          showToast(err.message);
        }
      });
    }
  }

  return {
    init,
    refresh
  };
})();
