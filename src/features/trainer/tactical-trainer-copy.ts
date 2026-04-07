import type { BoardTextureProfile, PlayerArchetypeId } from "@/types/poker";
import type {
  Difficulty,
  InteractiveTrainingModuleId,
  PersistenceMode,
  SourceType,
  TrainerQueueMode,
} from "@/types/training";

export type TacticalUiLanguage = "en" | "vi";

type TacticalModuleMeta = {
  eyebrow: string;
  title: string;
  stateEyebrow: string;
  decisionTitle: string;
  decisionHint: string;
  reviewEyebrow: string;
  completionTitle: string;
  completionBody: string;
  emptyTitle: string;
  emptyBody: string;
};

type TacticalCopy = {
  lockLabel: string;
  nextSpotLabel: string;
  finishSetLabel: string;
  restartLabel: string;
  sessionProgressLabel: string;
  accuracyLabel: string;
  attemptsLabel: string;
  sessionLabel: string;
  packLabel: string;
  levelLabel: string;
  orderLabel: string;
  storageLabel: string;
  retryLabel: string;
  savingLabel: string;
  syncIssueLabel: string;
  selectedLineLabel: string;
  noLineSelectedLabel: string;
  resultLabel: string;
  bestLineLabel: string;
  whyLabel: string;
  learnLabel: string;
  driftLabel: string;
  assumptionsLabel: string;
  nextLabel: string;
  reviewPlaceholder: string;
  correctLabel: string;
  incorrectLabel: string;
  heroLabel: string;
  villainLabel: string;
  handLabel: string;
  boardLabel: string;
  stackLabel: string;
  streetLabel: string;
  actionLabel: string;
  focusLabel: string;
  textureLabel: string;
  playerTypeLabel: string;
  potLabel: string;
  callLabel: string;
  needLabel: string;
  outsLabel: string;
  hintLabel: string;
  sourceLabel: string;
  correctCountLabel: string;
  savedLabel: string;
  openPackLabel: string;
  moduleMeta: Record<InteractiveTrainingModuleId, TacticalModuleMeta>;
  difficultyLabels: Record<Difficulty | "all", string>;
  queueModeLabels: Record<TrainerQueueMode, string>;
  storageModeLabels: Record<PersistenceMode, string>;
  sourceTypeLabels: Record<SourceType, string>;
  playerTypeLabels: Record<PlayerArchetypeId, string>;
  boardLabels: {
    suitedness: Record<NonNullable<BoardTextureProfile["suitedness"]>, string>;
    connectedness: Record<NonNullable<BoardTextureProfile["connectedness"]>, string>;
    pairedness: Record<NonNullable<BoardTextureProfile["pairedness"]>, string>;
    dynamicLevel: Record<NonNullable<BoardTextureProfile["dynamicLevel"]>, string>;
  };
};

