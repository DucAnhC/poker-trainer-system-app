import { contentPackMap } from "@/data/content-packs";
import { getConceptLabel } from "@/lib/training/concepts";
import type {
  CandidateAction,
  Difficulty,
  PersistenceMode,
  PreflopScenario,
  SourceType,
  TrainingAnswerPhase,
  TrainerQueueMode,
  TrainingDifficultyFilter,
} from "@/types/training";

export type PreflopUiLanguage = "en" | "vi";

const conceptLabelsVi: Record<string, string> = {
  positions: "Vị trí",
  "opening-ranges": "Open range",
  "stack-depth": "Stack depth",
  "vs-open": "Vs Open",
  domination: "Domination",
  "3betting": "3-bet",
  preflop: "Preflop",
};

const packLabelsVi: Record<string, string> = {
  "preflop-position-basics": "Open theo vị trí",
  "preflop-facing-aggression": "Vs Open / áp lực",
};

const packLabelsEn: Record<string, string> = {
  "preflop-position-basics": "Position Opens",
  "preflop-facing-aggression": "Facing Aggression",
};

const difficultyLabelsVi: Record<TrainingDifficultyFilter, string> = {
  all: "Mọi mức",
  beginner: "Cơ bản",
  intermediate: "Trung bình",
  "advanced-lite": "Nâng cao",
};

const difficultyLabelsEn: Record<TrainingDifficultyFilter, string> = {
  all: "All levels",
  beginner: "Beginner",
  intermediate: "Intermediate",
  "advanced-lite": "Advanced",
};

const sourceTypeLabelsVi: Record<SourceType, string> = {
  simplification: "Rút gọn",
  baseline: "Cơ bản",
  exploit: "Exploit",
};

const sourceTypeLabelsEn: Record<SourceType, string> = {
  simplification: "Simplified",
  baseline: "Baseline",
  exploit: "Exploit",
};

const queueModeLabelsVi: Record<TrainerQueueMode, string> = {
  adaptive: "Thích ứng",
  default: "Tuần tự",
};

const queueModeLabelsEn: Record<TrainerQueueMode, string> = {
  adaptive: "Adaptive",
  default: "Ordered",
};

const potTypeLabelsVi: Record<PreflopScenario["potType"], string> = {
  unopened: "Chưa open",
  "vs-open": "Vs Open",
  "vs-3bet": "Vs 3-bet",
  "vs-4bet": "Vs 4-bet",
};

const potTypeLabelsEn: Record<PreflopScenario["potType"], string> = {
  unopened: "Unopened",
  "vs-open": "Vs Open",
  "vs-3bet": "Vs 3-bet",
  "vs-4bet": "Vs 4-bet",
};

const actionTypeLabels: Record<CandidateAction["actionType"], string> = {
  open: "Open",
  check: "Check",
  bet: "Bet",
  call: "Call",
  raise: "Raise",
  "3bet": "3-bet",
  "4bet": "4-bet",
  fold: "Fold",
  classify: "Classify",
};

export function getPreflopUiLanguage(locale: string): PreflopUiLanguage {
  return locale === "vi-VN" ? "vi" : "en";
}

export function getPreflopConceptLabel(
  conceptId: string,
  language: PreflopUiLanguage,
) {
  if (language === "vi") {
    return conceptLabelsVi[conceptId] ?? getConceptLabel(conceptId);
  }

  return getConceptLabel(conceptId);
}

export function getPreflopPackLabel(
  packId: string,
  language: PreflopUiLanguage,
) {
  const fallbackLabel =
    contentPackMap[packId]?.title ??
    packId
      .split("-")
      .map((segment) => segment[0]?.toUpperCase() + segment.slice(1))
      .join(" ");

  if (language === "vi") {
    return packLabelsVi[packId] ?? fallbackLabel;
  }

  return packLabelsEn[packId] ?? fallbackLabel;
}

export function getPreflopDifficultyLabel(
  difficulty: TrainingDifficultyFilter | Difficulty,
  language: PreflopUiLanguage,
) {
  return language === "vi"
    ? difficultyLabelsVi[difficulty]
    : difficultyLabelsEn[difficulty];
}

export function getPreflopSourceTypeLabel(
  sourceType: SourceType,
  language: PreflopUiLanguage,
) {
  return language === "vi"
    ? sourceTypeLabelsVi[sourceType]
    : sourceTypeLabelsEn[sourceType];
}

export function getPreflopQueueModeLabel(
  queueMode: TrainerQueueMode,
  language: PreflopUiLanguage,
) {
  return language === "vi"
    ? queueModeLabelsVi[queueMode]
    : queueModeLabelsEn[queueMode];
}

export function getPreflopPotTypeLabel(
  potType: PreflopScenario["potType"],
  language: PreflopUiLanguage,
) {
  return language === "vi" ? potTypeLabelsVi[potType] : potTypeLabelsEn[potType];
}

