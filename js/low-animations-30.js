// ============================================================================
// 上林成語小鎮 - 低年級專屬 30 部「1 分鐘成語動畫」劇本 ＋ 40 題「白話看圖選成語」題庫
// 專為國小 1～2 年級學童設計：語句親切可愛、短句好聽懂，適合語音朗讀旁白！
// ============================================================================
window.LowGradeContent30 = (function () {
  const ANIMATIONS_30 = [
    {
      id: "anim-01", idiom: "畫蛇添足", zhuyin: "ㄏㄨㄚˋ ㄕㄜˊ ㄊㄧㄢ ㄗㄨˊ", emoji: "🐍🦶",
      moral: "小朋友，做事情剛剛好就最棒了，多做不需要的事反而會弄壞原本的好成果喔！",
      scenes: [
        { sceneKey: "snake-1", icon: "🍵🎨", title: "畫小蛇比賽開始囉！", caption: "從前有幾位好朋友得到一壺甜甜的果茶，大家決定比賽在地上畫小蛇，誰最快畫好就能喝！" },
        { sceneKey: "snake-2", icon: "🐍✨", title: "哇！第一位小朋友畫好了！", caption: "第一位小畫家畫得超級快，刷刷刷一下子就把彎彎曲曲的小蛇畫得又像又可愛！" },
        { sceneKey: "snake-3", icon: "🐍🦶", title: "哎呀！多畫了四隻小腳！", caption: "他看別人還沒畫完，得意地想：「我再幫小蛇加上四隻小腳，一定更酷！」" },
        { sceneKey: "snake-4", icon: "💡🍵", title: "原來蛇沒有腳呀！", caption: "旁邊的朋友畫好真蛇把果茶拿走了，笑著說：「蛇本來就沒有腳呀！」這就是「畫蛇添足」喔！" }
      ]
    },
    {
      id: "anim-02", idiom: "對牛彈琴", zhuyin: "ㄉㄨㄟˋ ㄋㄧㄡˊ ㄊㄢˊ ㄑㄧㄣˊ", emoji: "🐮🎵",
      moral: "和別人聊天或分享故事時，要用對方聽得懂、喜歡聽的方式說，大家才會開心喔！",
      scenes: [
        { sceneKey: "cow-1", icon: "🎵🌿", title: "音樂家帶著古琴去散步", caption: "從前有位很會彈古琴的音樂家公明儀，有一天他抱著古琴來到綠油油的大草原。" },
        { sceneKey: "cow-2", icon: "🎶🐮", title: "彈一首好聽的歌給小牛聽", caption: "他看見一頭大黃牛在吃草，就開心地坐下來，為大黃牛彈奏一首好難好深奧的名曲。" },
        { sceneKey: "cow-3", icon: "🌿🐮", title: "大黃牛只想吃青草！", caption: "可是大黃牛完全聽不懂，只顧著低頭「哞～哞～」嚼著香香的青草，理都沒理他！" },
        { sceneKey: "cow-4", icon: "💡🎶", title: "換個方法大黃牛就聽懂啦！", caption: "後來他改彈像小蚊子和小牛叫的俏皮音樂，大黃牛才豎起耳朵！這就是「對牛彈琴」喔！" }
      ]
    },
    {
      id: "anim-03", idiom: "亡羊補牢", zhuyin: "ㄨㄤˊ ㄧㄤˊ ㄅㄨˇ ㄌㄠˊ", emoji: "🐑🔨",
      moral: "小朋友，做錯事或發現問題不要怕，趕快改進補救就永遠還來得及喔！",
      scenes: [
        { sceneKey: "dyn-1", icon: "🐑🕳️", title: "哎呀！羊圈破了一個洞！", caption: "從前有位牧羊人養了一群可愛的小白羊，有一天早上發現木柵欄破了一個洞，少了一隻小羊！" },
        { sceneKey: "dyn-2", icon: "🗣️🏠", title: "好心的鄰居來幫忙提醒", caption: "鄰居趕緊說：「快點把破洞補起來吧！不然大野狼晚上還會從這個洞鑽進來喔！」" },
        { sceneKey: "dyn-3", icon: "🔨🪵", title: "叮叮咚咚把柵欄修好了！", caption: "牧羊人馬上拿來木板和鐵釘，叮叮咚咚把羊圈修得比原來還要堅固又安全。" },
        { sceneKey: "dyn-4", icon: "💡🐑", title: "小羊們都平平安安！", caption: "從那天起小羊再也沒跑不見過！發現錯誤馬上補救，這就是「亡羊補牢」喔！" }
      ]
    },
    {
      id: "anim-04", idiom: "守株待兔", zhuyin: "ㄕㄡˇ ㄓㄨ ㄉㄞˋ ㄊㄨˋ", emoji: "🐇🌳",
      moral: "不能只想靠幸運不努力，小朋友每天認真學習才會得到最棒的收穫喔！",
      scenes: [
        { sceneKey: "dyn-1", icon: "🌾🧑‍🌾", title: "農夫在田裡努力種菜", caption: "從前有位農夫每天去田裡種菜，田邊有一棵大大的舊樹樁。" },
        { sceneKey: "dyn-2", icon: "🐇💥", title: "咚！小兔子撞到樹樁了！", caption: "有一天，一隻跑得太急的小野兔沒看路，咚一聲撞到樹樁暈過去，農夫一下子就撿到了！" },
        { sceneKey: "dyn-3", icon: "😴🌳", title: "農夫決定不種田只等兔子", caption: "農夫心想：「種田好累，以後我天天坐在樹樁旁等兔子撞過來就好啦！」" },
        { sceneKey: "dyn-4", icon: "💡🐇", title: "等了好久都沒有第二隻兔子", caption: "結果一整年都沒有兔子再撞過來，田裡全變雜草了！只想靠運氣就是「守株待兔」喔！" }
      ]
    },
    {
      id: "anim-05", idiom: "井底之蛙", zhuyin: "ㄐㄧㄥˇ ㄉㄧˇ ㄓ ㄨㄚ", emoji: "🐸💧",
      moral: "外面的世界好大好好玩，小朋友要多看書、多觀察，當個見多識廣的小達人喔！",
      scenes: [
        { sceneKey: "dyn-1", icon: "🐸🕳️", title: "住在小水井裡的小青蛙", caption: "有一隻小青蛙從小住在深深的枯井裡，每天在井底噗通跳水，覺得這裡是全世界最大的地方。" },
        { sceneKey: "dyn-2", icon: "🐢🌊", title: "大海龜經過井口打招呼", caption: "有一天，一隻從大海來的大海龜經過井邊，小青蛙開心地邀請海龜進來看牠的「大樂園」。" },
        { sceneKey: "dyn-3", icon: "🌌🌊", title: "海龜說起藍藍的大海", caption: "大海龜笑著說：「大海大得看不見邊，天空也不是只有圓圓的井口這麼小喔！」" },
        { sceneKey: "dyn-4", icon: "💡🐸", title: "哇！原來世界這麼大呀！", caption: "小青蛙聽了瞪大眼睛，決定跳出井口看世界！眼界太小就是「井底之蛙」喔！" }
      ]
    },
    {
      id: "anim-06", idiom: "狐假虎威", zhuyin: "ㄏㄨˊ ㄐㄧㄚˇ ㄏㄨˇ ㄨㄟ", emoji: "🦊🐯",
      moral: "小朋友要靠自己的好表現贏得大家喜歡，不可以借別人的力量去嚇同學喔！",
      scenes: [
        { sceneKey: "dyn-1", icon: "🐯🦊", title: "大老虎抓住了小狐狸", caption: "森林裡的大老虎抓到小狐狸，小狐狸靈機一動說：「我是森林大王派來的，你不能吃我喔！」" },
        { sceneKey: "dyn-2", icon: "🦊➡️🐯", title: "狐狸昂首走在大老虎前面", caption: "大老虎半信半疑，小狐狸就說：「不信你跟在我後面走一圈，看大家是不是都怕我！」" },
        { sceneKey: "dyn-3", icon: "🦌🐇💨", title: "森林小動物嚇得全跑光了！", caption: "小鹿和小兔看到小狐狸後面跟著凶猛的大老虎，全都嚇得一溜煙跑不見了！" },
        { sceneKey: "dyn-4", icon: "💡🦊", title: "大家其實是怕大老虎呀！", caption: "大老虎被騙了，原來動物們怕的是老虎不是狐狸！借別人的威風就是「狐假虎威」喔！" }
      ]
    },
    {
      id: "anim-07", idiom: "盲人摸象", zhuyin: "ㄇㄤˊ ㄖㄣˊ ㄇㄛ ㄒㄧㄤˋ", emoji: "🐘✋",
      moral: "認識一件事情要仔細看全部，不可以只看到一小塊就急著下結論喔！",
      scenes: [
        { sceneKey: "dyn-1", icon: "🐘✨", title: "大象來到熱鬧的小村莊", caption: "從前有四位看不見的旅人很想知道大象長什麼樣子，大家排隊用手摸一摸大象。" },
        { sceneKey: "dyn-2", icon: "🐘🪵", title: "像柱子還是像大扇子？", caption: "第一位摸到大象的粗腿喊：「大象像大柱子！」第二位摸到耳朵說：「不對，像大扇子！」" },
        { sceneKey: "dyn-3", icon: "🐘🪢", title: "像高牆還是像細繩子？", caption: "第三位摸到肚子說：「明明像一堵牆！」第四位摸到尾巴喊：「錯啦，是一條細繩子！」" },
        { sceneKey: "dyn-4", icon: "💡🐘", title: "合起來才是完整的大象！", caption: "其實每個人只摸到大象的一小部分！看事情不夠全面，就是「盲人摸象」喔！" }
      ]
    },
    {
      id: "anim-08", idiom: "畫龍點睛", zhuyin: "ㄏㄨㄚˋ ㄌㄨㄥˊ ㄉㄧㄢˇ ㄐㄧㄥ", emoji: "🐉🖌️",
      moral: "在最重要、最關鍵的地方加上精彩一筆，就能讓整張畫或作文變得超厲害喔！",
      scenes: [
        { sceneKey: "dyn-1", icon: "🖌️🏛️", title: "大畫家在牆上畫了神龍", caption: "從前有位厲害的大畫家張僧繇，在牆壁上畫了四條好威風、好神氣的大神龍。" },
        { sceneKey: "dyn-2", icon: "👀❓", title: "咦？怎麼沒畫上眼珠子？", caption: "大家靠近一看好驚訝：「怎麼沒有眼珠呀？」畫家笑說：「點上眼睛牠們就會飛走喔！」" },
        { sceneKey: "dyn-3", icon: "🖌️⚡", title: "輕輕點上墨黑眼珠！", caption: "大家好奇請他試試看。畫家一拿起毛筆點上兩條龍的眼珠，天空突然閃電雷鳴！" },
        { sceneKey: "dyn-4", icon: "💡🐉", title: "神龍真的飛上天空啦！", caption: "兩條神龍居然活了過來飛向雲端！關鍵處精彩的一筆，就是「畫龍點睛」喔！" }
      ]
    },
    {
      id: "anim-09", idiom: "塞翁失馬", zhuyin: "ㄙㄞˋ ㄨㄥ ㄕ ㄇㄚˇ", emoji: "🐴🍀",
      moral: "遇到小小的不開心不要難過太久，笑一笑保持好心情，好運很快就會來敲門喔！",
      scenes: [
        { sceneKey: "dyn-1", icon: "🐴💨", title: "老爺爺的小馬跑不見了", caption: "從前有位老爺爺家的小馬走丟了，鄰居都來安慰他，老爺爺卻笑著說：「說不定是好事喔！」" },
        { sceneKey: "dyn-2", icon: "🐴🐴✨", title: "小馬帶回一匹好朋友！", caption: "過沒幾天，走丟的小馬居然帶著一匹更強壯的駿馬跑回來了，大家開心地恭喜他！" },
        { sceneKey: "dyn-3", icon: "🤕🏠", title: "小意外反而帶來平安", caption: "後來兒子騎馬摔傷了腿，但不久邊疆打仗，兒子因為在家養傷反而平平安安沒事！" },
        { sceneKey: "dyn-4", icon: "💡🍀", title: "壞事也可能會變成好事！", caption: "老爺爺一直保持冷靜樂觀的心情！這就是大家常說的「塞翁失馬」喔！" }
      ]
    },
    {
      id: "anim-10", idiom: "愚公移山", zhuyin: "ㄩˊ ㄍㄨㄥ ㄧˊ ㄕㄢ", emoji: "⛰️⛏️",
      moral: "小朋友只要有耐心、每天堅持做一點點，再大的難題最後一定能完成喔！",
      scenes: [
        { sceneKey: "dyn-1", icon: "⛰️🏡", title: "家門前有兩座超級大山", caption: "從前有位叫愚公的老爺爺，家門前被兩座大山擋住，每次出門買菜都要繞好大一圈。" },
        { sceneKey: "dyn-2", icon: "⛏️👨‍👩‍👧‍👦", title: "全家人一起快樂挖山", caption: "愚公帶著全家大小一起拿著小鋤頭和竹籃，每天把石頭和泥土一點一點挑走。" },
        { sceneKey: "dyn-3", icon: "💪⏳", title: "每天挖一點，絕不放棄！", caption: "有人笑他挖不完，愚公微笑說：「山不會變高，我們一代一代努力挖，總有一天會挖平！」" },
        { sceneKey: "dyn-4", icon: "💡⛰️", title: "誠心感動了大力神幫忙！", caption: "天上的神仙被他們的毅力感動，幫忙把大山搬走了！堅持不放棄就是「愚公移山」喔！" }
      ]
    },
    {
      id: "anim-11", idiom: "葉公好龍", zhuyin: "ㄧㄝˋ ㄍㄨㄥ ㄏㄠˋ ㄌㄨㄥˊ", emoji: "🐉😮",
      moral: "喜歡一件事要真心去愛護與學習，不可以只有嘴巴上說說而已喔！",
      scenes: [
        { sceneKey: "dyn-1", icon: "🏠🐉", title: "家裡到處都是龍的圖案", caption: "古代有位葉公，每天說自己最喜歡龍，連牆壁、杯子和衣服上全都畫滿了龍。" },
        { sceneKey: "dyn-2", icon: "☁️🐉", title: "天上的真龍想來交朋友！", caption: "天上的真龍聽說葉公這麼喜歡自己，好開心，決定飛到葉公家和他做朋友！" },
        { sceneKey: "dyn-3", icon: "🪟😱", title: "看到真龍反而嚇跑了！", caption: "真龍把頭探進窗戶笑著打招呼，沒想到葉公一看見真的龍，竟然嚇得拔腿就跑！" },
        { sceneKey: "dyn-4", icon: "💡🐉", title: "原來不是真的喜歡呀！", caption: "葉公只喜歡假畫，並不是真心喜歡龍！嘴巴說喜歡卻不真心，就是「葉公好龍」喔！" }
      ]
    },
    {
      id: "anim-12", idiom: "刻舟求劍", zhuyin: "ㄎㄜˋ ㄓㄡ ㄑㄧㄡˊ ㄐㄧㄢˋ", emoji: "⛵⚔️",
      moral: "事情和環境會一直變化，小朋友要動動聰明小腦袋隨機應變喔！",
      scenes: [
        { sceneKey: "dyn-1", icon: "⛵🌊", title: "噗通！寶劍掉進河裡了！", caption: "從前有個人搭小船過河，一不小心把心愛的寶劍「噗通」一聲掉進河水裡了！" },
        { sceneKey: "dyn-2", icon: "🔪⛵", title: "在船邊刻一個小記號", caption: "他不急著跳下去找，反而拿小刀在船邊刻了個記號說：「寶劍是從這裡掉下去的！」" },
        { sceneKey: "dyn-3", icon: "🏊‍♂️❓", title: "船開到岸邊才下水找", caption: "小船一路往前開到對岸停下後，他才從船邊記號跳下去找，當然怎麼找都找不到！" },
        { sceneKey: "dyn-4", icon: "💡⛵", title: "船一直在動，寶劍在原地呀！", caption: "船已經開走好遠了，記號怎麼還會準呢？不懂變通就會像「刻舟求劍」一樣喔！" }
      ]
    },
    {
      id: "anim-13", idiom: "掩耳盜鈴", zhuyin: "ㄧㄢˇ ㄦˇ ㄉㄠˋ ㄌㄧㄥˊ", emoji: "🙉🔔",
      moral: "小朋友不可以偷偷做壞事還以為別人不知道，誠實才是最棒的好孩子喔！",
      scenes: [
        { sceneKey: "dyn-1", icon: "🔔✨", title: "看見一個亮晶晶的大銅鈴", caption: "從前有個貪心的人，看見別人家門前掛著一個好漂亮的銅鈴，好想偷偷拿走。" },
        { sceneKey: "dyn-2", icon: "🔔🔊", title: "叮噹！一碰就會大聲響！", caption: "可是銅鈴好重，他想敲碎帶走，一敲就會發出「噹！噹！」好大聲，會被大家發現！" },
        { sceneKey: "dyn-3", icon: "🙉🔨", title: "居然摀住自己的耳朵！", caption: "他傻傻地想：「只要我把自己的耳朵摀起來聽不見聲音，別人就也聽不見了吧！」" },
        { sceneKey: "dyn-4", icon: "💡🔔", title: "噹噹聲大家都聽見啦！", caption: "結果他一敲鈴鐺，大家立刻聽見聲音衝出來抓到他！自己騙自己就是「掩耳盜鈴」喔！" }
      ]
    },
    {
      id: "anim-14", idiom: "拔苗助長", zhuyin: "ㄅㄚˊ ㄇㄧㄠˊ ㄓㄨˋ ㄓㄤˇ", emoji: "🌱⬆️",
      moral: "植物和小朋友長大都需要時間，急著亂拉反而會受傷，耐心等待才會長得又高又壯喔！",
      scenes: [
        { sceneKey: "dyn-1", icon: "🌱🧑‍🌾", title: "希望小禾苗快點長高！", caption: "從前有位心急的農夫，每天跑到田裡看小禾苗，總覺得它們長得好慢好慢。" },
        { sceneKey: "dyn-2", icon: "✋🌱", title: "把每棵小苗都往上拔！", caption: "有一天他想出一個怪點子，蹲在田裡一棵一棵把小禾苗用力往上拔高了一小截！" },
        { sceneKey: "dyn-3", icon: "😓🏠", title: "回家得意地向家人炫耀", caption: "他累得滿頭大汗回家說：「我今天太辛苦了，幫田裡所有的禾苗都長高了喔！」" },
        { sceneKey: "dyn-4", icon: "💡🥀", title: "小禾苗全都枯黃垂頭了！", caption: "隔天一看，小苗因為根被拔斷全都枯萎了！太心急弄壞事情就是「拔苗助長」喔！" }
      ]
    },
    {
      id: "anim-15", idiom: "自相矛盾", zhuyin: "ㄗˋ ㄒㄧㄤ ㄇㄠˊ ㄉㄨㄣˋ", emoji: "🗡️🛡️",
      moral: "小朋友說話要誠實想清楚，不可以前面說一套、後面又說完全相反的話喔！",
      scenes: [
        { sceneKey: "dyn-1", icon: "🛡️✨", title: "誇耀世界上最堅固的盾牌", caption: "市集裡有位賣武器的老闆舉起盾牌大喊：「我的盾牌最堅固，什麼東西都刺不破！」" },
        { sceneKey: "dyn-2", icon: "🗡️✨", title: "又誇耀最鋒利的長矛", caption: "過了一會兒，他又舉起長矛大喊：「我的長矛最鋒利，不管多硬的東西都能刺穿！」" },
        { sceneKey: "dyn-3", icon: "🤔💬", title: "小朋友舉手問了一個妙問題", caption: "旁邊有位聰明人問：「那如果用你最利的矛，去刺你最硬的盾，會怎麼樣呢？」" },
        { sceneKey: "dyn-4", icon: "💡😅", title: "老闆臉紅答不出來啦！", caption: "老闆聽完呆住了，一句話都回答不出來！說話前後打架就是「自相矛盾」喔！" }
      ]
    },
    {
      id: "anim-16", idiom: "精衛填海", zhuyin: "ㄐㄧㄥ ㄨㄟˋ ㄊㄧㄢˊ ㄏㄞˇ", emoji: "🐦🪨",
      moral: "只要下定決心不怕困難，勇敢堅持到底，小小力量也能感動全世界喔！",
      scenes: [
        { sceneKey: "dyn-1", icon: "🌊🐦", title: "變成可愛小花鳥的精衛", caption: "神話故事裡，可愛的小精衛鳥有著花花羽毛和紅紅小腳，對浩瀚的大海一點也不害怕。" },
        { sceneKey: "dyn-2", icon: "🪵🪨", title: "每天飛到西山銜起小石子", caption: "精衛鳥決定要把大海填平，每天飛到高高的西山上，用小小的嘴巴叼起小樹枝和小石子。" },
        { sceneKey: "dyn-3", icon: "🐦🌊", title: "一趟又一趟飛到大海邊", caption: "不管颳風還是下雨，精衛鳥飛到大海上空，把石子丟進海裡，永遠不說放棄！" },
        { sceneKey: "dyn-4", icon: "💡✨", title: "永不放棄的勇敢精神！", caption: "大家都很佩服精衛鳥堅定勇敢的決心！這就是非常有毅力的「精衛填海」喔！" }
      ]
    },
    {
      id: "anim-17", idiom: "孔融讓梨", zhuyin: "ㄎㄨㄥˇ ㄖㄨㄥˊ ㄖㄤˋ ㄌㄧˊ", emoji: "🍐👧👦",
      moral: "好東西懂得禮讓和分享給家人與同學，大家都會稱讚你是最貼心的小天使喔！",
      scenes: [
        { sceneKey: "dyn-1", icon: "🍐✨", title: "桌上有一盤香甜的水梨", caption: "四歲的小孔融和哥哥弟弟一起吃點心，桌上的盤子裡裝滿了大小不一樣的香甜水梨。" },
        { sceneKey: "dyn-2", icon: "👦🍐", title: "小孔融挑了最小的那一顆", caption: "輪到孔融拿水梨時，他沒有搶最大顆的，反而笑咪咪地挑了一顆最小的水梨。" },
        { sceneKey: "dyn-3", icon: "👨‍👦💬", title: "爸爸好奇地問為什麼？", caption: "孔融禮貌地說：「我年紀比較小，吃小的就夠了；大顆的留給哥哥和更小的弟弟吃！」" },
        { sceneKey: "dyn-4", icon: "💡💖", title: "大家都誇獎孔融真懂事！", caption: "全家人聽了都開心地稱讚孔融！懂得謙讓分享的好品格，就是「孔融讓梨」喔！" }
      ]
    },
    {
      id: "anim-18", idiom: "鐵杵磨針", zhuyin: "ㄊㄧㄝˇ ㄔㄨˇ ㄇㄛˊ ㄓㄣ", emoji: "🪡🪨",
      moral: "只要肯花時間認真練習，就像每天打卡 5 分鐘一樣，再難的功課都能變簡單喔！",
      scenes: [
        { sceneKey: "dyn-1", icon: "👦🏞️", title: "小李白溜出教室去散步", caption: "小時候的詩人李白有一天覺得讀書好累，偷偷溜到小溪邊玩耍。" },
        { sceneKey: "dyn-2", icon: "👵🪨", title: "老奶奶在石頭上磨大鐵棒", caption: "他看見一位白髮老奶奶拿著一根好粗的大鐵棒，在溪邊大石頭上一下一下認真地磨著。" },
        { sceneKey: "dyn-3", icon: "🪡✨", title: "把大鐵棒磨成小繡花針！", caption: "老奶奶笑著說：「只要每天不停地磨，大鐵棒總有一天會變成細細亮亮的繡花針喔！」" },
        { sceneKey: "dyn-4", icon: "💡📚", title: "小李白立刻跑回去認真讀書！", caption: "李白聽完好感動，回去用功讀書成為大詩人！只要下苦功就能「鐵杵磨針」喔！" }
      ]
    },
    {
      id: "anim-19", idiom: "笨鳥先飛", zhuyin: "ㄅㄣˋ ㄋㄧㄠˇ ㄒㄧㄢ ㄈㄟ", emoji: "🐦🚀",
      moral: "覺得自己做比較慢沒關係，只要提早一點點開始準備，一樣可以拿第一名喔！",
      scenes: [
        { sceneKey: "dyn-1", icon: "🐦☁️", title: "小鳥們準備飛去南方過冬", caption: "秋天到了，樹林裡的小鳥們準備一起展開長途飛行，飛往溫暖的南方。" },
        { sceneKey: "dyn-2", icon: "🐣💪", title: "小麻雀覺得自己飛得比較慢", caption: "有一隻翅膀比較小的鳥兒知道自己飛得沒別人快，心想：「我該怎麼跟上大家呢？」" },
        { sceneKey: "dyn-3", icon: "🌅🐦", title: "天還沒亮就早早拍拍翅膀！", caption: "於是牠比大家早好幾天就先起飛，一路上不停努力拍動翅膀往前飛！" },
        { sceneKey: "dyn-4", icon: "💡🏆", title: "居然最早到達溫暖的南方！", caption: "因為提早出發又努力，牠順利跟大家會合了！提早努力準備就是「笨鳥先飛」喔！" }
      ]
    },
    {
      id: "anim-20", idiom: "望梅止渴", zhuyin: "ㄨㄤˋ ㄇㄟˊ ㄓˇ ㄎㄜˇ", emoji: "🍑💧",
      moral: "遇到困難口渴疲累時，給自己一點正向美好的想像，也能重新充滿力量喔！",
      scenes: [
        { sceneKey: "dyn-1", icon: "☀️🥵", title: "大太陽下行軍好口渴呀！", caption: "大熱天裡，曹操帶著士兵走在乾燥的路上，水壺全都喝光了，大家又渴又走不動。" },
        { sceneKey: "dyn-2", icon: "👉🌳", title: "前面有一大片酸甜梅子林！", caption: "聰明的曹操指著前面大喊：「加油！翻過前面那座山，就有一大片結滿大梅子的樹林！」" },
        { sceneKey: "dyn-3", icon: "🤤🍑", title: "想到酸酸的梅子就流口水！", caption: "士兵們一想到又酸又甜的大梅子，嘴巴裡立刻冒出好多口水，竟然覺得沒那麼渴了！" },
        { sceneKey: "dyn-4", icon: "💡💧", title: "大家打起精神找到水源啦！", caption: "全軍充滿幹勁往前走，終於找到清涼水源！用想像安慰自己就是「望梅止渴」喔！" }
      ]
    },
    {
      id: "anim-21", idiom: "驚弓之鳥", zhuyin: "ㄐㄧㄥ ㄍㄨㄥ ㄓ ㄋㄧㄠˇ", emoji: "🐦🏹",
      moral: "勇敢面對小小的害怕，冷靜觀察就不會自己嚇自己喔！",
      scenes: [
        { sceneKey: "dyn-1", icon: "🐦☁️", title: "天空中飛來一隻孤單大雁", caption: "有一天，一隻大雁孤單地從天空飛過，叫聲聽起來有點害怕，飛得也慢吞吞的。" },
        { sceneKey: "dyn-2", icon: "🏹✨", title: "神射手拉開空弓「嘣」一聲！", caption: "神射手更羸仔細一看，連箭都沒放上去，只是用力拉開弓弦發出「嘣」的一聲響！" },
        { sceneKey: "dyn-3", icon: "🐦💫", title: "大雁聽到聲音嚇得掉下來！", caption: "那隻大雁一聽見弓弦響，嚇得用力拍翅膀，舊傷口一痛居然真的從天空掉下來了！" },
        { sceneKey: "dyn-4", icon: "💡🐦", title: "原來牠以前被箭嚇壞過！", caption: "受過驚嚇變得太緊張害怕，一點聲音就嚇一跳，這就是「驚弓之鳥」喔！" }
      ]
    },
    {
      id: "anim-22", idiom: "杯弓蛇影", zhuyin: "ㄅㄟ ㄍㄨㄥ ㄕㄜˊ ㄧㄥˇ", emoji: "🏹🐍",
      moral: "覺得害怕或誤會別人時，先靜下心查清楚真相，就不會自己嚇自己啦！",
      scenes: [
        { sceneKey: "dyn-1", icon: "🍵🏠", title: "去好朋友家喝香香的茶", caption: "從前有個人去好朋友家做客，正端起茶杯準備喝茶時，突然看見杯子裡有一條扭動的小蛇！" },
        { sceneKey: "dyn-2", icon: "😱🛏️", title: "回家後越想越害怕！", caption: "他不好意思說出口，勉強喝完茶回家，結果心裡一直害怕肚子裡有小蛇，居然病倒了！" },
        { sceneKey: "dyn-3", icon: "🏹🪞", title: "好朋友幫他找出真相！", caption: "好朋友請他再坐回原位一看，原來牆上掛著一把彩繪弓箭，倒映在茶杯裡就像一條小蛇！" },
        { sceneKey: "dyn-4", icon: "💡😄", title: "真相大白，病立刻就好啦！", caption: "誤會解開後他馬上開心地笑了！自己疑神疑鬼嚇自己，就是「杯弓蛇影」喔！" }
      ]
    },
    {
      id: "anim-23", idiom: "胸有成竹", zhuyin: "ㄒㄩㄥ ㄧㄡˇ ㄔㄥˊ ㄓㄨˊ", emoji: "🎋🎨",
      moral: "考試或表演前先認真練習準備好，上場就會超級有自信喔！",
      scenes: [
        { sceneKey: "dyn-1", icon: "🎋🏡", title: "最愛觀察竹子的大畫家", caption: "宋朝有位大畫家文與可，最喜歡畫竹子，他在家裡屋前屋後種了滿滿一大片翠綠竹林。" },
        { sceneKey: "dyn-2", icon: "👀🌧️", title: "晴天雨天都仔細觀察", caption: "不論大晴天、下雨天還是起微風，他每天都在竹林裡細心觀察竹葉擺動的樣子。" },
        { sceneKey: "dyn-3", icon: "🖌️🎋", title: "一拿起畫筆就畫得超生動！", caption: "每次還沒動筆之前，竹子活生生的模樣早就在他心裡一清二楚，一畫出來就栩栩如生！" },
        { sceneKey: "dyn-4", icon: "💡✨", title: "事前準備好，超有把握！", caption: "做事前心裡已經做好充分準備與把握，這就是充滿自信的「胸有成竹」喔！" }
      ]
    },
    {
      id: "anim-24", idiom: "畫餅充飢", zhuyin: "ㄏㄨㄚˋ ㄅㄧㄥˇ ㄔㄨㄥ ㄐㄧ", emoji: "🥞🖍️",
      moral: "肚子餓或想完成夢想不能只靠空想，要實際動手行動才會成功喔！",
      scenes: [
        { sceneKey: "dyn-1", icon: "😋💭", title: "肚子咕嚕咕嚕好餓喔！", caption: "從前有個人肚子好餓，可是家裡沒有點心，他看著空空的桌子嘆了一口氣。" },
        { sceneKey: "dyn-2", icon: "🖍️🥞", title: "在地上畫了一個大大圓圓的餅", caption: "他拿起樹枝在地上畫了一個又圓又大的香噴噴燒餅，還幫它加上滿滿的芝麻！" },
        { sceneKey: "dyn-3", icon: "🤤❓", title: "看再久肚子還是咕嚕叫！", caption: "他盯著地上的畫一直想像燒餅的味道，可是畫出來的餅根本不能吃，肚子還是好餓！" },
        { sceneKey: "dyn-4", icon: "💡💪", title: "要實際行動才有用喔！", caption: "只靠空想解決不了真正的問題，這就是提醒我們要實際行動的「畫餅充飢」喔！" }
      ]
    },
    {
      id: "anim-25", idiom: "滴水穿石", zhuyin: "ㄉㄧ ㄕㄨㄟˇ ㄔㄨㄢ ㄕˊ", emoji: "💧🪨",
      moral: "小小的水滴每天堅持滴落都能穿透大石頭，我們每天學成語一定會越來越棒喔！",
      scenes: [
        { sceneKey: "dyn-1", icon: "💧⛰️", title: "屋簷下滴答滴答的小水滴", caption: "山洞口有一滴一滴清涼的小水珠，每天「滴答、滴答」落在下面一塊好硬的大石頭上。" },
        { sceneKey: "dyn-2", icon: "🪨😏", title: "大石頭覺得水滴好渺小", caption: "大石頭一開始笑著說：「小水滴這麼輕這麼軟，怎麼可能動得了硬邦邦的我呢？」" },
        { sceneKey: "dyn-3", icon: "⏳💧", title: "一年又一年從來沒停過！", caption: "可是小水滴從來沒有休息，不管春夏秋冬，每天都準時滴在同一個小小的位置上。" },
        { sceneKey: "dyn-4", icon: "💡✨", title: "硬邦邦的石頭真的出現小洞啦！", caption: "過了好久好久，石頭竟然真的被滴穿了一個洞！持之以恆就是「滴水穿石」喔！" }
      ]
    },
    {
      id: "anim-26", idiom: "老馬識途", zhuyin: "ㄌㄠˇ ㄇㄚˇ ㄕˊ ㄊㄨˊ", emoji: "🐴🧭",
      moral: "長輩和老師有很多寶貴的生活經驗，遇到困難時虛心請教就能找到好方向喔！",
      scenes: [
        { sceneKey: "dyn-1", icon: "❄️🏔️", title: "大雪紛飛，軍隊迷路了！", caption: "冬天大雪把山路全蓋住了，齊國的軍隊打完勝仗要回家時，竟然在白茫茫的山谷迷路了！" },
        { sceneKey: "dyn-2", icon: "🧠💡", title: "聰明的管仲想到好辦法", caption: "聰明的宰相管仲笑著說：「別擔心！把隊伍裡年紀最大、經驗最豐富的老馬放出來帶路吧！」" },
        { sceneKey: "dyn-3", icon: "🐴👣", title: "老馬穩穩地走在最前面", caption: "老馬聞一聞風向、看了看山頭，不慌不忙地帶著大家穿過雪地，一步步走出迷宮。" },
        { sceneKey: "dyn-4", icon: "💡🏡", title: "大家順利平安回到家啦！", caption: "原來經驗豐富的人最懂得帶路！這就是讚美智慧與經驗的「老馬識途」喔！" }
      ]
    },
    {
      id: "anim-27", idiom: "濫竽充數", zhuyin: "ㄌㄢˋ ㄩˊ ㄔㄨㄥ ㄕㄨˋ", emoji: "🎺😅",
      moral: "小朋友要扎扎實實學會真本領，不要假裝會做混在人群裡喔！",
      scenes: [
        { sceneKey: "dyn-1", icon: "🎶👑", title: "喜歡聽大合奏的國王", caption: "從前齊宣王最喜歡聽三百個人一起吹「竽」這種樂器，聲音好熱鬧好壯觀！" },
        { sceneKey: "dyn-2", icon: "🎺😜", title: "不會吹的南郭先生也混進去", caption: "有個完全不會吹樂器的南郭先生也混進樂隊裡，每次都假裝鼓起嘴巴搖頭晃腦領薪水！" },
        { sceneKey: "dyn-3", icon: "👑☝️", title: "新國王喜歡一個一個獨奏！", caption: "後來新國王齊湣王上任了，他卻說：「我喜歡聽每位樂師輪流一個人獨奏！」" },
        { sceneKey: "dyn-4", icon: "💡🏃", title: "南郭先生嚇得連夜逃跑啦！", caption: "不會真功夫一下就被拆穿了！沒本事硬混在裡面充數，就是「濫竽充數」喔！" }
      ]
    },
    {
      id: "anim-28", idiom: "雪中送炭", zhuyin: "ㄒㄩㄝˇ ㄓㄨㄥ ㄙㄨㄥˋ ㄊㄢˋ", emoji: "❄️🔥",
      moral: "同學難過或忘記帶文具時主動伸出援手，你就是最溫暖的小太陽喔！",
      scenes: [
        { sceneKey: "dyn-1", icon: "❄️🥶", title: "下大雪的寒冷冬天", caption: "北宋有一年冬天突然下起好大的雪，天氣冷得讓人直發抖，窮苦人家連生火的木炭都沒有。" },
        { sceneKey: "dyn-2", icon: "🔥🎁", title: "皇帝派人送來溫暖木炭", caption: "善良的宋太宗想到冷得受不了的百姓，立刻派人冒著大雪，把一籃籃木炭和糧食送到大家家裡。" },
        { sceneKey: "dyn-3", icon: "🏡😊", title: "屋子裡立刻變得暖呼呼！", caption: "大家點起溫暖的炭火，心裡感動得不得了，整個冬天都過得暖呼呼又安心！" },
        { sceneKey: "dyn-4", icon: "💡❤️", title: "在最需要時給予幫助最珍貴！", caption: "在別人最困難的時候送上及時溫暖的幫忙，就是超感人的「雪中送炭」喔！" }
      ]
    },
    {
      id: "anim-29", idiom: "一箭雙雕", zhuyin: "ㄧ ㄐㄧㄢˋ ㄕㄨㄤ ㄉㄧㄠ", emoji: "🏹🦅",
      moral: "聰明安排時間，做一件事就能同時收穫兩個好處，超級棒喔！",
      scenes: [
        { sceneKey: "dyn-1", icon: "🦅🦅", title: "天空中飛著兩隻爭食物的大雕", caption: "從前有位叫長孫晟的神射手，在草原上看天空，發現有兩隻大雕正飛在一起搶肉吃。" },
        { sceneKey: "dyn-2", icon: "🏹👀", title: "仔細瞄準最棒的時機", caption: "旁邊的朋友遞給他兩支箭，長孫晟微笑說：「只要一支箭就夠囉！」" },
        { sceneKey: "dyn-3", icon: "⚡🏹", title: "咻一聲射中兩隻大雕！", caption: "他冷靜拉滿弓，趁兩隻大雕靠在一起的那一瞬間放箭，咻的一聲居然同時射中兩隻！" },
        { sceneKey: "dyn-4", icon: "💡🎯", title: "一次行動得到兩個好收穫！", caption: "全場都大聲鼓掌叫好！做一件事同時達到兩個目標，就是「一箭雙雕」喔！" }
      ]
    },
    {
      id: "anim-30", idiom: "螳螂捕蟬", zhuyin: "ㄊㄤˊ ㄌㄤˊ ㄅㄨˇ ㄔㄢˊ", emoji: "🦗🐦",
      moral: "做事情要前後左右都看清楚，注意安全，不能只盯著眼前好玩的事喔！",
      scenes: [
        { sceneKey: "dyn-1", icon: "🌳🦗", title: "大樹上有一隻開心的知了", caption: "夏天的大樹枝上，一隻知了正在樹梢喝著甜甜露水唱歌，沒發現後面有隻小螳螂靠近。" },
        { sceneKey: "dyn-2", icon: "🦗👀", title: "螳螂舉起前臂專心盯著知了", caption: "小螳螂躡手躡腳走過去，眼睛死死盯著知了，正準備伸出大鐮刀抓住牠！" },
        { sceneKey: "dyn-3", icon: "🐦✨", title: "後面還有一隻黃雀看著螳螂！", caption: "可是螳螂太專心盯著前面了，完全沒注意到自己的身後還有一隻黃雀正準備抓牠呢！" },
        { sceneKey: "dyn-4", icon: "💡👀", title: "做事要小心看清周圍喔！", caption: "只顧眼前好處卻忘了身後的危險，這就是提醒我們要小心觀察的「螳螂捕蟬」喔！" }
      ]
    }
  ];

  // 40 題專為國小低年級編寫的「看圖選成語」白話親切題庫！
  const LOW_PIC_QUIZZES_40 = [
    { id: "lp-01", illustrationKey: "snake-legs", icon: "🐍🦶", answer: "畫蛇添足", options: ["畫蛇添足", "對牛彈琴", "守株待兔", "井底之蛙"], prompt: "小蛇本來沒有腳，小朋友卻幫牠多畫了四隻腳，這是哪一個成語呢？", explanation: "小蛇不需要腳，多做沒必要的事就是「畫蛇添足」喔！" },
    { id: "lp-02", illustrationKey: "cow-lute", icon: "🐮🎵", answer: "對牛彈琴", options: ["亡羊補牢", "對牛彈琴", "狐假虎威", "鳥語花香"], prompt: "音樂家認真地彈著古琴，可是大黃牛只顧著吃草聽不懂，這是哪個成語？", explanation: "對著聽不懂的小牛彈琴，就是「對牛彈琴」喔！" },
    { id: "lp-03", illustrationKey: "mend-fold", icon: "🐑🔨", answer: "亡羊補牢", options: ["亡羊補牢", "畫蛇添足", "一舉兩得", "盲人摸象"], prompt: "小羊跑出去後，牧羊人趕快拿木板把破掉的柵欄修好，這是哪個成語？", explanation: "發現錯誤趕快補救還來得及，這就是「亡羊補牢」喔！" },
    { id: "lp-04", illustrationKey: "dynamic-pic", icon: "🐇🌳", answer: "守株待兔", options: ["守株待兔", "亡羊補牢", "老馬識途", "畫龍點睛"], prompt: "農夫不種田，每天坐在大樹樁旁邊傻傻等兔子撞過來，這是哪個成語？", explanation: "只想靠運氣不努力，就是「守株待兔」喔！" },
    { id: "lp-05", illustrationKey: "dynamic-pic", icon: "🐸💧", answer: "井底之蛙", options: ["井底之蛙", "如魚得水", "笨鳥先飛", "鶴立雞群"], prompt: "小青蛙一直住在深深的水井裡，以為天空只有井口那麼圓小，這是哪個成語？", explanation: "沒看過外面大世界、見識太小，就是「井底之蛙」喔！" },
    { id: "lp-06", illustrationKey: "dynamic-pic", icon: "🦊🐯", answer: "狐假虎威", options: ["狐假虎威", "生龍活虎", "馬馬虎虎", "虎頭蛇尾"], prompt: "小狐狸走在大老虎前面，借著大老虎的威風去嚇森林裡的小動物，這是哪個成語？", explanation: "借別人的力量嚇唬別人，就是「狐假虎威」喔！" },
    { id: "lp-07", illustrationKey: "dynamic-pic", icon: "🐘✋", answer: "盲人摸象", options: ["盲人摸象", "葉公好龍", "刻舟求劍", "掩耳盜鈴"], prompt: "四個人閉著眼睛只摸到大象的耳朵、尾巴或腿，就吵著說大象像扇子或繩子，這是哪個成語？", explanation: "只看到一小部分就亂猜全部，就是「盲人摸象」喔！" },
    { id: "lp-08", illustrationKey: "dynamic-pic", icon: "🐉🖌️", answer: "畫龍點睛", options: ["畫龍點睛", "畫蛇添足", "葉公好龍", "龍飛鳳舞"], prompt: "大畫家用毛筆幫牆上的龍點上眼珠子，神龍立刻變得活生生飛上天，這是哪個成語？", explanation: "加上最關鍵精彩的一筆，就是「畫龍點睛」喔！" },
    { id: "lp-09", illustrationKey: "dynamic-pic", icon: "🐦🌸", answer: "鳥語花香", options: ["鳥語花香", "春暖花開", "五顏六色", "風和日麗"], prompt: "春天的公園裡，枝頭上的小鳥開心唱歌、花朵散發香香的味道，這是哪個成語？", explanation: "小鳥唱歌、花朵香香的春天美景，就是「鳥語花香」喔！" },
    { id: "lp-10", illustrationKey: "dynamic-pic", icon: "🙉🔔", answer: "掩耳盜鈴", options: ["掩耳盜鈴", "自相矛盾", "刻舟求劍", "拔苗助長"], prompt: "貪心的人摀住自己的耳朵去偷大鈴鐺，以為別人也聽不見聲音，這是哪個成語？", explanation: "自己騙自己以為別人不知道，就是「掩耳盜鈴」喔！" },
    { id: "lp-11", illustrationKey: "dynamic-pic", icon: "🌱⬆️", answer: "拔苗助長", options: ["拔苗助長", "滴水穿石", "愚公移山", "胸有成竹"], prompt: "心急的農夫把田裡的小禾苗一棵棵用力往上拔，結果小苗全枯掉了，這是哪個成語？", explanation: "太心急反而把好事弄壞，就是「拔苗助長」喔！" },
    { id: "lp-12", illustrationKey: "dynamic-pic", icon: "🗡️🛡️", answer: "自相矛盾", options: ["自相矛盾", "一箭雙雕", "對牛彈琴", "狐假虎威"], prompt: "老闆一下說盾牌刺不破，一下又說長矛什麼都能刺穿，話全都打架了，這是哪個成語？", explanation: "自己說的話前後互相衝突，就是「自相矛盾」喔！" },
    { id: "lp-13", illustrationKey: "dynamic-pic", icon: "🍐👧👦", answer: "孔融讓梨", options: ["孔融讓梨", "雪中送炭", "望梅止渴", "鐵杵磨針"], prompt: "小孔融把大顆香甜的水梨讓給哥哥和弟弟，自己挑最小的一顆吃，這是哪個成語？", explanation: "懂得禮讓和分享給家人，就是「孔融讓梨」喔！" },
    { id: "lp-14", illustrationKey: "dynamic-pic", icon: "🪡🪨", answer: "鐵杵磨針", options: ["鐵杵磨針", "滴水穿石", "笨鳥先飛", "亡羊補牢"], prompt: "老奶奶拿著一根粗粗的大鐵棒，在石頭上不停地磨呀磨，想磨成細細的繡花針，這是哪個成語？", explanation: "只要天天用心練習不放棄，就能「鐵杵磨針」喔！" },
    { id: "lp-15", illustrationKey: "dynamic-pic", icon: "⛰️⛏️", answer: "愚公移山", options: ["愚公移山", "精衛填海", "守株待兔", "老馬識途"], prompt: "老爺爺帶著全家人拿著小鋤頭，每天把門前兩座大山的石頭一點一點挖走，這是哪個成語？", explanation: "有毅力堅持到底就能克服困難，就是「愚公移山」喔！" },
    { id: "lp-16", illustrationKey: "dynamic-pic", icon: "🐦🪨", answer: "精衛填海", options: ["精衛填海", "愚公移山", "驚弓之鳥", "鳥語花香"], prompt: "勇敢的小花鳥每天叼著小石頭和小樹枝，一趟一趟飛去填大海，這是哪個成語？", explanation: "下定決心絕不放棄的精神，就是「精衛填海」喔！" },
    { id: "lp-17", illustrationKey: "dynamic-pic", icon: "⛵⚔️", answer: "刻舟求劍", options: ["刻舟求劍", "一帆風順", "水落石出", "畫餅充飢"], prompt: "寶劍掉進河裡後，他只在移動的船邊刻記號，等船靠岸才下水找，這是哪個成語？", explanation: "事情變了卻不懂變通，就是「刻舟求劍」喔！" },
    { id: "lp-18", illustrationKey: "dynamic-pic", icon: "❄️🔥", answer: "雪中送炭", options: ["雪中送炭", "冰天雪地", "錦上添花", "春暖花開"], prompt: "下大雪好冷的時候，有人主動送來溫暖的木炭幫助大家取暖，這是哪個成語？", explanation: "在別人最需要幫忙時送上溫暖，就是「雪中送炭」喔！" },
    { id: "lp-19", illustrationKey: "dynamic-pic", icon: "💧🪨", answer: "滴水穿石", options: ["滴水穿石", "水落石出", "鐵杵磨針", "一清二楚"], prompt: "小小水滴每天滴答滴答落在同一個地方，久了竟然把大石頭滴出一個洞，這是哪個成語？", explanation: "每天堅持一點點就會有大力量，就是「滴水穿石」喔！" },
    { id: "lp-20", illustrationKey: "dynamic-pic", icon: "🐟💧", answer: "如魚得水", options: ["如魚得水", "井底之蛙", "魚躍龍門", "畫蛇添足"], prompt: "小魚回到清涼的水裡游來游去好開心好自在，這是哪一個成語呢？", explanation: "到了最適合自己、最開心自在的地方，就是「如魚得水」喔！" },
    { id: "lp-21", illustrationKey: "dynamic-pic", icon: "🐦🚀", answer: "笨鳥先飛", options: ["笨鳥先飛", "驚弓之鳥", "鶴立雞群", "一飛沖天"], prompt: "覺得自己飛得慢的小鳥，天還沒亮就先早早起飛練習，這是哪個成語？", explanation: "提早出發、比別人更早努力準備，就是「笨鳥先飛」喔！" },
    { id: "lp-22", illustrationKey: "dynamic-pic", icon: "🍑💧", answer: "望梅止渴", options: ["望梅止渴", "畫餅充飢", "青梅竹馬", "心花怒放"], prompt: "大熱天好口渴，一想到前面有又酸又甜的大梅子，嘴巴就流出好多口水，這是哪個成語？", explanation: "用美好的想像來鼓勵自己、解解渴，就是「望梅止渴」喔！" },
    { id: "lp-23", illustrationKey: "dynamic-pic", icon: "🥞🖍️", answer: "畫餅充飢", options: ["畫餅充飢", "望梅止渴", "狼吞虎嚥", "津津有味"], prompt: "肚子咕嚕叫好餓，卻只在地上畫一個圓圓的大燒餅看著發呆，這是哪個成語？", explanation: "光想不做無法解決問題，就是「畫餅充飢」喔！" },
    { id: "lp-24", illustrationKey: "dynamic-pic", icon: "🎋🎨", answer: "胸有成竹", options: ["胸有成竹", "畫龍點睛", "歲寒三友", "竹報平安"], prompt: "畫家每天細心看竹子，還沒動筆心裡早就清楚竹子的樣子、超有把握，這是哪個成語？", explanation: "事前準備得非常充分有自信，就是「胸有成竹」喔！" },
    { id: "lp-25", illustrationKey: "dynamic-pic", icon: "🐴🧭", answer: "老馬識途", options: ["老馬識途", "馬到成功", "塞翁失馬", "車水馬龍"], prompt: "大家在雪地裡迷路了，經驗豐富的老馬穩穩走在前面帶大家回家，這是哪個成語？", explanation: "很有經驗能幫大家找到正確方向，就是「老馬識途」喔！" },
    { id: "lp-26", illustrationKey: "dynamic-pic", icon: "🏹🦅", answer: "一箭雙雕", options: ["一箭雙雕", "驚弓之鳥", "百發百中", "一舉兩得"], prompt: "神射手拉開弓箭咻一聲，只用一支箭就同時射中兩隻大雕，這是哪個成語？", explanation: "做一件事同時得到兩種好收穫，就是「一箭雙雕」喔！" },
    { id: "lp-27", illustrationKey: "dynamic-pic", icon: "🦩✨", answer: "鶴立雞群", options: ["鶴立雞群", "雞飛狗跳", "聞雞起舞", "鳥語花香"], prompt: "高高瘦瘦的仙鶴站在一群小雞中間，看起來特別亮眼突出，這是哪個成語？", explanation: "表現特別優秀突出，就像「鶴立雞群」喔！" },
    { id: "lp-28", illustrationKey: "dynamic-pic", icon: "🐺🐯", answer: "狼吞虎嚥", options: ["狼吞虎嚥", "生龍活虎", "馬馬虎虎", "狐假虎威"], prompt: "肚子餓壞了，吃飯像大野狼和老虎一樣又急又大口，這是哪個成語？", explanation: "吃東西吃得又快又大口，就是「狼吞虎嚥」喔！" },
    { id: "lp-29", illustrationKey: "dynamic-pic", icon: "💖🌸", answer: "心花怒放", options: ["心花怒放", "花好月圓", "五顏六色", "鳥語花香"], prompt: "收到好朋友送的生日卡片，心裡開心到像美麗的花朵全都盛開了一樣，這是哪個成語？", explanation: "形容開心快樂到極點，就是「心花怒放」喔！" },
    { id: "lp-30", illustrationKey: "dynamic-pic", icon: "☀️🌬️", answer: "風和日麗", options: ["風和日麗", "冰天雪地", "雨過天青", "海闊天空"], prompt: "微風輕輕吹、太陽暖暖照，天氣好晴朗好適合去郊遊野餐，這是哪個成語？", explanation: "陽光溫和、微風舒服的好天氣，就是「風和日麗」喔！" },
    { id: "lp-31", illustrationKey: "dynamic-pic", icon: "🌈🌧️", answer: "雨過天青", options: ["雨過天青", "風和日麗", "春暖花開", "滴水穿石"], prompt: "剛下完一場大雨，烏雲散開後天空變得藍藍亮亮的還出現彩虹，這是哪個成語？", explanation: "大雨過後天空放晴、困難過去，就是「雨過天青」喔！" },
    { id: "lp-32", illustrationKey: "dynamic-pic", icon: "🐴🐯", answer: "馬馬虎虎", options: ["馬馬虎虎", "虎頭蛇尾", "龍馬精神", "老馬識途"], prompt: "寫作業隨便亂寫、不檢查也不認真，敷衍了事的樣子，這是哪個成語？", explanation: "做事隨隨便便不夠仔細，就是「馬馬虎虎」喔！" },
    { id: "lp-33", illustrationKey: "dynamic-pic", icon: "🐯🐍", answer: "虎頭蛇尾", options: ["虎頭蛇尾", "馬馬虎虎", "畫蛇添足", "生龍活虎"], prompt: "一開始很有精神像大老虎，做到後面卻懶洋洋隨便結束像小蛇尾巴，這是哪個成語？", explanation: "做事有開頭卻沒有好好完成，就是「虎頭蛇尾」喔！" },
    { id: "lp-34", illustrationKey: "dynamic-pic", icon: "🐉⚡", answer: "生龍活虎", options: ["生龍活虎", "虎頭蛇尾", "葉公好龍", "畫龍點睛"], prompt: "小朋友下課在操場上跑跑跳跳、精神滿滿超級有活力，這是哪個成語？", explanation: "形容非常有精神、活潑有朝氣，就是「生龍活虎」喔！" },
    { id: "lp-35", illustrationKey: "dynamic-pic", icon: "🐎🚗", answer: "車水馬龍", options: ["車水馬龍", "馬到成功", "人仰馬翻", "天馬行空"], prompt: "馬路上車子像流水、行人熱鬧極了，一片繁華的景象，這是哪個成語？", explanation: "形容街道上車子行人好多好熱鬧，就是「車水馬龍」喔！" },
    { id: "lp-36", illustrationKey: "dynamic-pic", icon: "🐴🏆", answer: "馬到成功", options: ["馬到成功", "塞翁失馬", "老馬識途", "龍馬精神"], prompt: "祝福同學參加比賽一上場就能順順利利拿冠軍，要用哪一個吉祥成語？", explanation: "祝福事情一開始就順利成功，就是「馬到成功」喔！" },
    { id: "lp-37", illustrationKey: "dynamic-pic", icon: "🦋✨", answer: "破繭而出", options: ["破繭而出", "作繭自縛", "飛蛾撲火", "鳥語花香"], prompt: "毛毛蟲努力鑽破硬硬的蛹，張開美麗的翅膀變成蝴蝶飛上天，這是哪個成語？", explanation: "克服困難長大進步，就是「破繭而出」喔！" },
    { id: "lp-38", illustrationKey: "dynamic-pic", icon: "🌺🌕", answer: "花好月圓", options: ["花好月圓", "心花怒放", "春暖花開", "鳥語花香"], prompt: "花朵開得美美的、月亮圓圓亮亮的，一家人幸福團圓的畫面，這是哪個成語？", explanation: "形容非常美好圓滿的團圓時光，就是「花好月圓」喔！" },
    { id: "lp-39", illustrationKey: "dynamic-pic", icon: "🎺😅", answer: "濫竽充數", options: ["濫竽充數", "對牛彈琴", "掩耳盜鈴", "畫餅充飢"], prompt: "完全不會吹樂器，卻混在大樂隊裡假裝鼓著嘴巴吹奏，這是哪個成語？", explanation: "沒有真本事卻混在大家裡面假裝，就是「濫竽充數」喔！" },
    { id: "lp-40", illustrationKey: "dynamic-pic", icon: "🦗🐦", answer: "螳螂捕蟬", options: ["螳螂捕蟬", "守株待兔", "狐假虎威", "井底之蛙"], prompt: "小螳螂只顧著往前抓知了，沒發現身後有隻黃雀正盯著牠，這是哪個成語？", explanation: "只顧眼前沒注意背後危險，就是「螳螂捕蟬」喔！" }
  ];

  return {
    ANIMATIONS_30,
    LOW_PIC_QUIZZES_40
  };
})();
