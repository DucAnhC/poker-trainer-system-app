import type {
  BoardTextureProfile,
  HandCategoryId,
  LeakTag,
  PlayerArchetypeId,
  PositionId,
} from "@/types/poker";

export type TrainingModuleId =
  | "preflop"
  | "pot-odds"
  | "board-texture"
  | "player-types"
  | "postflop"
  | "hand-review";

export type InteractiveTrainingModuleId =
  | "preflop"
  | "pot-odds"
  | "board-texture"
  | "player-types"
  | "postflop";

export const trainingModuleIds: TrainingModuleId[] = [
  "preflop",
  "pot-odds",
  "board-texture",
  "player-types",
  "postflop",
  "hand-review",
];

export interface TrainingModule {
  id: TrainingModuleId;
  title: string;
  route: string;
  summary: string;
  phaseStatus: "interactive" | "scaffolded" | "planned";
  learningFocus: string[];
  sourceTypeFocus: Array<SourceType>;
  ctaLabel?: string;
}

export type Difficulty = "beginner" | "intermediate" | "advanced-lite";
export const difficultyLevels: Difficulty[] = [
  "beginner",
  "intermediate",
  "advanced-lite",
];
export type PersistenceMode = "local" | "account";
export type TrainingDifficultyFilter = Difficulty | "all";
export type TrainerQueueMode = "adaptive" | "default";
export type TrainingAnswerPhase =
  | "idle"
  | "selected"
  | "revealed"
  | "next-ready";
export type SourceType = "simplification" | "baseline" | "exploit";
export type Street = "preflop" | "flop" | "turn" | "river" | "meta";
export type TrainingMode =
  | "quick-quiz"
  | "scenario-drill"
  | "preflop-trainer"
  | "pot-odds-quiz"
  | "board-texture-quiz"
  | "player-type-quiz";

export type TrainingActionType =
  | "open"
  | "check"
  | "bet"
  | "call"
  | "raise"
  | "3bet"
  | "4bet"
  | "fold"
  | "classify";

export interface CandidateAction {
  id: string;
  label: string;
  actionType: TrainingActionType;
  feedbackHint?: string;
}

export interface RationaleBlock {
  id: string;
  kind:
    | "answer"
    | "core-reason"
    | "context-factor"
    | "alternative-action"
    | "mistake-correction"
    | "assumption";
  title: string;
  body: string;
  emphasis?: "low" | "medium" | "high";
}

export interface TrainingScenarioBase {
  id: string;
  module: TrainingModuleId;
  contentPackId: string;
  mode: TrainingMode;
  title: string;
  learningGoal: string;
  prompt: string;
  street: Street;
  difficulty: Difficulty;
  sourceType: SourceType;
  keyConcepts: string[];
  tags: string[];
  assumptions: string[];
  rationaleBlocks: RationaleBlock[];
  candidateActions: CandidateAction[];
  recommendedActionId: string;
  mistakeTags: Array<LeakTag["id"]>;
  followUpPackIds?: string[];
  version: number;
  placeholderStatus?: "sample" | "draft";
}

export interface PreflopScenario extends TrainingScenarioBase {
  module: "preflop";
  street: "preflop";
  heroPosition: PositionId;
  villainPosition?: PositionId;
  handLabel: string;
  handCategory: HandCategoryId;
  effectiveStackBb: number;
  actionHistory: string[];
  potType: "unopened" | "vs-open" | "vs-3bet" | "vs-4bet";
}

export interface PostflopScenario extends TrainingScenarioBase {
  module: "pot-odds" | "board-texture" | "player-types" | "postflop";
  heroHand?: string;
  heroPosition?: PositionId;
  villainPosition?: PositionId;
  effectiveStackBb?: number;
  actionHistory?: string[];
  board?: BoardTextureProfile;
  playerArchetypeId?: PlayerArchetypeId;
  potSizeBb?: number;
  betToCallBb?: number;
  outsCount?: number;
  equityHint?: string;
}

export type TrainingScenario = PreflopScenario | PostflopScenario;

export interface QuizAttempt {
  id: string;
  sessionId: string;
  scenarioId: string;
  module: TrainingModuleId;
  selectedActionId: string;
  recommendedActionId: string;
  isCorrect: boolean;
  sourceType: SourceType;
  difficulty: Difficulty;
  mistakeTags: Array<LeakTag["id"]>;
  conceptTags: string[];
  createdAt: string;
}

export interface TrainingSession {
  id: string;
  module: TrainingModuleId;
  startedAt: string;
  lastActivityAt: string;
  completedAt?: string;
  scenarioIds: string[];
  correctCount: number;
  attemptIds: string[];
  surfacedLeakTags: Array<LeakTag["id"]>;
}

export interface TrainingSessionState {
  session: TrainingSession;
  currentScenarioIndex: number;
  completedScenarioIds: string[];
  lastAttemptId?: string;
  status: "ready" | "active" | "completed";
}

