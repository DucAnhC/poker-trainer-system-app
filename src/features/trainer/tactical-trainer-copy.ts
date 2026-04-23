import type { BoardTextureProfile, PlayerArchetypeId } from "@/types/poker";
import type {
  Difficulty,
  InteractiveTrainingModuleId,
  PersistenceMode,
  SourceType,
  TrainingAnswerPhase,
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
  retrySpotLabel: string;
  selectedHint: string;
  decisionReviewHint: string;
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

const tacticalPackLabelsVi: Record<string, string> = {
  "pot-odds-fundamentals": "Giá và outs",
  "pot-odds-turn-pressure": "Turn áp lực giá",
  "board-texture-fundamentals": "Board khô / tĩnh",
  "board-texture-dynamic-boards": "Board liên kết",
  "player-type-baseline-discipline": "Giữ cơ bản trước",
  "player-type-value-and-call-adjustments": "Value mỏng / bắt bluff",
  "player-type-pressure-adjustments": "Phạt open rộng",
  "postflop-cbet-decisions": "C-bet hay check",
  "postflop-turn-discipline": "Barrel hay chậm lại",
  "postflop-pot-control-spots": "Kìm cỡ pot",
  "postflop-river-value-vs-bluff": "Value bet hay dừng",
};

const tacticalCopy: Record<TacticalUiLanguage, TacticalCopy> = {
  en: {
    lockLabel: "Lock",
    nextSpotLabel: "Next spot",
    finishSetLabel: "Finish set",
    restartLabel: "Restart",
    retrySpotLabel: "Retry this spot",
    selectedHint: "The line is ready. Lock it to open the correction.",
    decisionReviewHint: "Result is open. Review, then move when ready.",
    sessionProgressLabel: "Answered",
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
    selectedLineLabel: "Selected line",
    noLineSelectedLabel: "No line selected",
    resultLabel: "Result",
    bestLineLabel: "Best line",
    whyLabel: "Why",
    learnLabel: "Takeaway",
    driftLabel: "Line drift",
    assumptionsLabel: "Assumption",
    nextLabel: "Study next",
    reviewPlaceholder: "Lock a line to open the short correction.",
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
    nextSpotLabel: "Tình huống tiếp",
    finishSetLabel: "Kết thúc set",
    restartLabel: "Làm lại",
    retrySpotLabel: "Làm lại spot này",
    selectedHint: "Line đã sẵn. Bấm chốt để mở sửa nhanh.",
    decisionReviewHint: "Kết quả đã mở. Xem nhanh rồi tự bấm tình huống tiếp.",
    sessionProgressLabel: "Đã trả lời",
    accuracyLabel: "Độ chính xác",
    attemptsLabel: "Tổng lượt thử",
    sessionLabel: "Nhịp học",
    packLabel: "Gói học",
    levelLabel: "Mức độ",
    orderLabel: "Thứ tự",
    storageLabel: "Lưu",
    retryLabel: "Ôn lại",
    savingLabel: "Đang lưu",
    syncIssueLabel: "Lỗi đồng bộ",
    selectedLineLabel: "Line đã chọn",
    noLineSelectedLabel: "Chưa chọn line",
    resultLabel: "Kết quả",
    bestLineLabel: "Line chuẩn",
    whyLabel: "Vì sao",
    learnLabel: "Điểm học",
    driftLabel: "Lệch ở đâu",
    assumptionsLabel: "Giả định",
    nextLabel: "Học tiếp",
    reviewPlaceholder: "Chốt line để mở sửa nhanh.",
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
    textureLabel: "Kết cấu board",
    playerTypeLabel: "Kiểu người chơi",
    potLabel: "Pot",
    callLabel: "Giá call",
    needLabel: "Cần",
    outsLabel: "Outs",
    hintLabel: "Gợi ý",
    sourceLabel: "Nguồn",
    correctCountLabel: "Số đúng",
    savedLabel: "Lưu lúc",
    openPackLabel: "Mở gói học",
    moduleMeta: {
      preflop: {
        eyebrow: "Bài luyện quyết định",
        title: "Preflop",
        stateEyebrow: "Trạng thái bàn",
        decisionTitle: "Chốt line preflop",
        decisionHint: "Đọc tình huống nhanh, chốt action, qua hand tiếp.",
        reviewEyebrow: "Sửa nhanh",
        completionTitle: "Hoàn tất loạt Preflop",
        completionBody: "Giữ nhịp nhanh: vị trí, độ sâu stack và line trước đó trước tiên.",
        emptyTitle: "Chưa có tình huống Preflop",
        emptyBody: "Thử gói hoặc mức khác để tiếp tục bài luyện.",
      },
      "pot-odds": {
        eyebrow: "Bài luyện tính nhanh",
        title: "Pot Odds",
        stateEyebrow: "Tình huống giá",
        decisionTitle: "Chốt call hay fold",
        decisionHint: "Nhìn giá trước, ra quyết định sau, rồi qua tình huống tiếp.",
        reviewEyebrow: "Sửa nhanh",
        completionTitle: "Hoàn tất loạt Pot Odds",
        completionBody: "Giữ nhịp đọc giá, outs và mức cần đủ thật nhanh, thật gọn.",
        emptyTitle: "Chưa có tình huống Pot Odds",
        emptyBody: "Thử gói hoặc mức khác để tiếp tục bài luyện.",
      },
      "board-texture": {
        eyebrow: "Bài luyện đọc board",
        title: "Kết cấu board",
        stateEyebrow: "Ảnh board",
        decisionTitle: "Chốt ý chính",
        decisionHint: "Đọc board rồi chốt ý chính.",
        reviewEyebrow: "Sửa nhanh",
        completionTitle: "Hoàn tất loạt Kết cấu board",
        completionBody: "Giữ cách đọc ngắn gọn: board, áp lực range và lá nào đổi nhịp tình huống.",
        emptyTitle: "Chưa có tình huống Kết cấu board",
        emptyBody: "Thử gói hoặc mức khác để tiếp tục bài luyện.",
      },
      "player-types": {
        eyebrow: "Bài luyện exploit",
        title: "Kiểu người chơi",
        stateEyebrow: "Đọc villain",
        decisionTitle: "Chốt điều chỉnh",
        decisionHint: "Thấy xu hướng, chọn exploit, rồi đi tiếp.",
        reviewEyebrow: "Sửa nhanh",
        completionTitle: "Hoàn tất loạt Kiểu người chơi",
        completionBody: "Giữ nó thực chiến: đọc rõ, điều chỉnh rõ, không kể chuyện dài.",
        emptyTitle: "Chưa có tình huống Kiểu người chơi",
        emptyBody: "Thử gói hoặc mức khác để tiếp tục bài luyện.",
      },
      postflop: {
        eyebrow: "Bài luyện quyết định",
        title: "Postflop",
        stateEyebrow: "Ảnh hand",
        decisionTitle: "Chốt line postflop",
        decisionHint: "Đọc board, đọc hand, rồi chốt line.",
        reviewEyebrow: "Sửa nhanh",
        completionTitle: "Hoàn tất loạt Postflop",
        completionBody: "Đi theo nhánh sạch: board, áp lực range và mục đích của action.",
        emptyTitle: "Chưa có tình huống Postflop",
        emptyBody: "Thử gói hoặc mức khác để tiếp tục bài luyện.",
      },
    },
    difficultyLabels: {
      all: "Tất cả",
      beginner: "Cơ bản",
      intermediate: "Trung cấp",
      "advanced-lite": "Nâng cao nhẹ",
    },
    queueModeLabels: {
      adaptive: "Thích ứng",
      default: "Tuần tự",
    },
    storageModeLabels: {
      account: "Đồng bộ đám mây",
      local: "Máy này",
    },
    sourceTypeLabels: {
      simplification: "Rút gọn",
      baseline: "Cơ bản",
      exploit: "Exploit",
    },
    playerTypeLabels: {
      nit: "Nit",
      tag: "TAG",
      lag: "LAG",
      "calling-station": "Calling station",
      maniac: "Maniac",
      "passive-rec": "Rec thụ động",
    },
    boardLabels: {
      suitedness: {
        rainbow: "Rainbow",
        "two-tone": "2-tone",
        monotone: "Monotone",
      },
      connectedness: {
        disconnected: "Rời rạc",
        "semi-connected": "Liên kết vừa",
        "highly-connected": "Liên kết cao",
      },
      pairedness: {
        unpaired: "Không đôi",
        paired: "Có đôi",
        "double-paired": "Hai đôi",
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

export function getTacticalDecisionHint(
  phase: TrainingAnswerPhase,
  defaultHint: string,
  language: TacticalUiLanguage,
) {
  const copy = getTacticalDrillCopy(language);

  if (phase === "selected") {
    return copy.selectedHint;
  }

  if (phase === "revealed" || phase === "next-ready") {
    return copy.decisionReviewHint;
  }

  return defaultHint;
}

export function getTacticalPackLabel(
  packId: string,
  fallbackLabel: string,
  language: TacticalUiLanguage,
) {
  if (language === "vi") {
    return tacticalPackLabelsVi[packId] ?? fallbackLabel;
  }

  return fallbackLabel;
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
