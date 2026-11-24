// ============================================================================
// 雙溪區上林國小・上林成語小鎮 - 單機直接開啟 (file://) 與離線備援引擎
// 內含 30 位上林國小真實學生名單、記憶體快取、七階 15 天晉升與班級無敵星星
// ============================================================================
window.IdiomLocalFallback = (function () {
  const DB_KEY = "idiom_cloud_local_db_v6";
  const SEED_DATA = {
    "schoolName":  "雙溪區上林國小",
    "seedReferenceDate":  "2026-11-23",
    "rankTiers":  [
                      {
                          "level":  1,
                          "id":  "rank_1",
                          "shortTitle":  "小童生",
                          "title":  "成語小童生",
                          "requiredDays":  15,
                          "icon":  "🌱",
                          "desc":  "初入成語書院，連續打卡滿 15 天！"
                      },
                      {
                          "level":  2,
                          "id":  "rank_2",
                          "shortTitle":  "小秀才",
                          "title":  "成語小秀才",
                          "requiredDays":  30,
                          "icon":  "📜",
                          "desc":  "文思漸進，連續打卡滿 30 天晉升！"
                      },
                      {
                          "level":  3,
                          "id":  "rank_3",
                          "shortTitle":  "小舉人",
                          "title":  "成語小舉人",
                          "requiredDays":  45,
                          "icon":  "🏮",
                          "desc":  "出口成章，連續打卡滿 45 天晉升！"
                      },
                      {
                          "level":  4,
                          "id":  "rank_4",
                          "shortTitle":  "小貢士",
                          "title":  "成語小貢士",
                          "requiredDays":  60,
                          "icon":  "🎖️",
                          "desc":  "博學多聞，連續打卡滿 60 天晉升！"
                      },
                      {
                          "level":  5,
                          "id":  "rank_5",
                          "shortTitle":  "小進士",
                          "title":  "成語小進士",
                          "requiredDays":  75,
                          "icon":  "👑",
                          "desc":  "語文菁英，連續打卡滿 75 天晉升！"
                      },
                      {
                          "level":  6,
                          "id":  "rank_6",
                          "shortTitle":  "小狀元",
                          "title":  "成語小狀元",
                          "requiredDays":  90,
                          "icon":  "🌟",
                          "desc":  "獨占鰲頭，連續打卡滿 90 天晉升！"
                      },
                      {
                          "level":  7,
                          "id":  "rank_7",
                          "shortTitle":  "大宗師",
                          "title":  "成語大宗師",
                          "requiredDays":  105,
                          "icon":  "🐉",
                          "desc":  "登峰造極，連續打卡滿 105 天最高殿堂！"
                      }
                  ],
    "classes":  [
                    {
                        "id":  "1年甲班",
                        "grade":  1,
                        "band":  "low",
                        "bandLabel":  "低年段",
                        "teacherName":  "一年甲班導師",
                        "leaderDays":  0,
                        "leaderAwardedToday":  false
                    },
                    {
                        "id":  "2年甲班",
                        "grade":  2,
                        "band":  "low",
                        "bandLabel":  "低年段",
                        "teacherName":  "二年甲班導師",
                        "leaderDays":  0,
                        "leaderAwardedToday":  false
                    },
                    {
                        "id":  "3年甲班",
                        "grade":  3,
                        "band":  "mid",
                        "bandLabel":  "中年段",
                        "teacherName":  "三年甲班導師",
                        "leaderDays":  0,
                        "leaderAwardedToday":  false
                    },
                    {
                        "id":  "4年甲班",
                        "grade":  4,
                        "band":  "mid",
                        "bandLabel":  "中年段",
                        "teacherName":  "四年甲班導師",
                        "leaderDays":  0,
                        "leaderAwardedToday":  false
                    },
                    {
                        "id":  "5年甲班",
                        "grade":  5,
                        "band":  "high",
                        "bandLabel":  "高年段",
                        "teacherName":  "五年甲班導師",
                        "leaderDays":  0,
                        "leaderAwardedToday":  false
                    },
                    {
                        "id":  "6年甲班",
                        "grade":  6,
                        "band":  "high",
                        "bandLabel":  "高年段",
                        "teacherName":  "六年甲班導師",
                        "leaderDays":  0,
                        "leaderAwardedToday":  false
                    }
                ],
    "staffAccounts":  [
                          {
                              "role":  "管理者校長",
                              "roleKey":  "principal",
                              "name":  "洪珮華校長",
                              "passcode":  "school2026",
                              "assignedClass":  "全校"
                          },
                          {
                              "role":  "管理者閱推教師",
                              "roleKey":  "reading_teacher",
                              "name":  "閱推教師",
                              "passcode":  "school2026",
                              "assignedClass":  "全校"
                          },
                          {
                              "role":  "管理者教務處主任",
                              "roleKey":  "academic_director",
                              "name":  "教務處主任",
                              "passcode":  "school2026",
                              "assignedClass":  "全校"
                          },
                          {
                              "role":  "管理者教學組長",
                              "roleKey":  "curriculum_chief",
                              "name":  "教學組長",
                              "passcode":  "school2026",
                              "assignedClass":  "全校"
                          },
                          {
                              "role":  "教師",
                              "roleKey":  "teacher",
                              "name":  "班級導師",
                              "passcode":  "school2026",
                              "assignedClass":  "1年甲班"
                          }
                      ],
    "curriculum":  {
                       "low":  {
                                   "title":  "低年級・每日 5 分鐘成語打卡",
                                   "subtitle":  "每天自動隨機派發不同成語：看 1 分鐘動畫、玩 2 題看圖配對、闖關 3 題數字成語就完成打卡！",
                                   "animations":  [

                                                  ],
                                   "pictureMatches":  [

                                                      ],
                                   "numberGames":  [

                                                   ]
                               },
                       "mid":  {
                                   "title":  "中年級・每日 5 分鐘成語打卡",
                                   "subtitle":  "每天自動隨機派發不同成語：完成 2 題生活對話選成語，再挑戰 3 題動植物成語小遊戲即可完成打卡！",
                                   "dialogues":  [

                                                 ],
                                   "natureGames":  [

                                                   ]
                               },
                       "high":  {
                                    "title":  "高年級・每日 5 分鐘成語打卡",
                                    "subtitle":  "切分為二個階段，每天每人隨機出題：第一階段「新聞抓漏王＋聽我說故事」，第二階段「微寫作接龍＋幫 2 位同學按愛心」！",
                                    "newsBugs":  [

                                                 ],
                                    "story":  null,
                                    "microWritingPrompt":  {
                                                               "idiom":  "破釜沉舟",
                                                               "altIdioms":  [
                                                                                 "迫不及待",
                                                                                 "再接再厲",
                                                                                 "按部就班"
                                                                             ],
                                                               "guide":  "請使用本日隨機配發的成語寫一句 10 字以上的創意生活造句，送出後再到下方幫 2 位同學的作品按愛心吧！"
                                                           }
                                }
                   },
    "students":  [
                     {
                         "id":  "stu-1a-01",
                         "classId":  "1年甲班",
                         "seatNo":  1,
                         "name":  "連兆玄",
                         "grade":  1,
                         "band":  "low",
                         "streakDays":  0,
                         "checkedInToday":  false,
                         "totalCheckIns":  0,
                         "badges":  [

                                    ],
                         "todayProgress":  {
                                               "animationDone":  false,
                                               "pictureMatchCount":  0,
                                               "numberGameCount":  0
                                           }
                     },
                     {
                         "id":  "stu-1a-03",
                         "classId":  "1年甲班",
                         "seatNo":  3,
                         "name":  "謝承恩",
                         "grade":  1,
                         "band":  "low",
                         "streakDays":  0,
                         "checkedInToday":  false,
                         "totalCheckIns":  0,
                         "badges":  [

                                    ],
                         "todayProgress":  {
                                               "animationDone":  false,
                                               "pictureMatchCount":  0,
                                               "numberGameCount":  0
                                           }
                     },
                     {
                         "id":  "stu-2a-01",
                         "classId":  "2年甲班",
                         "seatNo":  1,
                         "name":  "卓柏佑",
                         "grade":  2,
                         "band":  "low",
                         "streakDays":  0,
                         "checkedInToday":  false,
                         "totalCheckIns":  0,
                         "badges":  [

                                    ],
                         "todayProgress":  {
                                               "animationDone":  false,
                                               "pictureMatchCount":  0,
                                               "numberGameCount":  0
                                           }
                     },
                     {
                         "id":  "stu-2a-02",
                         "classId":  "2年甲班",
                         "seatNo":  2,
                         "name":  "藍晟彧",
                         "grade":  2,
                         "band":  "low",
                         "streakDays":  0,
                         "checkedInToday":  false,
                         "totalCheckIns":  0,
                         "badges":  [

                                    ],
                         "todayProgress":  {
                                               "animationDone":  false,
                                               "pictureMatchCount":  0,
                                               "numberGameCount":  0
                                           }
                     },
                     {
                         "id":  "stu-2a-03",
                         "classId":  "2年甲班",
                         "seatNo":  3,
                         "name":  "簡辰馨",
                         "grade":  2,
                         "band":  "low",
                         "streakDays":  0,
                         "checkedInToday":  false,
                         "totalCheckIns":  0,
                         "badges":  [

                                    ],
                         "todayProgress":  {
                                               "animationDone":  false,
                                               "pictureMatchCount":  0,
                                               "numberGameCount":  0
                                           }
                     },
                     {
                         "id":  "stu-2a-04",
                         "classId":  "2年甲班",
                         "seatNo":  4,
                         "name":  "游昊恩",
                         "grade":  2,
                         "band":  "low",
                         "streakDays":  0,
                         "checkedInToday":  false,
                         "totalCheckIns":  0,
                         "badges":  [

                                    ],
                         "todayProgress":  {
                                               "animationDone":  false,
                                               "pictureMatchCount":  0,
                                               "numberGameCount":  0
                                           }
                     },
                     {
                         "id":  "stu-2a-05",
                         "classId":  "2年甲班",
                         "seatNo":  5,
                         "name":  "林依錡",
                         "grade":  2,
                         "band":  "low",
                         "streakDays":  0,
                         "checkedInToday":  false,
                         "totalCheckIns":  0,
                         "badges":  [

                                    ],
                         "todayProgress":  {
                                               "animationDone":  false,
                                               "pictureMatchCount":  0,
                                               "numberGameCount":  0
                                           }
                     },
                     {
                         "id":  "stu-2a-06",
                         "classId":  "2年甲班",
                         "seatNo":  6,
                         "name":  "馮靖善",
                         "grade":  2,
                         "band":  "low",
                         "streakDays":  0,
                         "checkedInToday":  false,
                         "totalCheckIns":  0,
                         "badges":  [

                                    ],
                         "todayProgress":  {
                                               "animationDone":  false,
                                               "pictureMatchCount":  0,
                                               "numberGameCount":  0
                                           }
                     },
                     {
                         "id":  "stu-2a-07",
                         "classId":  "2年甲班",
                         "seatNo":  7,
                         "name":  "連怡捷",
                         "grade":  2,
                         "band":  "low",
                         "streakDays":  0,
                         "checkedInToday":  false,
                         "totalCheckIns":  0,
                         "badges":  [

                                    ],
                         "todayProgress":  {
                                               "animationDone":  false,
                                               "pictureMatchCount":  0,
                                               "numberGameCount":  0
                                           }
                     },
                     {
                         "id":  "stu-2a-08",
                         "classId":  "2年甲班",
                         "seatNo":  8,
                         "name":  "謝茗棋",
                         "grade":  2,
                         "band":  "low",
                         "streakDays":  0,
                         "checkedInToday":  false,
                         "totalCheckIns":  0,
                         "badges":  [

                                    ],
                         "todayProgress":  {
                                               "animationDone":  false,
                                               "pictureMatchCount":  0,
                                               "numberGameCount":  0
                                           }
                     },
                     {
                         "id":  "stu-3a-01",
                         "classId":  "3年甲班",
                         "seatNo":  1,
                         "name":  "張則宇",
                         "grade":  3,
                         "band":  "mid",
                         "streakDays":  0,
                         "checkedInToday":  false,
                         "totalCheckIns":  0,
                         "badges":  [

                                    ],
                         "todayProgress":  {
                                               "dialogueCount":  0,
                                               "natureGameCount":  0
                                           }
                     },
                     {
                         "id":  "stu-3a-02",
                         "classId":  "3年甲班",
                         "seatNo":  2,
                         "name":  "游心緹",
                         "grade":  3,
                         "band":  "mid",
                         "streakDays":  0,
                         "checkedInToday":  false,
                         "totalCheckIns":  0,
                         "badges":  [

                                    ],
                         "todayProgress":  {
                                               "dialogueCount":  0,
                                               "natureGameCount":  0
                                           }
                     },
                     {
                         "id":  "stu-3a-03",
                         "classId":  "3年甲班",
                         "seatNo":  3,
                         "name":  "施云禎",
                         "grade":  3,
                         "band":  "mid",
                         "streakDays":  0,
                         "checkedInToday":  false,
                         "totalCheckIns":  0,
                         "badges":  [

                                    ],
                         "todayProgress":  {
                                               "dialogueCount":  0,
                                               "natureGameCount":  0
                                           }
                     },
                     {
                         "id":  "stu-3a-04",
                         "classId":  "3年甲班",
                         "seatNo":  4,
                         "name":  "張玲云",
                         "grade":  3,
                         "band":  "mid",
                         "streakDays":  0,
                         "checkedInToday":  false,
                         "totalCheckIns":  0,
                         "badges":  [

                                    ],
                         "todayProgress":  {
                                               "dialogueCount":  0,
                                               "natureGameCount":  0
                                           }
                     },
                     {
                         "id":  "stu-4a-01",
                         "classId":  "4年甲班",
                         "seatNo":  1,
                         "name":  "張凱傑",
                         "grade":  4,
                         "band":  "mid",
                         "streakDays":  0,
                         "checkedInToday":  false,
                         "totalCheckIns":  0,
                         "badges":  [

                                    ],
                         "todayProgress":  {
                                               "dialogueCount":  0,
                                               "natureGameCount":  0
                                           }
                     },
                     {
                         "id":  "stu-4a-02",
                         "classId":  "4年甲班",
                         "seatNo":  2,
                         "name":  "王宥櫪",
                         "grade":  4,
                         "band":  "mid",
                         "streakDays":  0,
                         "checkedInToday":  false,
                         "totalCheckIns":  0,
                         "badges":  [

                                    ],
                         "todayProgress":  {
                                               "dialogueCount":  0,
                                               "natureGameCount":  0
                                           }
                     },
                     {
                         "id":  "stu-4a-03",
                         "classId":  "4年甲班",
                         "seatNo":  3,
                         "name":  "謝宇恩",
                         "grade":  4,
                         "band":  "mid",
                         "streakDays":  0,
                         "checkedInToday":  false,
                         "totalCheckIns":  0,
                         "badges":  [

                                    ],
                         "todayProgress":  {
                                               "dialogueCount":  0,
                                               "natureGameCount":  0
                                           }
                     },
                     {
                         "id":  "stu-4a-04",
                         "classId":  "4年甲班",
                         "seatNo":  4,
                         "name":  "卓柏妍",
                         "grade":  4,
                         "band":  "mid",
                         "streakDays":  0,
                         "checkedInToday":  false,
                         "totalCheckIns":  0,
                         "badges":  [

                                    ],
                         "todayProgress":  {
                                               "dialogueCount":  0,
                                               "natureGameCount":  0
                                           }
                     },
                     {
                         "id":  "stu-4a-05",
                         "classId":  "4年甲班",
                         "seatNo":  5,
                         "name":  "簡睿萱",
                         "grade":  4,
                         "band":  "mid",
                         "streakDays":  0,
                         "checkedInToday":  false,
                         "totalCheckIns":  0,
                         "badges":  [

                                    ],
                         "todayProgress":  {
                                               "dialogueCount":  0,
                                               "natureGameCount":  0
                                           }
                     },
                     {
                         "id":  "stu-4a-06",
                         "classId":  "4年甲班",
                         "seatNo":  6,
                         "name":  "詹紓瑤",
                         "grade":  4,
                         "band":  "mid",
                         "streakDays":  0,
                         "checkedInToday":  false,
                         "totalCheckIns":  0,
                         "badges":  [

                                    ],
                         "todayProgress":  {
                                               "dialogueCount":  0,
                                               "natureGameCount":  0
                                           }
                     },
                     {
                         "id":  "stu-5a-01",
                         "classId":  "5年甲班",
                         "seatNo":  1,
                         "name":  "謝忻甫",
                         "grade":  5,
                         "band":  "high",
                         "streakDays":  0,
                         "checkedInToday":  false,
                         "totalCheckIns":  0,
                         "badges":  [

                                    ],
                         "todayProgress":  {
                                               "newsBugCount":  0,
                                               "storyDone":  false,
                                               "writingDone":  false,
                                               "likesGivenCount":  0,
                                               "likedWritingIds":  [

                                                                   ]
                                           }
                     },
                     {
                         "id":  "stu-5a-02",
                         "classId":  "5年甲班",
                         "seatNo":  2,
                         "name":  "詹至璿",
                         "grade":  5,
                         "band":  "high",
                         "streakDays":  0,
                         "checkedInToday":  false,
                         "totalCheckIns":  0,
                         "badges":  [

                                    ],
                         "todayProgress":  {
                                               "newsBugCount":  0,
                                               "storyDone":  false,
                                               "writingDone":  false,
                                               "likesGivenCount":  0,
                                               "likedWritingIds":  [

                                                                   ]
                                           }
                     },
                     {
                         "id":  "stu-5a-03",
                         "classId":  "5年甲班",
                         "seatNo":  3,
                         "name":  "藍右恩",
                         "grade":  5,
                         "band":  "high",
                         "streakDays":  0,
                         "checkedInToday":  false,
                         "totalCheckIns":  0,
                         "badges":  [

                                    ],
                         "todayProgress":  {
                                               "newsBugCount":  0,
                                               "storyDone":  false,
                                               "writingDone":  false,
                                               "likesGivenCount":  0,
                                               "likedWritingIds":  [

                                                                   ]
                                           }
                     },
                     {
                         "id":  "stu-5a-04",
                         "classId":  "5年甲班",
                         "seatNo":  4,
                         "name":  "施瑜柔",
                         "grade":  5,
                         "band":  "high",
                         "streakDays":  0,
                         "checkedInToday":  false,
                         "totalCheckIns":  0,
                         "badges":  [

                                    ],
                         "todayProgress":  {
                                               "newsBugCount":  0,
                                               "storyDone":  false,
                                               "writingDone":  false,
                                               "likesGivenCount":  0,
                                               "likedWritingIds":  [

                                                                   ]
                                           }
                     },
                     {
                         "id":  "stu-5a-07",
                         "classId":  "5年甲班",
                         "seatNo":  7,
                         "name":  "藍民宇",
                         "grade":  5,
                         "band":  "high",
                         "streakDays":  0,
                         "checkedInToday":  false,
                         "totalCheckIns":  0,
                         "badges":  [

                                    ],
                         "todayProgress":  {
                                               "newsBugCount":  0,
                                               "storyDone":  false,
                                               "writingDone":  false,
                                               "likesGivenCount":  0,
                                               "likedWritingIds":  [

                                                                   ]
                                           }
                     },
                     {
                         "id":  "stu-6a-01",
                         "classId":  "6年甲班",
                         "seatNo":  1,
                         "name":  "林思妤",
                         "grade":  6,
                         "band":  "high",
                         "streakDays":  0,
                         "checkedInToday":  false,
                         "totalCheckIns":  0,
                         "badges":  [

                                    ],
                         "todayProgress":  {
                                               "newsBugCount":  0,
                                               "storyDone":  false,
                                               "writingDone":  false,
                                               "likesGivenCount":  0,
                                               "likedWritingIds":  [

                                                                   ]
                                           }
                     },
                     {
                         "id":  "stu-6a-02",
                         "classId":  "6年甲班",
                         "seatNo":  2,
                         "name":  "呂紹暘",
                         "grade":  6,
                         "band":  "high",
                         "streakDays":  0,
                         "checkedInToday":  false,
                         "totalCheckIns":  0,
                         "badges":  [

                                    ],
                         "todayProgress":  {
                                               "newsBugCount":  0,
                                               "storyDone":  false,
                                               "writingDone":  false,
                                               "likesGivenCount":  0,
                                               "likedWritingIds":  [

                                                                   ]
                                           }
                     },
                     {
                         "id":  "stu-6a-03",
                         "classId":  "6年甲班",
                         "seatNo":  3,
                         "name":  "藍右崴",
                         "grade":  6,
                         "band":  "high",
                         "streakDays":  0,
                         "checkedInToday":  false,
                         "totalCheckIns":  0,
                         "badges":  [

                                    ],
                         "todayProgress":  {
                                               "newsBugCount":  0,
                                               "storyDone":  false,
                                               "writingDone":  false,
                                               "likesGivenCount":  0,
                                               "likedWritingIds":  [

                                                                   ]
                                           }
                     },
                     {
                         "id":  "stu-6a-04",
                         "classId":  "6年甲班",
                         "seatNo":  4,
                         "name":  "簡浚傑",
                         "grade":  6,
                         "band":  "high",
                         "streakDays":  0,
                         "checkedInToday":  false,
                         "totalCheckIns":  0,
                         "badges":  [

                                    ],
                         "todayProgress":  {
                                               "newsBugCount":  0,
                                               "storyDone":  false,
                                               "writingDone":  false,
                                               "likesGivenCount":  0,
                                               "likedWritingIds":  [

                                                                   ]
                                           }
                     },
                     {
                         "id":  "stu-6a-05",
                         "classId":  "6年甲班",
                         "seatNo":  5,
                         "name":  "林子權",
                         "grade":  6,
                         "band":  "high",
                         "streakDays":  0,
                         "checkedInToday":  false,
                         "totalCheckIns":  0,
                         "badges":  [

                                    ],
                         "todayProgress":  {
                                               "newsBugCount":  0,
                                               "storyDone":  false,
                                               "writingDone":  false,
                                               "likesGivenCount":  0,
                                               "likedWritingIds":  [

                                                                   ]
                                           }
                     }
                 ],
    "writings":  [

                 ],
    "liveFeed":  [

                 ]
};
  const RANK_TIERS = [
    { level: 1, id: "rank_1", shortTitle: "小童生", title: "成語小童生", requiredDays: 15, icon: "🌱" },
    { level: 2, id: "rank_2", shortTitle: "小秀才", title: "成語小秀才", requiredDays: 30, icon: "📜" },
    { level: 3, id: "rank_3", shortTitle: "小舉人", title: "成語小舉人", requiredDays: 45, icon: "🏮" },
    { level: 4, id: "rank_4", shortTitle: "小貢士", title: "成語小貢士", requiredDays: 60, icon: "🎖️" },
    { level: 5, id: "rank_5", shortTitle: "小進士", title: "成語小進士", requiredDays: 75, icon: "👑" },
    { level: 6, id: "rank_6", shortTitle: "小狀元", title: "成語小狀元", requiredDays: 90, icon: "🌟" },
    { level: 7, id: "rank_7", shortTitle: "大宗師", title: "成語大宗師", requiredDays: 105, icon: "🐉" }
  ];

  let memDb = null;

  function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  function loadDb() {
    if (memDb) return memDb;
    try {
      const raw = localStorage.getItem(DB_KEY);
      if (raw) {
        memDb = JSON.parse(raw);
        return memDb;
      }
    } catch {}
    memDb = clone(SEED_DATA);
    memDb.sessions = [];
    saveDb(memDb);
    return memDb;
  }

  function saveDb(db) {
    memDb = db;
    try {
      localStorage.setItem(DB_KEY, JSON.stringify(db));
    } catch {}
  }

  function nowTime() {
    const d = new Date();
    return String(d.getHours()).padStart(2, "0") + ":" + String(d.getMinutes()).padStart(2, "0");
  }

  function todayStr() {
    const d = new Date();
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  }

  function getRankTitle(days) {
    let best = "";
    RANK_TIERS.forEach((t) => {
      if (Number(days || 0) >= t.requiredDays) best = t.title;
    });
    return best;
  }

  function normalizeClassId(raw) {
    let s = String(raw || "").replace(/\s+/g, "").trim();
    if (!s) return "1年甲班";
    const map = { "一":"1","二":"2","三":"3","四":"4","五":"5","六":"6","七":"7","八":"8","九":"9","零":"0","１":"1","２":"2","３":"3","４":"4","５":"5","６":"6","７":"7","８":"8","９":"9","０":"0" };
    Object.keys(map).forEach((k) => { s = s.split(k).join(map[k]); });
    const m0 = s.match(/^([1-6])年?([甲乙丙丁戊])班?$/);
    if (m0) return `${m0[1]}年${m0[2]}班`;
    const m1 = s.match(/^([1-6])年?([0-9]{1,2})班?$/);
    if (m1) return `${Number(m1[1])}年${Number(m1[2])}班`;
    const m2 = s.match(/^([1-6])0([1-9])$/);
    if (m2) return `${m2[1]}年${m2[2]}班`;
    return s;
  }

  function getGrade(classId) {
    const m = String(classId).match(/([1-6])/);
    return m ? Number(m[1]) : 1;
  }

  function getBand(grade) {
    if (grade <= 2) return "low";
    if (grade <= 4) return "mid";
    return "high";
  }

  function getBandLabel(band) {
    return band === "low" ? "低年段" : band === "mid" ? "中年段" : "高年段";
  }

  function defaultProgress(band) {
    if (band === "low") return { animationDone: false, pictureMatchCount: 0, numberGameCount: 0 };
    if (band === "mid") return { dialogueCount: 0, natureGameCount: 0 };
    return { newsBugCount: 0, storyDone: false, writingDone: false, likesGivenCount: 0, likedWritingIds: [] };
  }

  function computeClassStats(db) {
    return (db.classes || []).map((cls) => {
      const list = (db.students || []).filter((s) => s.classId === cls.id);
      const total = list.length;
      const checked = list.filter((s) => s.checkedInToday).length;
      const rate = total > 0 ? Math.round((checked / total) * 100) : 0;
      const scholarCount = list.filter((s) => Number(s.streakDays || 0) >= 15).length;
      const isLeaderClass = total > 0 && rate >= 90;
      const leaderDays = Number(cls.leaderDays !== undefined ? cls.leaderDays : (isLeaderClass ? 1 : 0));
      const invincibleStars = Math.floor(leaderDays / 15);
      const starProgress = leaderDays % 15;
      return {
        classId: cls.id,
        grade: cls.grade,
        band: cls.band,
        bandLabel: cls.bandLabel,
        teacherName: cls.teacherName,
        totalStudents: total,
        checkedInCount: checked,
        checkInRate: rate,
        isLeaderClass,
        scholarCount,
        leaderDays,
        invincibleStars,
        starProgress
      };
    });
  }

  function addEvent(db, type, text) {
    db.liveFeed = db.liveFeed || [];
    db.liveFeed.unshift({ id: "evt-" + Math.random().toString(36).slice(2, 9), time: nowTime(), type, text });
    if (db.liveFeed.length > 25) db.liveFeed = db.liveFeed.slice(0, 25);
  }

  function evaluateCompletion(db, student) {
    let newlyCheckedIn = false;
    let newlyEarnedScholar = false;
    let newlyEarnedClassAward = false;
    const p = student.todayProgress || {};
    let done = false;
    if (student.band === "low") {
      done = Boolean(p.animationDone) && Number(p.pictureMatchCount || 0) >= 2 && Number(p.numberGameCount || 0) >= 3;
    } else if (student.band === "mid") {
      done = Number(p.dialogueCount || 0) >= 2 && Number(p.natureGameCount || 0) >= 3;
    } else {
      done = Number(p.newsBugCount || 0) >= 2 && Boolean(p.storyDone) && Boolean(p.writingDone) && Number(p.likesGivenCount || 0) >= 2;
    }

    if (done && !student.checkedInToday) {
      const clsStudents = db.students.filter((s) => s.classId === student.classId);
      const total = clsStudents.length;
      const beforeChecked = clsStudents.filter((s) => s.checkedInToday).length;
      const beforeRate = total > 0 ? Math.round((beforeChecked / total) * 100) : 0;

      student.checkedInToday = true;
      student.streakDays = Number(student.streakDays || 0) + 1;
      student.totalCheckIns = Number(student.totalCheckIns || 0) + 1;
      newlyCheckedIn = true;

      addEvent(db, "checkin", `✨ ${student.classId} ${student.name} 完成了今日 5 分鐘成語打卡！（連續 ${student.streakDays} 天）`);

      student.badges = student.badges || [];
      let unlockedTier = null;
      RANK_TIERS.forEach((tier) => {
        if (student.streakDays >= tier.requiredDays && !student.badges.includes(tier.id)) {
          student.badges.push(tier.id);
          unlockedTier = tier;
        }
      });
      if (unlockedTier) {
        newlyEarnedScholar = true;
        addEvent(db, "badge", `${unlockedTier.icon} 恭喜 ${student.classId} ${student.name} 連續打卡滿 ${student.streakDays} 天，晉升第 ${unlockedTier.level} 階「${unlockedTier.title}」！`);
      }

      const afterRate = total > 0 ? Math.round(((beforeChecked + 1) / total) * 100) : 0;
      if (beforeRate < 90 && afterRate >= 90) {
        newlyEarnedClassAward = true;
        const clsObj = (db.classes || []).find((c) => c.id === student.classId);
        let starMsg = "";
        if (clsObj && !clsObj.leaderAwardedToday) {
          clsObj.leaderDays = Number(clsObj.leaderDays || 0) + 1;
          clsObj.leaderAwardedToday = true;
          if (clsObj.leaderDays % 15 === 0) {
            const starsNow = Math.floor(clsObj.leaderDays / 15);
            starMsg = `，並累計達標 ${clsObj.leaderDays} 日，榮獲第 ${starsNow} 顆「無敵星星 ⭐」！`;
          }
        }
        addEvent(db, "class_award", `🏆 賀！${student.classId} 今日打卡率突破 ${afterRate}%，榮獲「數位語文領航班」獎${starMsg}`);
      }
    }
    return { newlyCheckedIn, newlyEarnedScholar, newlyEarnedClassAward };
  }

  function findSession(db, token) {
    return (db.sessions || []).find((s) => s.token === token) || null;
  }

  function parsePath(rawPath) {
    const [pathOnly, qs] = rawPath.split("?");
    const query = {};
    if (qs) {
      qs.split("&").forEach((pair) => {
        const [k, v] = pair.split("=");
        if (k) query[decodeURIComponent(k)] = decodeURIComponent((v || "").replace(/\+/g, " "));
      });
    }
    return { pathOnly, query };
  }

  function buildCsvDataUrl(classId = "全校") {
    const db = loadDb();
    let list = db.students || [];
    if (classId && classId !== "全校") list = list.filter((s) => s.classId === classId);
    const lines = ["班級,座號,姓名,年段,今日是否打卡,連續打卡天數,累計打卡次數,目前榮譽稱號"];
    list.forEach((st) => {
      const checked = st.checkedInToday ? "已完成" : "未打卡";
      const rankTitle = getRankTitle(st.streakDays) || `挑戰成語小童生(${st.streakDays}/15)`;
      lines.push(`${st.classId},${st.seatNo},${st.name},${getBandLabel(st.band)},${checked},${st.streakDays},${st.totalCheckIns},${rankTitle}`);
    });
    return "data:text/csv;charset=utf-8,\uFEFF" + encodeURIComponent(lines.join("\r\n"));
  }

  async function handle(rawPath, options = {}, token = "") {
    const { pathOnly, query } = parsePath(rawPath);
    const method = (options.method || "GET").toUpperCase();
    const body = options.body || {};
    const db = loadDb();

    if (pathOnly === "/api/health") {
      return { ok: true, app: "雙溪區上林國小・上林成語小鎮", date: todayStr(), time: nowTime(), lanUrl: "請執行 start-server.bat 開啟全校區網連線" };
    }

    if (pathOnly === "/api/roster") {
      const roster = (db.students || [])
        .slice()
        .sort((a, b) => (a.grade !== b.grade ? a.grade - b.grade : a.seatNo - b.seatNo))
        .map((s) => ({ id: s.id, classId: s.classId, grade: s.grade, seatNo: s.seatNo, name: s.name, band: s.band }));
      return { ok: true, classes: clone(db.classes || []), students: roster };
    }

    if (pathOnly === "/api/auth/student" && method === "POST") {
      const classId = normalizeClassId(body.classId);
      const seatNo = Number(body.seatNo);
      const name = String(body.name || "").trim();
      if (!classId || !seatNo || !name) throw new Error("請選擇班級與自己的名字喔！");

      const grade = getGrade(classId);
      const band = getBand(grade);
      if (!db.classes.some((c) => c.id === classId)) {
        db.classes.push({ id: classId, grade, band, bandLabel: getBandLabel(band), teacherName: classId + "導師", leaderDays: 0, leaderAwardedToday: false });
      }
      let student = db.students.find((s) => s.classId === classId && Number(s.seatNo) === seatNo && s.name === name);
      let isNew = false;
      if (!student) {
        isNew = true;
        student = {
          id: "stu-" + Math.random().toString(36).slice(2, 10),
          classId, seatNo, name, grade, band,
          streakDays: 0, checkedInToday: false, totalCheckIns: 0, badges: [],
          todayProgress: defaultProgress(band)
        };
        db.students.push(student);
        addEvent(db, "join", `🌟 歡迎新同學 ${classId} ${seatNo}號 ${name} 加入上林成語小鎮！`);
      }
      const newToken = "stu_" + Math.random().toString(36).slice(2) + Date.now().toString(36);
      db.sessions = (db.sessions || []).slice(0, 50);
      db.sessions.unshift({ token: newToken, userType: "student", studentId: student.id });
      saveDb(db);
      const classStat = computeClassStats(db).find((c) => c.classId === student.classId);
      return { ok: true, token: newToken, isNew, userType: "student", student: clone(student), classStat };
    }

    if (pathOnly === "/api/auth/staff" && method === "POST") {
      const role = String(body.role || "").trim();
      const name = String(body.name || "").trim();
      const passcode = String(body.passcode || "").trim();
      const allowed = ["管理者校長", "管理者閱推教師", "管理者教務處主任", "管理者教學組長", "教師"];
      if (!allowed.includes(role)) throw new Error("請選擇有效的教師或管理者身分。");
      if (!name) throw new Error("請輸入您的姓名。");
      if (!["school2026", "1234", "admin"].includes(passcode)) throw new Error("校內通行碼錯誤（提示：預設通行碼為 school2026）。");
      const staff = { role, name, assignedClass: role === "教師" ? (body.assignedClass || "1年甲班") : "全校" };
      const newToken = "stf_" + Math.random().toString(36).slice(2) + Date.now().toString(36);
      db.sessions = (db.sessions || []).slice(0, 50);
      db.sessions.unshift({ token: newToken, userType: "staff", staff });
      saveDb(db);
      return { ok: true, token: newToken, userType: "staff", staff };
    }

    if (pathOnly === "/api/auth/me") {
      const sess = findSession(db, token);
      if (!sess) throw new Error("請重新登入");
      if (sess.userType === "student") {
        const student = db.students.find((s) => s.id === sess.studentId);
        if (!student) throw new Error("找不到學生資料");
        const classStat = computeClassStats(db).find((c) => c.classId === student.classId);
        return { ok: true, userType: "student", student: clone(student), classStat };
      }
      return { ok: true, userType: "staff", staff: sess.staff };
    }

    if (pathOnly === "/api/tasks/daily") {
      const band = query.band || "low";
      return { ok: true, band, date: todayStr(), curriculum: clone(db.curriculum[band] || db.curriculum.low) };
    }

    if (pathOnly === "/api/tasks/progress" && method === "POST") {
      const sess = findSession(db, token);
      if (!sess || sess.userType !== "student") throw new Error("需要學生登入權限");
      const student = db.students.find((s) => s.id === sess.studentId);
      const p = student.todayProgress;
      if (student.band === "low") {
        if (body.animationDone !== undefined) p.animationDone = Boolean(body.animationDone);
        if (body.pictureMatchCount !== undefined) p.pictureMatchCount = Math.max(Number(p.pictureMatchCount || 0), Number(body.pictureMatchCount));
        if (body.numberGameCount !== undefined) p.numberGameCount = Math.max(Number(p.numberGameCount || 0), Number(body.numberGameCount));
      } else if (student.band === "mid") {
        if (body.dialogueCount !== undefined) p.dialogueCount = Math.max(Number(p.dialogueCount || 0), Number(body.dialogueCount));
        if (body.natureGameCount !== undefined) p.natureGameCount = Math.max(Number(p.natureGameCount || 0), Number(body.natureGameCount));
      } else {
        if (body.newsBugCount !== undefined) p.newsBugCount = Math.max(Number(p.newsBugCount || 0), Number(body.newsBugCount));
        if (body.storyDone !== undefined) p.storyDone = Boolean(body.storyDone);
      }
      const ev = evaluateCompletion(db, student);
      saveDb(db);
      const classStat = computeClassStats(db).find((c) => c.classId === student.classId);
      return Object.assign({ ok: true, student: clone(student), classStat }, ev);
    }

    if (pathOnly === "/api/writings" && method === "GET") {
      let list = db.writings || [];
      if (query.classId && query.classId !== "全校") list = list.filter((w) => w.classId === query.classId);
      return { ok: true, writings: clone(list) };
    }

    if (pathOnly === "/api/writings" && method === "POST") {
      const sess = findSession(db, token);
      if (!sess || sess.userType !== "student") throw new Error("請先以學生身分登入");
      const student = db.students.find((s) => s.id === sess.studentId);
      const content = String(body.content || "").trim();
      if (content.length < 10) throw new Error("造句內容請至少寫 10 個字喔！");
      const w = {
        id: "w-" + Math.random().toString(36).slice(2, 9),
        studentId: student.id, classId: student.classId, seatNo: student.seatNo, studentName: student.name,
        idiom: body.idiom || "破釜沉舟", content, likes: 0, likedBy: [], featured: false, featuredBy: "", createdAt: nowTime()
      };
      db.writings.unshift(w);
      if (student.band === "high") student.todayProgress.writingDone = true;
      addEvent(db, "writing", `✍️ ${student.classId} ${student.name} 在微寫作接龍發表了「${w.idiom}」造句！`);
      const ev = evaluateCompletion(db, student);
      saveDb(db);
      const classStat = computeClassStats(db).find((c) => c.classId === student.classId);
      return Object.assign({ ok: true, writing: w, student: clone(student), classStat }, ev);
    }

    if (pathOnly === "/api/writings/like" && method === "POST") {
      const sess = findSession(db, token);
      if (!sess || sess.userType !== "student") throw new Error("請先以學生身分登入");
      const student = db.students.find((s) => s.id === sess.studentId);
      const w = db.writings.find((item) => item.id === body.writingId);
      if (!w) throw new Error("找不到該篇作品");
      if (w.studentId === student.id) throw new Error("把愛心送給其他同學吧！幫 2 位同學按愛心即可完成任務喔！");
      w.likedBy = w.likedBy || [];
      if (!w.likedBy.includes(student.id)) {
        w.likedBy.push(student.id);
        w.likes = w.likedBy.length;
        if (student.band === "high") {
          student.todayProgress.likedWritingIds = student.todayProgress.likedWritingIds || [];
          if (!student.todayProgress.likedWritingIds.includes(w.id)) student.todayProgress.likedWritingIds.push(w.id);
          student.todayProgress.likesGivenCount = student.todayProgress.likedWritingIds.length;
        }
      }
      const ev = evaluateCompletion(db, student);
      saveDb(db);
      const classStat = computeClassStats(db).find((c) => c.classId === student.classId);
      return Object.assign({ ok: true, writing: w, student: clone(student), classStat }, ev);
    }

    if (pathOnly === "/api/writings/feature" && method === "POST") {
      const sess = findSession(db, token);
      if (!sess || sess.userType !== "staff") throw new Error("僅限教師或管理者操作");
      const w = db.writings.find((item) => item.id === body.writingId);
      if (!w) throw new Error("找不到該篇作品");
      w.featured = !w.featured;
      w.featuredBy = w.featured ? `${sess.staff.role}・${sess.staff.name}` : "";
      saveDb(db);
      return { ok: true, writing: w };
    }

    if (pathOnly === "/api/live/school") {
      const classes = computeClassStats(db);
      const totalStudents = db.students.length;
      const checkedToday = db.students.filter((s) => s.checkedInToday).length;
      const schoolRate = totalStudents > 0 ? Math.round((checkedToday / totalStudents) * 100) : 0;
      const leaderClasses = classes.filter((c) => c.isLeaderClass);
      const allTitled = db.students.filter((s) => Number(s.streakDays || 0) >= 15);
      const scholars = [...allTitled].sort((a, b) => b.streakDays - a.streakDays).slice(0, 12);
      return {
        ok: true, schoolName: db.schoolName, date: todayStr(), serverTime: nowTime(), onlineCount: 1,
        lanUrl: "單機模式（雙擊 start-server.bat 開啟全校連線）",
        summary: { totalStudents, checkedInToday: checkedToday, schoolRate, leaderClassCount: leaderClasses.length, totalClasses: classes.length, scholarCount: allTitled.length },
        classes, leaderClasses, scholars, liveFeed: (db.liveFeed || []).slice(0, 15)
      };
    }

    if (pathOnly === "/api/admin/overview") {
      const sess = findSession(db, token);
      if (!sess || sess.userType !== "staff") throw new Error("僅限教師或管理者存取");
      const classes = computeClassStats(db);
      let students = db.students;
      if (query.classId && query.classId !== "全校") students = students.filter((s) => s.classId === query.classId);
      return {
        ok: true, staff: sess.staff, schoolName: db.schoolName, date: todayStr(),
        lanUrl: "單機模式（執行 start-server.bat 開啟區網同步）",
        classes, students: clone(students), writings: clone(db.writings), newsBugs: clone(db.curriculum.high.newsBugs)
      };
    }

    if (pathOnly === "/api/admin/curriculum/news" && method === "POST") {
      const sess = findSession(db, token);
      if (!sess || sess.userType !== "staff") throw new Error("僅限教師或管理者新增題庫");
      if (!body.headline || !body.wrongSegment || !body.correctSegment) throw new Error("請填寫完整題目欄位！");
      if (!body.headline.includes(body.wrongSegment)) throw new Error("新聞標題內必須包含所填寫的錯誤成語喔！");
      const item = {
        id: "news-" + Math.random().toString(36).slice(2, 8),
        category: body.category || "師長精選特報",
        headline: body.headline, wrongSegment: body.wrongSegment, correctSegment: body.correctSegment,
        options: Array.from(new Set([body.correctSegment, body.wrongSegment, "按部就班", "迫不及待"])),
        explanation: body.explanation || `正確寫法為「${body.correctSegment}」。`
      };
      db.curriculum.high.newsBugs.unshift(item);
      saveDb(db);
      return { ok: true, item };
    }

    if (pathOnly === "/api/admin/reset-demo" && method === "POST") {
      const fresh = clone(SEED_DATA);
      fresh.sessions = db.sessions || [];
      saveDb(fresh);
      return { ok: true };
    }

    throw new Error("未知的請求路徑：" + pathOnly);
  }

  return { handle, buildCsvDataUrl };
})();