export type ReviewStreetFocus = Exclude<Street, "meta"> | "general";

export interface HandReviewNote {
  id: string;
  title: string;
  streetFocus: ReviewStreetFocus;
  heroPosition: PositionId | null;
  villainPosition: PositionId | null;
  effectiveStackBb: number | null;
  board: string;
  actionHistorySummary: string;
  chosenAction: string;
  uncertainty: string;
  note: string;
  leakTagIds: Array<LeakTag["id"]>;
  createdAt: string;
  updatedAt: string;
}

export interface ModuleProgressRecord {
  attempts: number;
  correctCount: number;
  lastCompletedAt: string | null;
  difficultyProgress: Record<Difficulty, DifficultyProgressRecord>;
}

export interface ProgressSummary {
  totalAttempts: number;
  correctCount: number;
  overallAccuracy: number;
  lastCompletedAt: string | null;
  difficultyProgress: Record<Difficulty, DifficultyProgressRecord>;
  moduleProgress: Record<TrainingModuleId, ModuleProgressRecord>;
  weakDifficultyAreas: WeakDifficultyArea[];
  contentPackProgress: ContentPackProgressSummary[];
  leakTagStats: LeakTagStat[];
  retryQueue: RetryQueueItem[];
  recentSessions: TrainingSessionSummary[];
  recentWeakSessions: TrainingSessionSummary[];
  weakestModules: WeakModuleSummary[];
  handReviewSummary: HandReviewSummary;
  recommendedFocusAreas: RecommendedFocusArea[];
  studyPath: StudyPathStep[];
}

export interface SubmittedAnswerFeedback {
  attempt: QuizAttempt;
  selectedAction: CandidateAction;
  recommendedAction: CandidateAction;
}

export interface LeakTagStat {
  leakTagId: LeakTag["id"];
  totalCount: number;
  trainingCount: number;
  reviewCount: number;
}

export interface TrainingSessionSummary {
  sessionId: string;
  moduleId: TrainingModuleId;
  modulesUsed: TrainingModuleId[];
  attemptedCount: number;
  correctCount: number;
  accuracy: number;
  topLeakTagIds: Array<LeakTag["id"]>;
  strengthNotes: string[];
  weaknessNotes: string[];
  startedAt: string;
  lastActivityAt: string;
  completedAt: string | null;
  status: "active" | "completed";
}

export interface HandReviewSummary {
  noteCount: number;
  lastUpdatedAt: string | null;
}

export interface DifficultyProgressRecord {
  attempts: number;
  correctCount: number;
  lastCompletedAt: string | null;
}

export interface WeakModuleSummary {
  moduleId: InteractiveTrainingModuleId;
  attempts: number;
  correctCount: number;
  accuracy: number;
  lastCompletedAt: string | null;
}

export interface WeakDifficultyArea {
  moduleId: InteractiveTrainingModuleId;
  difficulty: Difficulty;
  attempts: number;
  correctCount: number;
  accuracy: number;
}

export interface ContentPack {
  id: string;
  moduleId: InteractiveTrainingModuleId;
  title: string;
  focusLabel: string;
  summary: string;
  route: string;
  conceptTags: string[];
  difficultyFocus: Difficulty[];
  learningHighlights: string[];
  relatedPackIds: string[];
  studyPathOrder: number;
}

export interface ContentPackProgressSummary {
  contentPackId: string;
  moduleId: InteractiveTrainingModuleId;
  title: string;
  attempts: number;
  correctCount: number;
  accuracy: number;
  recentAttemptCount: number;
  recentAccuracy: number | null;
  lastCompletedAt: string | null;
  difficultyFocus: Difficulty[];
}

export interface RetryQueueItem {
  scenarioId: string;
  moduleId: InteractiveTrainingModuleId;
  contentPackId: string;
  title: string;
  difficulty: Difficulty;
  priorityScore: number;
  reason: string;
  supportingLeakTagIds: Array<LeakTag["id"]>;
  supportingConceptTags: string[];
}

export interface RecommendedFocusArea {
  moduleId: TrainingModuleId;
  title: string;
  reason: string;
  heuristicLabel: string;
  supportingLeakTagIds: Array<LeakTag["id"]>;
  supportingConceptTags?: string[];
  difficulty?: Difficulty | null;
  contentPackId?: string | null;
}

export interface StudyPathStep {
  contentPackId: string;
  moduleId: InteractiveTrainingModuleId;
  title: string;
  route: string;
  difficultyFocus: Difficulty[];
  status: "recommended" | "in-progress" | "up-next" | "completed" | "planned";
  reason: string;
}

export interface FollowUpSuggestion {
  id: string;
  moduleId: InteractiveTrainingModuleId;
  contentPackId: string;
  title: string;
  reason: string;
  route: string;
  tone: "review" | "related" | "advance";
}
