import type {
  ContentPack,
  Difficulty,
  InteractiveTrainingModuleId,
} from "@/types/training";

export const contentPacks: ContentPack[] = [
  {
    id: "preflop-position-basics",
    moduleId: "preflop",
    title: "Nền tảng vị trí Preflop",
    focusLabel: "Open theo vị trí",
    summary:
      "Xây thói quen open đúng hand từ đúng vị trí trước khi thêm các nhánh preflop khó hơn.",
    route: "/trainer/preflop",
    conceptTags: ["preflop", "positions", "opening-ranges"],
    difficultyFocus: ["beginner", "intermediate"],
    learningHighlights: [
      "Vì sao vị trí cuối được open rộng hơn",
      "Vì sao vị trí làm đổi giá trị hand",
      "Vì sao open theo autopilot làm rò chip",
    ],
    relatedPackIds: ["preflop-facing-aggression"],
    studyPathOrder: 1,
  },
  {
    id: "preflop-facing-aggression",
    moduleId: "preflop",
    title: "Preflop gặp áp lực",
    focusLabel: "Kỷ luật tiếp tục hay fold",
    summary:
      "Xử lý open và re-raise gọn hơn bằng cách tôn trọng domination, độ sâu stack và áp lực khi out of position.",
    route: "/trainer/preflop",
    conceptTags: ["preflop", "vs-open", "domination", "3betting", "stack-depth"],
    difficultyFocus: ["intermediate", "advanced-lite"],
    learningHighlights: [
      "Vì sao có hand trở thành call bị dominated",
      "Áp lực 3-bet làm tình huống đổi ra sao",
      "Độ sâu stack đẩy hand vào logic 3-bet hoặc fold thế nào",
    ],
    relatedPackIds: ["preflop-position-basics", "player-type-pressure-adjustments"],
    studyPathOrder: 2,
  },
  {
    id: "pot-odds-fundamentals",
    moduleId: "pot-odds",
    title: "Nền tảng Pot Odds",
    focusLabel: "Giá và outs",
    summary:
      "Mài thói quen tính nhanh trước: biết giá, đếm outs thực tế và dừng đoán mò xem draw có nên tiếp tục hay không.",
    route: "/trainer/pot-odds",
    conceptTags: ["pot-odds", "outs", "equity", "draw-discipline"],
    difficultyFocus: ["beginner", "intermediate"],
    learningHighlights: [
      "Cảm giác về mức giá hòa vốn",
      "Outs sạch và outs bẩn",
      "Vì sao không phải draw nào cũng được call",
    ],
    relatedPackIds: ["postflop-turn-discipline"],
    studyPathOrder: 3,
  },
  {
    id: "pot-odds-turn-pressure",
    moduleId: "pot-odds",
    title: "Pot Odds dưới áp lực turn",
    focusLabel: "Kỷ luật một lá còn lại",
    summary:
      "Luyện các quyết định tiếp tục hay fold khó hơn khi giá xấu đi ở street sau và implied odds co lại.",
    route: "/trainer/pot-odds",
    conceptTags: ["pot-odds", "turn-play", "equity", "implied-odds"],
    difficultyFocus: ["intermediate", "advanced-lite"],
    learningHighlights: [
      "Vì sao toán một lá còn lại quan trọng",
      "Khi nào draw yếu phải thành fold",
      "Vì sao implied odds không thể là cái cớ mơ hồ",
    ],
    relatedPackIds: ["pot-odds-fundamentals", "postflop-turn-discipline"],
    studyPathOrder: 4,
  },
  {
    id: "board-texture-fundamentals",
    moduleId: "board-texture",
    title: "Nền tảng đọc board",
    focusLabel: "Nhận diện board khô và tĩnh",
    summary:
      "Học các read cơ bản trước: board khô, board đôi và vì sao có kết cấu khiến người raise gây áp lực dễ hơn.",
    route: "/trainer/board-texture",
    conceptTags: ["board-texture", "dry-board", "range-advantage"],
    difficultyFocus: ["beginner", "intermediate"],
    learningHighlights: [
      "Đọc board khô và board tĩnh",
      "Giải thích board đôi",
      "Các kết luận lớn về lợi thế range",
    ],
    relatedPackIds: ["board-texture-dynamic-boards", "postflop-cbet-decisions"],
    studyPathOrder: 5,
  },
  {
    id: "board-texture-dynamic-boards",
    moduleId: "board-texture",
    title: "Board động và liên kết",
    focusLabel: "Cẩn trọng với board liên kết",
    summary:
      "Luyện nhận ra khi flop liên kết và turn live trừng phạt c-bet tự động cùng các giả định range quá đơn giản.",
    route: "/trainer/board-texture",
    conceptTags: ["board-texture", "dynamic-board", "coordination", "cbetting"],
    difficultyFocus: ["intermediate", "advanced-lite"],
    learningHighlights: [
      "Board liên kết chạm range defender mạnh hơn ra sao",
      "Vì sao board động đổi rất nhanh",
      "Khi nào tần suất c-bet nên chậm lại",
    ],
    relatedPackIds: ["board-texture-fundamentals", "postflop-cbet-decisions", "postflop-pot-control-spots"],
    studyPathOrder: 6,
  },
  {
    id: "player-type-baseline-discipline",
    moduleId: "player-types",
    title: "Giữ line cơ bản trước",
    focusLabel: "Đứng vững trước đã",
    summary:
      "Tách read thật khỏi read tưởng tượng bằng cách biết khi nào không nên cố exploit và khi nào line cơ bản vẫn sạch hơn.",
    route: "/trainer/player-types",
    conceptTags: ["player-types", "baseline-vs-exploit", "discipline"],
    difficultyFocus: ["beginner", "intermediate"],
    learningHighlights: [
      "Khi nào read mỏng là chưa đủ",
      "Vì sao line cơ bản đến trước exploit",
      "Làm sao tránh over-adjust",
    ],
    relatedPackIds: ["player-type-value-and-call-adjustments", "player-type-pressure-adjustments"],
    studyPathOrder: 7,
  },
  {
    id: "player-type-value-and-call-adjustments",
    moduleId: "player-types",
    title: "Điều chỉnh value và call",
    focusLabel: "Value mỏng, bắt bluff rộng hơn",
    summary:
      "Luyện các nhánh exploit phổ biến ảnh hưởng trực tiếp nhất tới quyết định value bet và bắt bluff trước những kiểu người chơi rõ ràng.",
    route: "/trainer/player-types",
    conceptTags: ["player-types", "value-betting", "bluff-catching", "exploit-play"],
    difficultyFocus: ["beginner", "advanced-lite"],
    learningHighlights: [
      "Khi nào nên value bet mỏng hơn",
      "Khi nào nên bắt bluff rộng hơn",
      "Vì sao kiểu người chơi làm đổi quyết định với một đôi",
    ],
    relatedPackIds: ["player-type-baseline-discipline", "postflop-river-value-vs-bluff"],
    studyPathOrder: 8,
  },
  {
    id: "player-type-pressure-adjustments",
    moduleId: "player-types",
    title: "Điều chỉnh khi gây áp lực",
    focusLabel: "Phạt open rộng và fold nhiều",
    summary:
      "Dùng exploit preflop và exploit theo áp lực có kỷ luật hơn bằng cách đánh đúng range mở rộng thay vì bluff mù quáng.",
    route: "/trainer/player-types",
    conceptTags: ["player-types", "exploit-play", "3betting", "preflop"],
    difficultyFocus: ["intermediate", "advanced-lite"],
    learningHighlights: [
      "Khi nào gây thêm áp lực là có lời",
      "Range mở rộng nào nên bị 3-bet",
      "Vì sao không phải đối thủ hung hăng nào cũng bị đánh giống nhau",
    ],
    relatedPackIds: ["player-type-baseline-discipline", "preflop-facing-aggression"],
    studyPathOrder: 9,
  },
  {
    id: "postflop-cbet-decisions",
    moduleId: "postflop",
    title: "Quyết định c-bet Postflop",
    focusLabel: "Bet hay check ở flop",
    summary:
      "Luyện nhánh postflop đầu tiên thật gọn: flop nào ủng hộ c-bet rõ ràng, flop nào nên check và vì sao lợi thế range không phải lúc nào cũng tự đến.",
    route: "/trainer/postflop",
    conceptTags: ["postflop", "cbetting", "range-advantage", "board-texture"],
    difficultyFocus: ["beginner", "intermediate"],
    learningHighlights: [
      "Khi nào lợi thế range đủ để c-bet",
      "Vì sao có kết cấu board trừng phạt áp lực tự động",
      "Bối cảnh ở flop định hình phần còn lại của hand ra sao",
    ],
    relatedPackIds: ["board-texture-fundamentals", "board-texture-dynamic-boards", "postflop-turn-discipline"],
    studyPathOrder: 10,
  },
  {
    id: "postflop-turn-discipline",
    moduleId: "postflop",
    title: "Kỷ luật turn Postflop",
    focusLabel: "Barrel hay chậm lại",
    summary:
      "Xử lý cú barrel thứ hai có kỷ luật hơn bằng cách hỏi turn thật sự đã đổi gì thay vì phản xạ tự động sau một cú call ở flop.",
    route: "/trainer/postflop",
    conceptTags: ["postflop", "turn-barrel", "turn-play", "value-vs-bluff"],
    difficultyFocus: ["beginner", "intermediate", "advanced-lite"],
    learningHighlights: [
      "Khi nào nên tiếp tục barrel",
      "Khi nào nên để hand check back",
      "Turn card đổi value và fold equity thế nào",
    ],
    relatedPackIds: ["pot-odds-turn-pressure", "postflop-pot-control-spots", "postflop-river-value-vs-bluff"],
    studyPathOrder: 11,
  },
  {
    id: "postflop-pot-control-spots",
    moduleId: "postflop",
    title: "Spot kìm cỡ pot Postflop",
    focusLabel: "Kỷ luật với hand trung bình",
    summary:
      "Luyện khi nào một đôi nên tiếp tục bet và khi nào nên kìm cỡ pot trước khi hand bị chơi quá đà.",
    route: "/trainer/postflop",
    conceptTags: ["postflop", "pot-control", "one-pair-discipline", "turn-play"],
    difficultyFocus: ["intermediate", "advanced-lite"],
    learningHighlights: [
      "Một đôi trở thành hand cần kìm pot như thế nào",
      "Vì sao độ mong manh của hand rất quan trọng",
      "Hand trung bình thường bị overplay ra sao",
    ],
    relatedPackIds: ["board-texture-dynamic-boards", "postflop-turn-discipline"],
    studyPathOrder: 12,
  },
  {
    id: "postflop-river-value-vs-bluff",
    moduleId: "postflop",
    title: "River value hay bluff",
    focusLabel: "Value bet hay dừng lại",
    summary:
      "Luyện câu hỏi lớn ở river cho thật gọn: hand tệ hơn nào còn call, mục tiêu bluff nào là xấu và khi nào kiểu người chơi làm câu trả lời đổi khác.",
    route: "/trainer/postflop",
    conceptTags: ["postflop", "river", "value-vs-bluff", "player-types"],
    difficultyFocus: ["intermediate", "advanced-lite"],
    learningHighlights: [
      "Hand tệ hơn nào thật sự còn call",
      "Khi nào draw hụt nên dừng bluff",
      "Kỷ luật ở river đổi theo kiểu đối thủ ra sao",
    ],
    relatedPackIds: ["player-type-value-and-call-adjustments", "postflop-turn-discipline"],
    studyPathOrder: 13,
  },
];

