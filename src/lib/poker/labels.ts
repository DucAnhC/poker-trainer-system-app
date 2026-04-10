import type {
  HandCategoryId,
  PlayerArchetypeId,
  PositionId,
} from "@/types/poker";
import type { Difficulty, SourceType, TrainingModuleId } from "@/types/training";

export const positionLabels: Record<PositionId, string> = {
  UTG: "UTG",
  HJ: "HJ",
  CO: "CO",
  BTN: "BTN",
  SB: "SB",
  BB: "BB",
};

export const sourceTypeLabels: Record<SourceType, string> = {
  simplification: "Rút gọn",
  baseline: "Cơ bản",
  exploit: "Exploit",
};

export const sourceTypeDescriptions: Record<SourceType, string> = {
  simplification:
    "Đáp án này dùng một lối rút gọn có chủ ý để giữ bài học chính thật rõ trước khi thêm các nhánh khó hơn.",
  baseline:
    "Đáp án này là line thực chiến mặc định của bài luyện dưới các giả định đã nêu, không phải khẳng định mọi combo đều luôn chơi như vậy.",
  exploit:
    "Đáp án này là một điều chỉnh exploit theo xu hướng hoặc kiểu người chơi cụ thể, nên nó chỉ đúng khi read đủ đáng tin.",
};

export const difficultyLabels: Record<Difficulty, string> = {
  beginner: "Cơ bản",
  intermediate: "Trung cấp",
  "advanced-lite": "Nâng cao nhẹ",
};

export const moduleLabels: Record<TrainingModuleId, string> = {
  preflop: "Bài luyện Preflop",
  "pot-odds": "Bài luyện Pot Odds",
  "board-texture": "Bài luyện đọc board",
  "player-types": "Bài luyện exploit",
  postflop: "Bài luyện Postflop",
  "hand-review": "Xem lại hand",
};

export const playerArchetypeLabels: Record<PlayerArchetypeId, string> = {
  nit: "Nit",
  tag: "TAG",
  lag: "LAG",
  "calling-station": "Calling station",
  maniac: "Maniac",
  "passive-rec": "Rec thụ động",
};

export const handCategoryLabels: Record<HandCategoryId, string> = {
  "premium-pair": "Đôi lớn",
  "strong-broadway": "Broadway mạnh",
  "offsuit-broadway": "Broadway offsuit",
  "suited-broadway": "Broadway suited",
  "suited-ace": "A suited",
  "small-pair": "Đôi nhỏ",
  "suited-connector": "Connector suited",
  "suited-gapper": "Gapper suited",
  "weak-offsuit": "Offsuit yếu",
  trash: "Bài rác low-equity",
};