const tacticalCopy: Record<TacticalUiLanguage, TacticalCopy> = {
  en: {
    lockLabel: "Lock",
    nextSpotLabel: "Next spot",
    finishSetLabel: "Finish set",
    restartLabel: "Restart",
    sessionProgressLabel: "Progress",
    accuracyLabel: "Accuracy",
    attemptsLabel: "Attempts",
    sessionLabel: "Session",
    packLabel: "Pack",
    levelLabel: "Level",
    orderLabel: "Order",
    storageLabel: "Save",
    retryLabel: "Retry",
    savingLabel: "Saving",
    syncIssueLabel: "Sync issue",
    selectedLineLabel: "Locked line",
    noLineSelectedLabel: "No line locked",
    resultLabel: "Result",
    bestLineLabel: "Best line",
    whyLabel: "Why",
    learnLabel: "Takeaway",
    driftLabel: "Line drift",
    assumptionsLabel: "Assumption",
    nextLabel: "Study next",
    reviewPlaceholder: "Submit to open the short correction.",
    correctLabel: "Correct",
    incorrectLabel: "Review",
    heroLabel: "Hero",
    villainLabel: "Villain",
    handLabel: "Hand",
    boardLabel: "Board",
    stackLabel: "Stack",
    streetLabel: "Street",
    actionLabel: "Action lane",
    focusLabel: "Focus",
    textureLabel: "Texture",
    playerTypeLabel: "Player type",
    potLabel: "Pot",
    callLabel: "Call",
    needLabel: "Need",
    outsLabel: "Outs",
    hintLabel: "Hint",
    sourceLabel: "Mode",
    correctCountLabel: "Correct",
    savedLabel: "Saved",
    openPackLabel: "Open pack",
    moduleMeta: {
      preflop: {
        eyebrow: "Decision drill",
        title: "Preflop",
        stateEyebrow: "Table state",
        decisionTitle: "Lock the preflop line",
        decisionHint: "Read the spot fast, lock the action, and move on.",
        reviewEyebrow: "Quick review",
        completionTitle: "Preflop set complete",
        completionBody: "Keep the pace high: position, stack depth, and action history first.",
        emptyTitle: "No preflop spots",
        emptyBody: "Try another pack or level to continue the drill.",
      },
      "pot-odds": {
        eyebrow: "Math drill",
        title: "Pot Odds",
        stateEyebrow: "Math snapshot",
        decisionTitle: "Lock the call or fold",
        decisionHint: "Price first, decision second, then move on.",
        reviewEyebrow: "Math review",
        completionTitle: "Pot Odds set complete",
        completionBody: "Keep price, outs, and break-even intuition quick and clean.",
        emptyTitle: "No pot-odds spots",
        emptyBody: "Try another pack or level to continue the drill.",
      },
      "board-texture": {
        eyebrow: "Texture read",
        title: "Board Texture",
        stateEyebrow: "Board snapshot",
        decisionTitle: "Lock the takeaway",
        decisionHint: "Read the board state fast and commit to the main takeaway.",
        reviewEyebrow: "Texture review",
        completionTitle: "Board Texture set complete",
        completionBody: "Keep the read short: board state, range pressure, and what changes next.",
        emptyTitle: "No board-texture spots",
        emptyBody: "Try another pack or level to continue the drill.",
      },
      "player-types": {
        eyebrow: "Adjustment drill",
        title: "Player Types",
        stateEyebrow: "Read snapshot",
        decisionTitle: "Lock the adjustment",
        decisionHint: "Spot the tendency, choose the exploit, and keep moving.",
        reviewEyebrow: "Read review",
        completionTitle: "Player Types set complete",
        completionBody: "Stay practical: strong read, clear adjustment, no story-telling.",
        emptyTitle: "No player-type spots",
        emptyBody: "Try another pack or level to continue the drill.",
      },
      postflop: {
        eyebrow: "Decision drill",
        title: "Postflop",
        stateEyebrow: "Hand snapshot",
        decisionTitle: "Lock the postflop line",
        decisionHint: "Read board state, hand state, then commit.",
        reviewEyebrow: "Spot review",
        completionTitle: "Postflop set complete",
        completionBody: "Stay on the clean branch: board, range pressure, and action purpose.",
        emptyTitle: "No postflop spots",
        emptyBody: "Try another pack or level to continue the drill.",
      },
    },
    difficultyLabels: {
      all: "All",
      beginner: "Beginner",
      intermediate: "Intermediate",
      "advanced-lite": "Advanced-lite",
    },
    queueModeLabels: {
      adaptive: "Adaptive",
      default: "Original",
    },
    storageModeLabels: {
      account: "Cloud save",
      local: "Local save",
    },
    sourceTypeLabels: {
      simplification: "Simplification",
      baseline: "Baseline",
      exploit: "Exploit",
    },
    playerTypeLabels: {
      nit: "Nit",
      tag: "TAG",
      lag: "LAG",
      "calling-station": "Calling station",
      maniac: "Maniac",
      "passive-rec": "Passive rec",
    },
    boardLabels: {
      suitedness: {
        rainbow: "Rainbow",
        "two-tone": "2-tone",
        monotone: "Monotone",
      },
      connectedness: {
        disconnected: "Disconnected",
        "semi-connected": "Semi-connected",
        "highly-connected": "Highly connected",
      },
      pairedness: {
        unpaired: "Unpaired",
        paired: "Paired",
        "double-paired": "Double-paired",
      },
      dynamicLevel: {
        static: "Static",
        medium: "Medium",
        dynamic: "Dynamic",
      },
    },
  },
  vi: {
    lockLabel: "Chốt",
    nextSpotLabel: "Spot tiếp",
    finishSetLabel: "Kết thúc set",
    restartLabel: "Làm lại",
    sessionProgressLabel: "Tiến độ",
    accuracyLabel: "Độ chính xác",
    attemptsLabel: "Tổng lượt",
    sessionLabel: "Nhịp học",
    packLabel: "Gói",
    levelLabel: "Mức",
    orderLabel: "Thứ tự",
    storageLabel: "Lưu",
    retryLabel: "Ôn lại",
    savingLabel: "Đang lưu",
    syncIssueLabel: "Lỗi sync",
    selectedLineLabel: "Line đã chốt",
    noLineSelectedLabel: "Chưa chốt line",
    resultLabel: "Kết quả",
    bestLineLabel: "Line chuẩn",
    whyLabel: "Vì sao",
    learnLabel: "Điểm học",
    driftLabel: "Lệch ở đâu",
    assumptionsLabel: "Giả định",
    nextLabel: "Học tiếp",
    reviewPlaceholder: "Nộp đáp án để mở correction ngắn.",
    correctLabel: "Đúng",
    incorrectLabel: "Sai",
    heroLabel: "Hero",
    villainLabel: "Villain",
    handLabel: "Hand",
    boardLabel: "Board",
    stackLabel: "Stack",
    streetLabel: "Street",
    actionLabel: "Line trước đó",
    focusLabel: "Trọng tâm",
    textureLabel: "Texture",
    playerTypeLabel: "Player type",
    potLabel: "Pot",
    callLabel: "Giá call",
    needLabel: "Cần",
    outsLabel: "Outs",
    hintLabel: "Hint",
    sourceLabel: "Chế độ",
    correctCountLabel: "Số đúng",
    savedLabel: "Đã lưu",
    openPackLabel: "Mở gói",
    moduleMeta: {
      preflop: {
        eyebrow: "Drill quyết định",
        title: "Preflop",
        stateEyebrow: "Trạng thái bàn",
        decisionTitle: "Chốt line preflop",
        decisionHint: "Đọc spot nhanh, chốt action, qua hand tiếp.",
        reviewEyebrow: "Review nhanh",
        completionTitle: "Hoàn tất set Preflop",
        completionBody: "Giữ nhịp nhanh: vị trí, stack depth và action history trước tiên.",
        emptyTitle: "Chưa có spot Preflop",
        emptyBody: "Thử gói hoặc mức khác để tiếp tục drill.",
      },
      "pot-odds": {
        eyebrow: "Drill giá",
        title: "Pot Odds",
        stateEyebrow: "Spot giá",
        decisionTitle: "Chốt call hay fold",
        decisionHint: "Nhìn giá trước, ra quyết định sau, rồi qua spot tiếp.",
        reviewEyebrow: "Review giá",
        completionTitle: "Hoàn tất set Pot Odds",
        completionBody: "Giữ nhịp đọc giá, outs và required equity thật nhanh, thật gọn.",
        emptyTitle: "Chưa có spot Pot Odds",
        emptyBody: "Thử gói hoặc mức khác để tiếp tục drill.",
      },
      "board-texture": {
        eyebrow: "Đọc texture",
        title: "Board Texture",
        stateEyebrow: "Board state",
        decisionTitle: "Chốt takeaway",
        decisionHint: "Đọc board nhanh và khóa ý chính ngay.",
        reviewEyebrow: "Review texture",
        completionTitle: "Hoàn tất set Board Texture",
        completionBody: "Giữ cách đọc ngắn gọn: board state, range pressure và lá nào đổi nhịp spot.",
        emptyTitle: "Chưa có spot Board Texture",
        emptyBody: "Thử gói hoặc mức khác để tiếp tục drill.",
      },
      "player-types": {
        eyebrow: "Drill exploit",
        title: "Player Types",
        stateEyebrow: "Villain read",
        decisionTitle: "Chốt adjustment",
        decisionHint: "Thấy tendency, chọn exploit, rồi đi tiếp.",
        reviewEyebrow: "Review read",
        completionTitle: "Hoàn tất set Player Types",
        completionBody: "Giữ nó thực chiến: read rõ, adjustment rõ, không kể chuyện dài.",
        emptyTitle: "Chưa có spot Player Types",
        emptyBody: "Thử gói hoặc mức khác để tiếp tục drill.",
      },
      postflop: {
        eyebrow: "Drill quyết định",
        title: "Postflop",
        stateEyebrow: "Hand state",
        decisionTitle: "Chốt line postflop",
        decisionHint: "Đọc board, đọc hand, rồi chốt line.",
        reviewEyebrow: "Review spot",
        completionTitle: "Hoàn tất set Postflop",
        completionBody: "Đi theo nhánh sạch: board, range pressure và mục đích của action.",
        emptyTitle: "Chưa có spot Postflop",
        emptyBody: "Thử gói hoặc mức khác để tiếp tục drill.",
      },
    },
    difficultyLabels: {
      all: "Tất cả",
      beginner: "Cơ bản",
      intermediate: "Trung cấp",
      "advanced-lite": "Nâng cao nhẹ",
    },
    queueModeLabels: {
      adaptive: "Adaptive",
      default: "Thứ tự gốc",
    },
    storageModeLabels: {
      account: "Cloud sync",
      local: "Lưu local",
    },
    sourceTypeLabels: {
      simplification: "Simplification",
      baseline: "Baseline",
      exploit: "Exploit",
    },
    playerTypeLabels: {
      nit: "Nit",
      tag: "TAG",
      lag: "LAG",
      "calling-station": "Calling station",
      maniac: "Maniac",
      "passive-rec": "Passive rec",
    },
    boardLabels: {
      suitedness: {
        rainbow: "Rainbow",
        "two-tone": "2-tone",
        monotone: "Monotone",
      },
      connectedness: {
        disconnected: "Rời rạc",
        "semi-connected": "Semi-connected",
        "highly-connected": "Liên kết cao",
      },
      pairedness: {
        unpaired: "Unpaired",
        paired: "Paired",
        "double-paired": "Double-paired",
      },
      dynamicLevel: {
        static: "Tĩnh",
        medium: "Trung bình",
        dynamic: "Động",
      },
    },
  },
};