export const contentPackMap = Object.fromEntries(
  contentPacks.map((contentPack) => [contentPack.id, contentPack]),
) as Record<string, ContentPack>;

export const contentPacksByModule = contentPacks.reduce<
  Record<ContentPack["moduleId"], ContentPack[]>
>(
  (accumulator, contentPack) => {
    const currentPacks = accumulator[contentPack.moduleId] ?? [];
    accumulator[contentPack.moduleId] = [...currentPacks, contentPack];
    return accumulator;
  },
  {
    preflop: [],
    "pot-odds": [],
    "board-texture": [],
    "player-types": [],
    postflop: [],
  },
);

export function getPrimaryContentPack(moduleId: ContentPack["moduleId"]) {
  return contentPacksByModule[moduleId][0] ?? null;
}

export function getContentPacksForModule(
  moduleId: InteractiveTrainingModuleId,
) {
  return contentPacksByModule[moduleId] ?? [];
}

export function getContentPackRoute(
  contentPackId: string | null | undefined,
  options?: {
    difficulty?: Difficulty | null;
  },
) {
  const contentPack = contentPackId ? contentPackMap[contentPackId] : null;

  if (!contentPack) {
    return "/dashboard";
  }

  const params = new URLSearchParams();
  params.set("pack", contentPack.id);

  if (options?.difficulty) {
    params.set("difficulty", options.difficulty);
  }

  return `${contentPack.route}?${params.toString()}`;
}