export function getPreflopStorageLabel(
  storageMode: PersistenceMode,
  language: PreflopUiLanguage,
) {
  if (language === "vi") {
    return storageMode === "account" ? "Đồng bộ đám mây" : "Máy này";
  }

  return storageMode === "account" ? "Cloud save" : "Local save";
}

export function getPreflopActionDisplay(action: CandidateAction) {
  const bbMatch = action.label.match(/(\d+(?:\.\d+)?)bb/i);
  const bbSize = bbMatch ? `${bbMatch[1]}bb` : null;

  if (/limp/i.test(action.label)) {
    return {
      primary: "Limp",
      secondary: bbSize,
    };
  }

  const primary = actionTypeLabels[action.actionType] ?? action.label;

  if (bbSize) {
    return {
      primary,
      secondary: bbSize,
    };
  }

  if (action.label !== primary) {
    return {
      primary,
      secondary: action.label,
    };
  }

  return {
    primary,
    secondary: null,
  };
}

export function getPreflopActionSummaryLabel(action: CandidateAction) {
  const display = getPreflopActionDisplay(action);
  return display.secondary
    ? `${display.primary} ${display.secondary}`
    : display.primary;
}

export function formatPreflopHistoryStep(
  step: string,
  language: PreflopUiLanguage,
) {
  if (step === "Unopened pot") {
    return language === "vi" ? "Chưa ai open" : "Unopened pot";
  }

  const openMatch = step.match(/^([A-Z]{2,3}) opens to (.+)$/);
  if (openMatch) {
    return `${openMatch[1]} open ${openMatch[2]}`;
  }

  const threeBetMatch = step.match(/^([A-Z]{2,3}) 3-bets to (.+)$/);
  if (threeBetMatch) {
    return `${threeBetMatch[1]} 3-bet ${threeBetMatch[2]}`;
  }

  const fourBetMatch = step.match(/^([A-Z]{2,3}) 4-bets to (.+)$/);
  if (fourBetMatch) {
    return `${fourBetMatch[1]} 4-bet ${fourBetMatch[2]}`;
  }

  return step;
}

type PreflopDrillCopy = {
  pageEyebrow: string;
  pageTitle: string;
  sessionLabel: string;
  sessionProgress: string;
  sessionAccuracy: string;
  allTimeAttempts: string;
  packLabel: string;
  difficultyLabel: string;
  queueLabel: string;
  retryLabel: string;
  savingLabel: string;
  syncIssueLabel: string;
  tableStateEyebrow: string;
  focusLabel: string;
  actionLaneLabel: string;
  heroLabel: string;
  heroValueLabel: string;
  positionLabel: string;
  villainLabel: string;
  handLabel: string;
  stackLabel: string;
  spotLabel: string;
  noVillainLabel: string;
  decisionEyebrow: string;
  decisionTitle: string;
  decisionHint: string;
  decisionSelectedHint: string;
  decisionLockedHint: string;
  selectedLineLabel: string;
  noLineSelected: string;
  submitLabel: string;
  nextSpotLabel: string;
  finishSessionLabel: string;
  restartLabel: string;
  reviewEyebrow: string;
  reviewPlaceholder: string;
  resultLabel: string;
  recommendedLineLabel: string;
  whyLabel: string;
  learnLabel: string;
  selectedTag: string;
  bestTag: string;
  correctLabel: string;
  incorrectLabel: string;
  driftLabel: string;
  assumptionLabel: string;
  emptyTitle: string;
  emptyBody: string;
  completionTitle: string;
  completionBody: string;
  completionAccuracy: string;
  completionCorrect: string;
  completionSaved: string;
  completionRestart: string;
  completionModeAccount: string;
  completionModeLocal: string;
};

