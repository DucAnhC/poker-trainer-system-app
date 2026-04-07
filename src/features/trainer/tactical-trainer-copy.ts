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
    lockLabel: "Chot",
    nextSpotLabel: "Spot tiep",
    finishSetLabel: "Ket thuc set",
    restartLabel: "Lam lai",
    sessionProgressLabel: "Tien do",
    accuracyLabel: "Do chinh xac",
    attemptsLabel: "Tong attempts",
    sessionLabel: "Nhip hoc",
    packLabel: "Goi",
    levelLabel: "Muc",
    orderLabel: "Thu tu",
    storageLabel: "Luu",
    retryLabel: "On lai",
    savingLabel: "Dang luu",
    syncIssueLabel: "Loi sync",
    selectedLineLabel: "Line da chot",
    noLineSelectedLabel: "Chua chot line",
    resultLabel: "Ket qua",
    bestLineLabel: "Line chuan",
    whyLabel: "Vi sao",
    learnLabel: "Diem hoc",
    driftLabel: "Lech o dau",
    assumptionsLabel: "Gia dinh",
    nextLabel: "Hoc tiep",
    reviewPlaceholder: "Nop dap an de mo correction ngan.",
    correctLabel: "Dung",
    incorrectLabel: "Sai",
    heroLabel: "Hero",
    villainLabel: "Villain",
    handLabel: "Hand",
    boardLabel: "Board",
    stackLabel: "Stack",
    streetLabel: "Street",
    actionLabel: "Line truoc do",
    focusLabel: "Trong tam",
    textureLabel: "Texture",
    playerTypeLabel: "Player type",
    potLabel: "Pot",
    callLabel: "Gia call",
    needLabel: "Can",
    outsLabel: "Outs",
    hintLabel: "Hint",
    sourceLabel: "Che do",
    correctCountLabel: "So dung",
    savedLabel: "Da luu",
    openPackLabel: "Mo pack",
    moduleMeta: {
      preflop: {
        eyebrow: "Decision drill",
        title: "Preflop",
        stateEyebrow: "Table state",
        decisionTitle: "Chot line preflop",
        decisionHint: "Doc spot nhanh, chot action, roi qua hand tiep.",
        reviewEyebrow: "Quick review",
        completionTitle: "Hoan tat set Preflop",
        completionBody: "Giu nhip nhanh: vi tri, stack depth va action history truoc tien.",
        emptyTitle: "Chua co spot Preflop",
        emptyBody: "Thu goi hoac muc khac de tiep tuc drill.",
      },
      "pot-odds": {
        eyebrow: "Math drill",
        title: "Pot Odds",
        stateEyebrow: "Math snapshot",
        decisionTitle: "Chot call hay fold",
        decisionHint: "Nhin gia truoc, ra quyet dinh sau, roi qua spot tiep.",
        reviewEyebrow: "Math review",
        completionTitle: "Hoan tat set Pot Odds",
        completionBody: "Giu nhip doc gia, outs va required equity that nhanh va gon.",
        emptyTitle: "Chua co spot Pot Odds",
        emptyBody: "Thu goi hoac muc khac de tiep tuc drill.",
      },
      "board-texture": {
        eyebrow: "Texture read",
        title: "Board Texture",
        stateEyebrow: "Board snapshot",
        decisionTitle: "Chot takeaway",
        decisionHint: "Doc board nhanh va khoa y chinh ngay.",
        reviewEyebrow: "Texture review",
        completionTitle: "Hoan tat set Board Texture",
        completionBody: "Giu cach doc ngan gon: board state, range pressure va card nao thay doi spot.",
        emptyTitle: "Chua co spot Board Texture",
        emptyBody: "Thu goi hoac muc khac de tiep tuc drill.",
      },
      "player-types": {
        eyebrow: "Adjustment drill",
        title: "Player Types",
        stateEyebrow: "Read snapshot",
        decisionTitle: "Chot adjustment",
        decisionHint: "Thay tendency, chon exploit, roi di tiep.",
        reviewEyebrow: "Read review",
        completionTitle: "Hoan tat set Player Types",
        completionBody: "Giu no thuc chien: read ro, adjustment ro, khong ke chuyen dai.",
        emptyTitle: "Chua co spot Player Types",
        emptyBody: "Thu goi hoac muc khac de tiep tuc drill.",
      },
      postflop: {
        eyebrow: "Decision drill",
        title: "Postflop",
        stateEyebrow: "Hand snapshot",
        decisionTitle: "Chot line postflop",
        decisionHint: "Doc board, doc hand, roi chot line.",
        reviewEyebrow: "Spot review",
        completionTitle: "Hoan tat set Postflop",
        completionBody: "Di theo nhanh sach: board, range pressure va muc dich cua action.",
        emptyTitle: "Chua co spot Postflop",
        emptyBody: "Thu goi hoac muc khac de tiep tuc drill.",
      },
    },
    difficultyLabels: {
      all: "Tat ca",
      beginner: "Co ban",
      intermediate: "Trung cap",
      "advanced-lite": "Nang cao nhe",
    },
    queueModeLabels: {
      adaptive: "Adaptive",
      default: "Thu tu goc",
    },
    storageModeLabels: {
      account: "Cloud save",
      local: "Luu local",
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
        disconnected: "Roi rac",
        "semi-connected": "Semi-connected",
        "highly-connected": "Lien ket cao",
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
