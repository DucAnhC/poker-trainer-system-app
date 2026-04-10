export type FoundationTopicId =
  | "equity-basics"
  | "outs-clean-dirty"
  | "pot-odds-core"
  | "hit-probability"
  | "mental-math-tricks";

export type FoundationTrainerMode =
  | "flash-drill"
  | "math-drill"
  | "estimation-drill";

export interface FoundationTopicScaffold {
  id: FoundationTopicId;
  order: number;
  title: string;
  summary: string;
  trainerMode: FoundationTrainerMode;
  estimatedSpotCount: number;
  learningOutcomes: string[];
  samplePromptShapes: string[];
  unlocksPackIds: string[];
  prerequisiteTopicIds: FoundationTopicId[];
  status: "planned";
}

export interface FoundationLearningBranchScaffold {
  id: "foundation-core";
  title: string;
  summary: string;
  suggestedLandingRoute: string;
  uiNotes: string[];
  integrationNotes: string[];
  topics: FoundationTopicScaffold[];
}

export const foundationLearningBranchScaffold: FoundationLearningBranchScaffold = {
  id: "foundation-core",
  title: "Nền tảng quyết định poker",
  summary:
    "Nhánh kiến thức nền nên đứng trước Pot Odds và hỗ trợ cả Preflop/Postflop bằng các bài luyện ngắn, nhịp nhanh, ít chữ.",
  suggestedLandingRoute: "/trainer/foundation",
  uiNotes: [
    "Giữ cùng app shell tactical hiện tại, nhưng giảm complexity của spot panel để ưu tiên con số và nhịp tính.",
    "Mỗi topic nên có flow thống nhất: nhìn nhanh -> ước lượng/chốt -> xem đáp án ngắn -> tự bấm câu tiếp.",
    "Không nên trộn topic nền với scenario exploit; đây là nơi xây phản xạ tính và trực giác trước.",
  ],
  integrationNotes: [
    "Chưa wire vào routing hay trainingModules hiện tại cho tới khi có content thật và route riêng.",
    "Sau khi hoàn tất nội dung, topic Pot Odds nền nên unlock trực tiếp gói `pot-odds-fundamentals` và `pot-odds-turn-pressure`.",
    "Topic Equity/Outs/Hit probability nên là prerequisite mềm cho `postflop-turn-discipline` và `postflop-cbet-decisions`.",
    "Mental math nên đóng vai trò bridge layer để giữ nhịp quyết định nhanh khi người học chuyển sang các tactical modules.",
  ],
  topics: [
    {
      id: "equity-basics",
      order: 1,
      title: "Equity cơ bản",
      summary:
        "Xây trực giác về phần trăm thắng, hòa và vùng equity đủ để tiếp tục mà chưa cần pot odds đầy đủ.",
      trainerMode: "flash-drill",
      estimatedSpotCount: 24,
      learningOutcomes: [
        "Nhận ra hand hoặc draw đang có nhiều hay ít equity tương đối.",
        "Phân biệt spot coin-flip, slight edge và dominated spot theo cảm giác nhanh.",
        "Tạo nền cho Pot Odds và bluff-catch decisions.",
      ],
      samplePromptShapes: [
        "Overpair vs flush draw: ai đang dẫn và chênh lệch khoảng bao nhiêu?",
        "Top pair yếu vs combo draw: edge có còn rõ không?",
      ],
      unlocksPackIds: ["pot-odds-fundamentals", "postflop-cbet-decisions"],
      prerequisiteTopicIds: [],
      status: "planned",
    },
    {
      id: "outs-clean-dirty",
      order: 2,
      title: "Outs sạch / outs bẩn",
      summary:
        "Dạy cách đếm outs thật sự có giá trị và loại bỏ những outs nhìn đẹp nhưng dễ bị reverse hoặc chia pot.",
      trainerMode: "flash-drill",
      estimatedSpotCount: 28,
      learningOutcomes: [
        "Đếm flush draw, open-ended, combo draw nhanh hơn.",
        "Trừ bớt dirty outs khi board pair, flush cao hơn hoặc straight không nuts xuất hiện.",
        "Nâng chất lượng input trước khi tính pot odds.",
      ],
      samplePromptShapes: [
        "Bạn có 9 outs hay chỉ còn 7 outs sạch?",
        "Lá overcard này có thật sự là out sạch không?",
      ],
      unlocksPackIds: ["pot-odds-fundamentals", "pot-odds-turn-pressure"],
      prerequisiteTopicIds: ["equity-basics"],
      status: "planned",
    },
    {
      id: "pot-odds-core",
      order: 3,
      title: "Pot odds",
      summary:
        "Biến cách nhìn giá call thành phản xạ: bỏ ra bao nhiêu, tranh pot cuối bao nhiêu, cần bao nhiêu phần trăm.",
      trainerMode: "math-drill",
      estimatedSpotCount: 30,
      learningOutcomes: [
        "Tính break-even equity nhanh cho các sizing phổ biến.",
        "So sánh equity ước lượng với mức cần để ra call hoặc fold.",
        "Kết nối trực tiếp với module Pot Odds hiện tại.",
      ],
      samplePromptShapes: [
        "Pot 12bb, call 4bb: cần bao nhiêu phần trăm?",
        "Turn facing 2/3 pot: draw này còn đủ giá không?",
      ],
      unlocksPackIds: ["pot-odds-fundamentals", "pot-odds-turn-pressure"],
      prerequisiteTopicIds: ["equity-basics", "outs-clean-dirty"],
      status: "planned",
    },
    {
      id: "hit-probability",
      order: 4,
      title: "Xác suất hit turn / river",
      summary:
        "Củng cố shortcut phần trăm hit với 4-2 rule, 2 rule và các ngoại lệ phổ biến.",
      trainerMode: "estimation-drill",
      estimatedSpotCount: 24,
      learningOutcomes: [
        "Ước lượng xác suất hit từ flop tới river hoặc turn tới river.",
        "Biết khi nào 4-2 rule đủ tốt và khi nào cần thận trọng hơn.",
        "Nối xác suất hit với cảm giác đủ giá để tiếp tục.",
      ],
      samplePromptShapes: [
        "8 outs ở flop tương đương khoảng bao nhiêu phần trăm tới river?",
        "9 outs ở turn có còn đủ để call 1/3 pot không?",
      ],
      unlocksPackIds: ["pot-odds-turn-pressure", "postflop-turn-discipline"],
      prerequisiteTopicIds: ["equity-basics", "outs-clean-dirty", "pot-odds-core"],
      status: "planned",
    },
    {
      id: "mental-math-tricks",
      order: 5,
      title: "Mental math tricks",
      summary:
        "Tổng hợp shortcut thực chiến để người học không phải dừng lại quá lâu khi đang drill spot.",
      trainerMode: "math-drill",
      estimatedSpotCount: 18,
      learningOutcomes: [
        "Nhẩm nhanh các sizing 1/4, 1/3, 1/2, 2/3 pot.",
        "Ước lượng gần đúng khi số pot và bet không tròn đẹp.",
        "Mang nhịp tính đó sang Pot Odds, bluff-catch và turn decisions.",
      ],
      samplePromptShapes: [
        "Bet 7 vào pot 18 cần khoảng bao nhiêu phần trăm?",
        "Có cách nhẩm nhanh nào thay cho tính chính xác tuyệt đối trong hand live?",
      ],
      unlocksPackIds: [
        "pot-odds-fundamentals",
        "pot-odds-turn-pressure",
        "postflop-turn-discipline",
      ],
      prerequisiteTopicIds: [
        "equity-basics",
        "outs-clean-dirty",
        "pot-odds-core",
        "hit-probability",
      ],
      status: "planned",
    },
  ],
};