const preflopDrillCopy: Record<PreflopUiLanguage, PreflopDrillCopy> = {
  vi: {
    pageEyebrow: "Bài luyện quyết định Preflop",
    pageTitle: "Đọc nhanh. Chốt nhanh.",
    sessionLabel: "Nhịp học",
    sessionProgress: "Tình huống",
    sessionAccuracy: "Đúng",
    allTimeAttempts: "Tổng lượt thử",
    packLabel: "Gói học",
    difficultyLabel: "Mức độ",
    queueLabel: "Thứ tự",
    retryLabel: "Cần ôn",
    savingLabel: "Đang lưu",
    syncIssueLabel: "Lỗi đồng bộ",
    tableStateEyebrow: "Trạng thái bàn",
    focusLabel: "Trọng tâm",
    actionLaneLabel: "Line trước đó",
    heroLabel: "Hero",
    heroValueLabel: "Bạn",
    positionLabel: "Vị trí",
    villainLabel: "Villain",
    handLabel: "Hand",
    stackLabel: "Stack",
    spotLabel: "Tình huống",
    noVillainLabel: "Blinds",
    decisionEyebrow: "Quyết định",
    decisionTitle: "Chọn line",
    decisionHint: "Bấm 1 line rồi chốt.",
    decisionSelectedHint: "Line đã sẵn. Bấm chốt để mở kết quả.",
    decisionLockedHint: "Line đã khóa. Xem sửa nhanh rồi qua tình huống tiếp.",
    selectedLineLabel: "Line đang chọn",
    noLineSelected: "Chưa chọn line",
    submitLabel: "Chốt",
    nextSpotLabel: "Tình huống tiếp",
    finishSessionLabel: "Kết thúc loạt",
    restartLabel: "Làm lại loạt",
    reviewEyebrow: "Sửa nhanh",
    reviewPlaceholder: "Chốt line để mở kết quả ngắn.",
    resultLabel: "Kết quả",
    recommendedLineLabel: "Line chuẩn",
    whyLabel: "Vì sao",
    learnLabel: "Điểm học",
    selectedTag: "Bạn chọn",
    bestTag: "Line chuẩn",
    correctLabel: "Đúng",
    incorrectLabel: "Sai",
    driftLabel: "Line đã lệch",
    assumptionLabel: "Giả định",
    emptyTitle: "Chưa có tình huống phù hợp",
    emptyBody: "Đổi gói hoặc mức để tiếp tục bài luyện.",
    completionTitle: "Loạt preflop hoàn tất",
    completionBody: "Nhịp đã xong. Có thể chạy lại ngay để khóa nhịp quyết định.",
    completionAccuracy: "Độ chính xác",
    completionCorrect: "Đúng / tổng",
    completionSaved: "Lưu lúc",
    completionRestart: "Chạy loạt mới",
    completionModeAccount: "Đã lưu đám mây",
    completionModeLocal: "Đã lưu máy này",
  },
  en: {
    pageEyebrow: "Preflop Decision Drill",
    pageTitle: "Read fast. Lock fast.",
    sessionLabel: "Session",
    sessionProgress: "Spot",
    sessionAccuracy: "Correct",
    allTimeAttempts: "All-time",
    packLabel: "Pack",
    difficultyLabel: "Level",
    queueLabel: "Order",
    retryLabel: "Weak spots",
    savingLabel: "Saving",
    syncIssueLabel: "Sync issue",
    tableStateEyebrow: "Table State",
    focusLabel: "Focus",
    actionLaneLabel: "Prior action",
    heroLabel: "Hero",
    heroValueLabel: "You",
    positionLabel: "Position",
    villainLabel: "Villain",
    handLabel: "Hand",
    stackLabel: "Stack",
    spotLabel: "Spot",
    noVillainLabel: "Blinds",
    decisionEyebrow: "Decision",
    decisionTitle: "Choose the line",
    decisionHint: "Pick one line and lock it.",
    decisionSelectedHint: "The line is ready. Lock it to open the result.",
    decisionLockedHint: "The line is locked. Review and move on.",
    selectedLineLabel: "Current line",
    noLineSelected: "No line selected",
    submitLabel: "Lock",
    nextSpotLabel: "Next spot",
    finishSessionLabel: "Finish set",
    restartLabel: "Restart set",
    reviewEyebrow: "Review",
    reviewPlaceholder: "Lock a line to open the short result and best line.",
    resultLabel: "Result",
    recommendedLineLabel: "Best line",
    whyLabel: "Why",
    learnLabel: "Takeaway",
    selectedTag: "Your line",
    bestTag: "Best line",
    correctLabel: "Correct",
    incorrectLabel: "Incorrect",
    driftLabel: "Where the line drifted",
    assumptionLabel: "Assumption",
    emptyTitle: "No matching spots",
    emptyBody: "Switch pack or level to keep drilling.",
    completionTitle: "Preflop set complete",
    completionBody: "The run is saved. Fire another set to lock the rhythm in.",
    completionAccuracy: "Accuracy",
    completionCorrect: "Correct / total",
    completionSaved: "Progress",
    completionRestart: "Run another set",
    completionModeAccount: "Saved to cloud",
    completionModeLocal: "Saved locally",
  },
};

export function getPreflopDrillCopy(language: PreflopUiLanguage) {
  return preflopDrillCopy[language];
}

export function getPreflopDecisionHint(
  phase: TrainingAnswerPhase,
  language: PreflopUiLanguage,
) {
  const copy = getPreflopDrillCopy(language);

  if (phase === "selected") {
    return copy.decisionSelectedHint;
  }

  if (phase === "revealed" || phase === "next-ready") {
    return copy.decisionLockedHint;
  }

  return copy.decisionHint;
}
