import type { TrainingModule } from "@/types/training";

export const trainingModules: TrainingModule[] = [
  {
    id: "preflop",
    title: "Bài luyện Preflop",
    route: "/trainer/preflop",
    summary:
      "Bài luyện open, call, 3-bet và fold theo vị trí, action trước đó và độ sâu stack.",
    phaseStatus: "interactive",
    learningFocus: ["Kỷ luật open hoặc fold", "Đối mặt open", "Nhạy cảm với độ sâu stack"],
    sourceTypeFocus: ["simplification", "baseline"],
  },
  {
    id: "pot-odds",
    title: "Bài luyện Pot Odds",
    route: "/trainer/pot-odds",
    summary:
      "Bài luyện tính nhanh về giá call, số outs và kỷ luật theo draw.",
    phaseStatus: "interactive",
    learningFocus: ["Pot odds", "Đếm outs", "Nhận biết implied odds"],
    sourceTypeFocus: ["simplification", "baseline"],
  },
  {
    id: "board-texture",
    title: "Bài luyện đọc board",
    route: "/trainer/board-texture",
    summary:
      "Bài luyện giúp đọc board khô hay động và hiểu vì sao kết cấu board đổi kế hoạch postflop.",
    phaseStatus: "interactive",
    learningFocus: ["Board khô hay động", "Tương tác range", "Kỷ luật c-bet"],
    sourceTypeFocus: ["simplification", "baseline"],
  },
  {
    id: "postflop",
    title: "Bài luyện Postflop",
    route: "/trainer/postflop",
    summary:
      "Bài luyện quyết định ở flop, turn và river cho c-bet, barrel, kìm cỡ pot và kỷ luật với một đôi.",
    phaseStatus: "interactive",
    learningFocus: [
      "Quyết định c-bet hay check",
      "Kỷ luật barrel turn",
      "Kìm cỡ pot và giữ kỷ luật với một đôi",
    ],
    sourceTypeFocus: ["simplification", "baseline", "exploit"],
  },
  {
    id: "player-types",
    title: "Bài luyện exploit",
    route: "/trainer/player-types",
    summary:
      "Bài luyện điều chỉnh theo các kiểu người chơi quen thuộc với khác biệt rõ giữa line cơ bản và exploit.",
    phaseStatus: "interactive",
    learningFocus: ["Kỷ luật exploit", "Điều chỉnh value bet", "Chọn tình huống bluff"],
    sourceTypeFocus: ["baseline", "exploit"],
  },
  {
    id: "hand-review",
    title: "Xem lại hand",
    route: "/review",
    summary:
      "Ghi chú có cấu trúc để đánh dấu lỗi, chốt điểm học và mở ra bước ôn tiếp theo.",
    phaseStatus: "interactive",
    learningFocus: ["Thói quen xem lại", "Gắn nhãn leak", "Rút kinh nghiệm"],
    sourceTypeFocus: ["simplification"],
    ctaLabel: "Mở bàn xem lại",
  },
];
