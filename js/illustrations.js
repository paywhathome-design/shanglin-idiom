// ============================================================================
// 上林成語小鎮 - 藍紫色軟萌系原創 SVG 吉祥物、動畫分鏡、看圖卡片與數位徽章
// ============================================================================
window.IdiomArt = (function () {
  function mascotSvg(size = 138, mood = "happy") {
    const mouth =
      mood === "celebrate"
        ? '<path d="M58 76 Q69 89 80 76 Z" fill="#FF7EA9" stroke="#3D3470" stroke-width="2.5"/>'
        : '<path d="M61 78 Q69 86 77 78" fill="none" stroke="#3D3470" stroke-width="3" stroke-linecap="round"/>';
    const starColor = mood === "celebrate" ? "#FFD659" : "#9AC5FF";
    return `
      <svg width="${size}" height="${size}" viewBox="0 0 138 138" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="mimiBody" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#D7E6FF"/>
            <stop offset="55%" stop-color="#DFD4FF"/>
            <stop offset="100%" stop-color="#C5D8FF"/>
          </linearGradient>
          <linearGradient id="mimiHat" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#6B8CFF"/>
            <stop offset="100%" stop-color="#8B6BF5"/>
          </linearGradient>
        </defs>
        <!-- 閃亮星星光環 -->
        <circle cx="69" cy="72" r="56" fill="rgba(167,139,250,0.14)"/>
        <path d="M22 36 L25 43 L32 45 L25 47 L22 54 L19 47 L12 45 L19 43 Z" fill="${starColor}"/>
        <path d="M116 28 L118 33 L123 35 L118 37 L116 42 L114 37 L109 35 L114 33 Z" fill="#FFB3CE"/>
        <!-- 軟萌雲朵小耳朵與身體 -->
        <circle cx="38" cy="68" r="24" fill="url(#mimiBody)" stroke="#7C6CF0" stroke-width="2.6"/>
        <circle cx="100" cy="68" r="24" fill="url(#mimiBody)" stroke="#7C6CF0" stroke-width="2.6"/>
        <ellipse cx="69" cy="76" rx="44" ry="37" fill="url(#mimiBody)" stroke="#7C6CF0" stroke-width="2.6"/>
        <!-- 可愛小耳罩/雲捲 -->
        <circle cx="38" cy="68" r="18" fill="url(#mimiBody)"/>
        <circle cx="100" cy="68" r="18" fill="url(#mimiBody)"/>
        <!-- 學士星語小帽 -->
        <polygon points="69,16 100,30 69,44 38,30" fill="url(#mimiHat)" stroke="#4C3DB8" stroke-width="2.4" stroke-linejoin="round"/>
        <rect x="52" y="34" width="34" height="10" rx="5" fill="#7C6CF0" stroke="#4C3DB8" stroke-width="2"/>
        <line x1="94" y1="33" x2="103" y2="50" stroke="#FFD04D" stroke-width="3" stroke-linecap="round"/>
        <circle cx="103" cy="52" r="4.5" fill="#FFD04D"/>
        <!-- 圓滾滾大眼 -->
        <circle cx="53" cy="69" r="6.5" fill="#322B63"/>
        <circle cx="85" cy="69" r="6.5" fill="#322B63"/>
        <circle cx="51" cy="66.5" r="2.3" fill="#FFFFFF"/>
        <circle cx="83" cy="66.5" r="2.3" fill="#FFFFFF"/>
        <!-- 粉紅腮紅 -->
        <ellipse cx="42" cy="77" rx="7" ry="4" fill="#FFA6C9" opacity="0.72"/>
        <ellipse cx="96" cy="77" rx="7" ry="4" fill="#FFA6C9" opacity="0.72"/>
        ${mouth}
        <!-- 小手捧書 -->
        <rect x="49" y="96" width="40" height="22" rx="6" fill="#FFFFFF" stroke="#6B8CFF" stroke-width="2.4"/>
        <line x1="69" y1="96" x2="69" y2="118" stroke="#8B6BF5" stroke-width="2"/>
        <line x1="55" y1="104" x2="64" y2="104" stroke="#A78BFA" stroke-width="2.2" stroke-linecap="round"/>
        <line x1="74" y1="104" x2="83" y2="104" stroke="#6B8CFF" stroke-width="2.2" stroke-linecap="round"/>
        <circle cx="46" cy="105" r="7" fill="#EAE6FF" stroke="#7C6CF0" stroke-width="2.2"/>
        <circle cx="92" cy="105" r="7" fill="#EAE6FF" stroke="#7C6CF0" stroke-width="2.2"/>
      </svg>`;
  }

  function animationSceneSvg(sceneKey, meta = {}) {
    const scenes = {
      "snake-1": `
        <svg viewBox="0 0 560 315" xmlns="http://www.w3.org/2000/svg">
          <rect width="560" height="315" fill="#EEF4FF"/>
          <ellipse cx="280" cy="282" rx="250" ry="45" fill="#D9ECFF"/>
          <!-- 果茶壺 -->
          <rect x="235" y="135" width="90" height="82" rx="28" fill="#8B75F7" stroke="#4D3CB5" stroke-width="4"/>
          <path d="M325 156 Q358 165 325 196" fill="none" stroke="#4D3CB5" stroke-width="6" stroke-linecap="round"/>
          <ellipse cx="280" cy="135" rx="34" ry="11" fill="#A999FF" stroke="#4D3CB5" stroke-width="3.5"/>
          <circle cx="280" cy="119" r="9" fill="#FFD35A" stroke="#4D3CB5" stroke-width="3"/>
          <text x="280" y="185" text-anchor="middle" font-size="22" font-weight="900" fill="#FFFFFF">甜甜果茶</text>
          <!-- 兩位朋友 -->
          <circle cx="120" cy="178" r="36" fill="#FFE6D5" stroke="#5B4D8E" stroke-width="3.5"/>
          <circle cx="109" cy="175" r="4" fill="#3D3470"/><circle cx="131" cy="175" r="4" fill="#3D3470"/>
          <path d="M112 189 Q120 196 128 189" fill="none" stroke="#3D3470" stroke-width="3" stroke-linecap="round"/>
          <rect x="92" y="214" width="56" height="52" rx="18" fill="#6E9BFF"/>
          <circle cx="440" cy="178" r="36" fill="#FFE6D5" stroke="#5B4D8E" stroke-width="3.5"/>
          <circle cx="429" cy="175" r="4" fill="#3D3470"/><circle cx="451" cy="175" r="4" fill="#3D3470"/>
          <path d="M432 189 Q440 196 448 189" fill="none" stroke="#3D3470" stroke-width="3" stroke-linecap="round"/>
          <rect x="412" y="214" width="56" height="52" rx="18" fill="#A78BFA"/>
          <text x="280" y="54" text-anchor="middle" font-size="24" font-weight="900" fill="#4D3CB5">🎨 畫小蛇比賽開始囉！</text>
        </svg>`,
      "snake-2": `
        <svg viewBox="0 0 560 315" xmlns="http://www.w3.org/2000/svg">
          <rect width="560" height="315" fill="#F2EEFF"/>
          <rect x="75" y="75" width="410" height="190" rx="28" fill="#FFFFFF" stroke="#8B75F7" stroke-width="4"/>
          <!-- 漂亮的小藍紫蛇 -->
          <path d="M145 205 C175 120, 245 120, 275 185 C305 245, 375 230, 415 158" fill="none" stroke="#6B94FF" stroke-width="26" stroke-linecap="round"/>
          <circle cx="420" cy="150" r="24" fill="#7D8BFF" stroke="#4D3CB5" stroke-width="3.5"/>
          <circle cx="414" cy="144" r="4" fill="#FFFFFF"/><circle cx="414" cy="144" r="2" fill="#2F2A56"/>
          <circle cx="429" cy="144" r="4" fill="#FFFFFF"/><circle cx="429" cy="144" r="2" fill="#2F2A56"/>
          <path d="M442 154 L458 148 M442 154 L458 160" stroke="#FF6B9E" stroke-width="3" stroke-linecap="round"/>
          <text x="280" y="48" text-anchor="middle" font-size="24" font-weight="900" fill="#4D3CB5">✨ 刷刷刷！小蛇畫得超快又完整！</text>
        </svg>`,
      "snake-3": `
        <svg viewBox="0 0 560 315" xmlns="http://www.w3.org/2000/svg">
          <rect width="560" height="315" fill="#F4F0FF"/>
          <rect x="75" y="75" width="410" height="190" rx="28" fill="#FFFFFF" stroke="#FF8FB8" stroke-width="4" stroke-dasharray="10 6"/>
          <path d="M145 190 C175 125, 245 125, 275 178 C305 225, 375 215, 415 152" fill="none" stroke="#6B94FF" stroke-width="24" stroke-linecap="round"/>
          <!-- 多餘的四隻粉紅腳 -->
          <path d="M185 162 L175 210 M220 156 L228 205 M310 202 L302 246 M355 202 L365 246" stroke="#FF6B9E" stroke-width="7" stroke-linecap="round"/>
          <circle cx="175" cy="214" r="8" fill="#FF8FB8"/><circle cx="228" cy="210" r="8" fill="#FF8FB8"/>
          <circle cx="302" cy="248" r="8" fill="#FF8FB8"/><circle cx="365" cy="248" r="8" fill="#FF8FB8"/>
          <circle cx="420" cy="145" r="22" fill="#7D8BFF" stroke="#4D3CB5" stroke-width="3"/>
          <circle cx="416" cy="140" r="3" fill="#2F2A56"/><circle cx="428" cy="140" r="3" fill="#2F2A56"/>
          <text x="280" y="48" text-anchor="middle" font-size="23" font-weight="900" fill="#C93A73">🦶 哎呀！居然多幫小蛇畫上四隻腳！</text>
        </svg>`,
      "snake-4": `
        <svg viewBox="0 0 560 315" xmlns="http://www.w3.org/2000/svg">
          <rect width="560" height="315" fill="#EBF6FF"/>
          <circle cx="185" cy="165" r="46" fill="#FFE6D5" stroke="#5B4D8E" stroke-width="3.5"/>
          <circle cx="170" cy="160" r="4.5" fill="#3D3470"/><circle cx="200" cy="160" r="4.5" fill="#3D3470"/>
          <path d="M172 182 Q185 172 198 182" fill="none" stroke="#3D3470" stroke-width="3.5" stroke-linecap="round"/>
          <text x="185" y="242" text-anchor="middle" font-size="18" font-weight="800" fill="#5E4FD4">好懊惱呀…</text>
          <circle cx="375" cy="165" r="46" fill="#FFE6D5" stroke="#5B4D8E" stroke-width="3.5"/>
          <circle cx="360" cy="160" r="4.5" fill="#3D3470"/><circle cx="390" cy="160" r="4.5" fill="#3D3470"/>
          <path d="M362 178 Q375 192 388 178" fill="none" stroke="#3D3470" stroke-width="3.5" stroke-linecap="round"/>
          <rect x="422" y="140" width="54" height="58" rx="16" fill="#8B75F7"/>
          <text x="375" y="242" text-anchor="middle" font-size="18" font-weight="800" fill="#188C5D">蛇沒有腳，果茶歸我！</text>
          <text x="280" y="54" text-anchor="middle" font-size="26" font-weight="900" fill="#4D3CB5">💡 成語誕生：畫蛇添足</text>
        </svg>`,
      "cow-1": `
        <svg viewBox="0 0 560 315" xmlns="http://www.w3.org/2000/svg">
          <rect width="560" height="315" fill="#EAF4FF"/>
          <ellipse cx="280" cy="290" rx="310" ry="70" fill="#C4F1DC"/>
          <circle cx="110" cy="70" r="28" fill="#FFE28A"/>
          <circle cx="270" cy="152" r="36" fill="#FFE6D5" stroke="#4D3CB5" stroke-width="3.5"/>
          <rect x="234" y="188" width="72" height="72" rx="22" fill="#7D8BFF"/>
          <rect x="198" y="210" width="144" height="22" rx="10" fill="#C7926A" stroke="#6E472B" stroke-width="3"/>
          <text x="280" y="50" text-anchor="middle" font-size="24" font-weight="900" fill="#4D3CB5">🎵 音樂家公明儀抱著古琴來到草原</text>
        </svg>`,
      "cow-2": `
        <svg viewBox="0 0 560 315" xmlns="http://www.w3.org/2000/svg">
          <rect width="560" height="315" fill="#F0EEFF"/>
          <ellipse cx="280" cy="295" rx="310" ry="65" fill="#CCF3DF"/>
          <!-- 音符飄動 -->
          <text x="220" y="105" font-size="34" fill="#7C6CF0">♪</text>
          <text x="265" y="88" font-size="40" fill="#5A9BFF">♫</text>
          <text x="315" y="112" font-size="32" fill="#FF8FB8">♪</text>
          <!-- 音樂家 -->
          <circle cx="155" cy="170" r="34" fill="#FFE6D5" stroke="#4D3CB5" stroke-width="3.5"/>
          <rect x="124" y="204" width="62" height="58" rx="18" fill="#7C6CF0"/>
          <rect x="108" y="220" width="106" height="18" rx="8" fill="#C7926A" stroke="#6E472B" stroke-width="3"/>
          <!-- 小黃牛 -->
          <ellipse cx="405" cy="212" rx="68" ry="44" fill="#FFD98E" stroke="#8C5A2B" stroke-width="3.5"/>
          <circle cx="348" cy="195" r="32" fill="#FFE3A8" stroke="#8C5A2B" stroke-width="3.5"/>
          <circle cx="338" cy="192" r="4" fill="#3D3470"/><circle cx="358" cy="192" r="4" fill="#3D3470"/>
          <text x="280" y="48" text-anchor="middle" font-size="23" font-weight="900" fill="#4D3CB5">🎶 他為大黃牛彈奏高深優美的名曲</text>
        </svg>`,
      "cow-3": `
        <svg viewBox="0 0 560 315" xmlns="http://www.w3.org/2000/svg">
          <rect width="560" height="315" fill="#F2F6FF"/>
          <ellipse cx="280" cy="295" rx="310" ry="68" fill="#C7F2DA"/>
          <ellipse cx="325" cy="202" rx="78" ry="48" fill="#FFD98E" stroke="#8C5A2B" stroke-width="3.5"/>
          <circle cx="255" cy="218" r="36" fill="#FFE3A8" stroke="#8C5A2B" stroke-width="3.5"/>
          <circle cx="244" cy="214" r="4" fill="#3D3470"/><circle cx="264" cy="214" r="4" fill="#3D3470"/>
          <ellipse cx="254" cy="232" rx="18" ry="10" fill="#FFB3CE"/>
          <text x="155" y="150" font-size="24" font-weight="900" fill="#7C6CF0">哞～青草真好吃…</text>
          <text x="280" y="52" text-anchor="middle" font-size="23" font-weight="900" fill="#C93A73">🌿 大黃牛完全聽不懂，只顧著低頭吃草！</text>
        </svg>`,
      "cow-4": `
        <svg viewBox="0 0 560 315" xmlns="http://www.w3.org/2000/svg">
          <rect width="560" height="315" fill="#EEF3FF"/>
          <ellipse cx="280" cy="295" rx="310" ry="65" fill="#CCF3DF"/>
          <text x="245" y="112" font-size="34" fill="#22B573">♫ 嗡嗡～哞哞～ ♪</text>
          <ellipse cx="360" cy="205" rx="70" ry="44" fill="#FFD98E" stroke="#8C5A2B" stroke-width="3.5"/>
          <circle cx="300" cy="182" r="34" fill="#FFE3A8" stroke="#8C5A2B" stroke-width="3.5"/>
          <circle cx="290" cy="178" r="4.5" fill="#3D3470"/><circle cx="310" cy="178" r="4.5" fill="#3D3470"/>
          <path d="M292 195 Q300 203 308 195" fill="none" stroke="#3D3470" stroke-width="3" stroke-linecap="round"/>
          <text x="280" y="52" text-anchor="middle" font-size="25" font-weight="900" fill="#4D3CB5">💡 成語誕生：對牛彈琴</text>
        </svg>`
    };
    if (scenes[sceneKey]) return scenes[sceneKey];
    const icon = String(meta.icon || "✨📖").replace(/[<>&"]/g, "");
    const title = String(meta.title || "成語互動小劇場").replace(/[<>&"]/g, "");
    const bgPalettes = [
      ["#EEF4FF", "#DDE9FF", "#7C6CF0"],
      ["#F3EEFF", "#E5DBFF", "#6B8CFF"],
      ["#EBF7FF", "#D5EFFF", "#5E4FD4"],
      ["#F5F0FF", "#FFE8F2", "#7C6CF0"]
    ];
    const idx = Math.abs(String(sceneKey).charCodeAt(String(sceneKey).length - 1) || 0) % bgPalettes.length;
    const [bg1, bg2, accent] = bgPalettes[idx];
    return `
      <svg viewBox="0 0 560 315" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="dynScBg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="${bg1}"/>
            <stop offset="100%" stop-color="${bg2}"/>
          </linearGradient>
        </defs>
        <rect width="560" height="315" fill="url(#dynScBg)"/>
        <circle cx="92" cy="70" r="46" fill="rgba(255,255,255,0.55)"/>
        <circle cx="475" cy="240" r="64" fill="rgba(255,255,255,0.45)"/>
        <rect x="65" y="74" width="430" height="196" rx="28" fill="rgba(255,255,255,0.92)" stroke="${accent}" stroke-width="3.5"/>
        <text x="280" y="182" text-anchor="middle" font-size="82">${icon}</text>
        <text x="280" y="48" text-anchor="middle" font-size="24" font-weight="900" fill="#4336A8">${title}</text>
        <text x="280" y="246" text-anchor="middle" font-size="16" font-weight="700" fill="#6F679E">★ 上林成語小劇場・每天精選不同成語故事 ★</text>
      </svg>`;
  }

  function pictureCardSvg(key, meta = {}) {
    if (key === "snake-legs") return animationSceneSvg("snake-3");
    if (key === "cow-lute") return animationSceneSvg("cow-2");
    if (key === "mend-fold") {
      return `
      <svg viewBox="0 0 560 315" xmlns="http://www.w3.org/2000/svg">
        <rect width="560" height="315" fill="#EEF6FF"/>
        <ellipse cx="280" cy="292" rx="300" ry="62" fill="#C9F2DB"/>
        <rect x="95" y="160" width="22" height="100" rx="6" fill="#C7926A" stroke="#7A4E2D" stroke-width="3"/>
        <rect x="175" y="160" width="22" height="100" rx="6" fill="#C7926A" stroke="#7A4E2D" stroke-width="3"/>
        <rect x="255" y="160" width="22" height="100" rx="6" fill="#D9A77C" stroke="#7A4E2D" stroke-width="3"/>
        <rect x="335" y="160" width="22" height="100" rx="6" fill="#C7926A" stroke="#7A4E2D" stroke-width="3"/>
        <rect x="82" y="184" width="290" height="18" rx="6" fill="#E3B58B" stroke="#7A4E2D" stroke-width="3"/>
        <rect x="82" y="224" width="290" height="18" rx="6" fill="#E3B58B" stroke="#7A4E2D" stroke-width="3"/>
        <circle cx="430" cy="205" r="34" fill="#FFFFFF" stroke="#7C6CF0" stroke-width="3.5"/>
        <circle cx="404" cy="208" r="24" fill="#FFFFFF" stroke="#7C6CF0" stroke-width="3.5"/>
        <circle cx="456" cy="208" r="24" fill="#FFFFFF" stroke="#7C6CF0" stroke-width="3.5"/>
        <circle cx="412" cy="198" r="20" fill="#FFEBD8" stroke="#7C6CF0" stroke-width="3"/>
        <circle cx="406" cy="196" r="3.5" fill="#3D3470"/><circle cx="418" cy="196" r="3.5" fill="#3D3470"/>
        <text x="280" y="54" text-anchor="middle" font-size="24" font-weight="900" fill="#4D3CB5">🔨 趕快把破掉的羊圈修補好！</text>
      </svg>`;
    }
    const icon = String(meta.icon || "🌿✨").replace(/[<>&"]/g, "");
    return `
      <svg viewBox="0 0 560 315" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="picDynBg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#EAF3FF"/>
            <stop offset="50%" stop-color="#F2EBFF"/>
            <stop offset="100%" stop-color="#E6F5FF"/>
          </linearGradient>
        </defs>
        <rect width="560" height="315" rx="22" fill="url(#picDynBg)"/>
        <circle cx="110" cy="80" r="40" fill="rgba(255,255,255,0.6)"/>
        <circle cx="460" cy="235" r="54" fill="rgba(255,255,255,0.5)"/>
        <rect x="78" y="64" width="404" height="194" rx="28" fill="#FFFFFF" stroke="#8B75F7" stroke-width="3.5"/>
        <text x="280" y="182" text-anchor="middle" font-size="88">${icon}</text>
        <text x="280" y="42" text-anchor="middle" font-size="22" font-weight="900" fill="#4D3CB5">🖼️ 看圖猜一猜・這是哪個成語？</text>
        <text x="280" y="238" text-anchor="middle" font-size="16" font-weight="700" fill="#7C78A3">點選右邊最符合圖片意象的四字成語！</text>
      </svg>`;
  }

  function dialogueSceneSvg(key) {
    if (key === "playground-run") {
      return `
        <svg viewBox="0 0 420 260" xmlns="http://www.w3.org/2000/svg">
          <rect width="420" height="260" rx="22" fill="#EAF4FF"/>
          <rect x="0" y="168" width="420" height="92" fill="#FFD9C7"/>
          <line x1="0" y1="198" x2="420" y2="198" stroke="#FFFFFF" stroke-width="4" stroke-dasharray="16 12"/>
          <line x1="0" y1="232" x2="420" y2="232" stroke="#FFFFFF" stroke-width="4" stroke-dasharray="16 12"/>
          <circle cx="340" cy="54" r="26" fill="#FFE184"/>
          <text x="210" y="120" text-anchor="middle" font-size="56">🏃‍♂️✨🏃‍♀️</text>
          <text x="210" y="218" text-anchor="middle" font-size="20" font-weight="900" fill="#5E4FD4">大隊接力決賽跑道</text>
        </svg>`;
    }
    if (key === "spring-park") {
      return `
        <svg viewBox="0 0 420 260" xmlns="http://www.w3.org/2000/svg">
          <rect width="420" height="260" rx="22" fill="#EBF8FF"/>
          <ellipse cx="210" cy="245" rx="230" ry="56" fill="#C7F4D8"/>
          <text x="210" y="128" text-anchor="middle" font-size="56">🌸🐦🌷</text>
          <text x="210" y="205" text-anchor="middle" font-size="20" font-weight="900" fill="#188C5D">春日微風花語公園</text>
        </svg>`;
    }
    return `
      <svg viewBox="0 0 420 260" xmlns="http://www.w3.org/2000/svg">
        <rect width="420" height="260" rx="22" fill="#F1EEFF"/>
        <rect x="110" y="42" width="200" height="145" rx="18" fill="#FFFFFF" stroke="#7C6CF0" stroke-width="4"/>
        <text x="210" y="128" text-anchor="middle" font-size="60">🐉🖌️</text>
        <text x="210" y="224" text-anchor="middle" font-size="20" font-weight="900" fill="#5E4FD4">美勞教室・神氣飛龍畫作</text>
      </svg>`;
  }

  function scholarBadgeSvg(size = 156, unlocked = true, rankTitle = "成語小童生", requiredDays = 15) {
    const opacity = unlocked ? "1" : "0.38";
    const safeTitle = String(rankTitle || "成語小童生").replace(/[<>&"]/g, "");
    return `
      <svg width="${size}" height="${size}" viewBox="0 0 180 180" xmlns="http://www.w3.org/2000/svg" style="opacity:${opacity}">
        <defs>
          <linearGradient id="badgeRing" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#FFE073"/>
            <stop offset="50%" stop-color="#FFB74D"/>
            <stop offset="100%" stop-color="#FFD86B"/>
          </linearGradient>
          <linearGradient id="badgeCore" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#698BFF"/>
            <stop offset="100%" stop-color="#8A67F5"/>
          </linearGradient>
        </defs>
        <polygon points="55,130 42,174 72,158 90,174 90,130" fill="#6E8BFF"/>
        <polygon points="125,130 138,174 108,158 90,174 90,130" fill="#8A6CF5"/>
        <circle cx="90" cy="84" r="66" fill="url(#badgeRing)" stroke="#D98B00" stroke-width="4"/>
        <circle cx="90" cy="84" r="54" fill="url(#badgeCore)" stroke="#FFFFFF" stroke-width="3.5"/>
        <polygon points="90,44 128,62 90,80 52,62" fill="#FFE680" stroke="#4D3CB5" stroke-width="3" stroke-linejoin="round"/>
        <rect x="68" y="68" width="44" height="14" rx="6" fill="#FFD04D" stroke="#4D3CB5" stroke-width="2.5"/>
        <text x="90" y="112" text-anchor="middle" font-size="18" font-weight="900" fill="#FFFFFF">${safeTitle}</text>
        <text x="90" y="129" text-anchor="middle" font-size="11" font-weight="700" fill="#FFE999">${requiredDays} DAYS RANK</text>
      </svg>`;
  }

  function leaderTrophySvg(size = 128) {
    return `
      <svg width="${size}" height="${size}" viewBox="0 0 160 160" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="cupGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#FFE680"/>
            <stop offset="100%" stop-color="#FFA93A"/>
          </linearGradient>
        </defs>
        <circle cx="80" cy="80" r="72" fill="rgba(255,214,102,0.22)"/>
        <path d="M44 44 H116 V74 C116 98 99 112 80 112 C61 112 44 98 44 74 Z" fill="url(#cupGold)" stroke="#C97B00" stroke-width="4"/>
        <path d="M44 52 C26 52 24 80 46 84" fill="none" stroke="#E09412" stroke-width="6" stroke-linecap="round"/>
        <path d="M116 52 C134 52 136 80 114 84" fill="none" stroke="#E09412" stroke-width="6" stroke-linecap="round"/>
        <rect x="72" y="112" width="16" height="20" fill="#E69A15"/>
        <rect x="50" y="130" width="60" height="14" rx="7" fill="#7C6CF0"/>
        <text x="80" y="83" text-anchor="middle" font-size="22" font-weight="900" fill="#7A4400">90%+</text>
      </svg>`;
  }

  return {
    mascotSvg,
    animationSceneSvg,
    pictureCardSvg,
    dialogueSceneSvg,
    scholarBadgeSvg,
    leaderTrophySvg
  };
})();