export function getTacticalUiLanguage(locale: string): TacticalUiLanguage {
  return locale === "vi-VN" ? "vi" : "en";
}

export function getTacticalDrillCopy(language: TacticalUiLanguage) {
  return tacticalCopy[language];
}

export function getTacticalModuleMeta(
  moduleId: InteractiveTrainingModuleId,
  language: TacticalUiLanguage,
) {
  return tacticalCopy[language].moduleMeta[moduleId];
}

export function getTacticalDifficultyLabel(
  difficulty: Difficulty | "all",
  language: TacticalUiLanguage,
) {
  return tacticalCopy[language].difficultyLabels[difficulty];
}

export function getTacticalQueueModeLabel(
  queueMode: TrainerQueueMode,
  language: TacticalUiLanguage,
) {
  return tacticalCopy[language].queueModeLabels[queueMode];
}

export function getTacticalStorageLabel(
  storageMode: PersistenceMode,
  language: TacticalUiLanguage,
) {
  return tacticalCopy[language].storageModeLabels[storageMode];
}

export function getTacticalSourceTypeLabel(
  sourceType: SourceType,
  language: TacticalUiLanguage,
) {
  return tacticalCopy[language].sourceTypeLabels[sourceType];
}

export function getTacticalPlayerTypeLabel(
  playerTypeId: PlayerArchetypeId,
  language: TacticalUiLanguage,
) {
  return tacticalCopy[language].playerTypeLabels[playerTypeId];
}

export function getTacticalBoardLabels(
  board: BoardTextureProfile,
  language: TacticalUiLanguage,
) {
  const labels = tacticalCopy[language].boardLabels;

  return [
    labels.suitedness[board.suitedness],
    labels.connectedness[board.connectedness],
    labels.pairedness[board.pairedness],
    labels.dynamicLevel[board.dynamicLevel],
  ];
}
