import {
  difficultyLevels,
  trainingModuleIds,
  type Difficulty,
  type QuizAttempt,
  type SourceType,
  type TrainingSession,
  type TrainingModuleId,
} from "@/types/training";
import {
  readJsonStorageValue,
  removeStorageValue,
  writeJsonStorageValue,
} from "@/lib/persistence/local-storage";
import { progressStorageKey } from "@/lib/persistence/storage-keys";

export interface ProgressSnapshot {
  attempts: QuizAttempt[];
  sessions: TrainingSession[];
  updatedAt: string | null;
}

const trainingModuleIdSet = new Set<TrainingModuleId>(trainingModuleIds);
const difficultySet = new Set<Difficulty>(difficultyLevels);
const sourceTypeSet = new Set<SourceType>([
  "simplification",
  "baseline",
  "exploit",
]);

function normalizeTimestamp(value: unknown, fallback: string | null = null) {
  if (typeof value !== "string") {
    return fallback ?? new Date().toISOString();
  }

  const parsedValue = new Date(value);

  if (Number.isNaN(parsedValue.getTime())) {
    return fallback ?? new Date().toISOString();
  }

  return parsedValue.toISOString();
}

function normalizeStringArray(value: unknown) {
  if (!Array.isArray(value)) {
    return [] as string[];
  }

  return [...new Set(value.filter((entry): entry is string => typeof entry === "string"))];
}

function normalizeTrainingModuleId(value: unknown) {
  if (typeof value === "string" && trainingModuleIdSet.has(value as TrainingModuleId)) {
    return value as TrainingModuleId;
  }

  return null;
}

function normalizeDifficulty(value: unknown): Difficulty {
  if (value === "advanced") {
    return "advanced-lite";
  }

  if (typeof value === "string" && difficultySet.has(value as Difficulty)) {
    return value as Difficulty;
  }

  return "beginner";
}

function normalizeSourceType(value: unknown): SourceType {
  if (typeof value === "string" && sourceTypeSet.has(value as SourceType)) {
    return value as SourceType;
  }

  return "baseline";
}

export function normalizeQuizAttempt(
  attempt: Partial<QuizAttempt> | null | undefined,
): QuizAttempt | null {
  const id = typeof attempt?.id === "string" ? attempt.id : "";
  const sessionId =
    typeof attempt?.sessionId === "string" ? attempt.sessionId : "";
  const scenarioId =
    typeof attempt?.scenarioId === "string" ? attempt.scenarioId : "";
  const moduleId = normalizeTrainingModuleId(attempt?.module);
  const selectedActionId =
    typeof attempt?.selectedActionId === "string" ? attempt.selectedActionId : "";
  const recommendedActionId =
    typeof attempt?.recommendedActionId === "string"
      ? attempt.recommendedActionId
      : "";

  if (
    !id ||
    !sessionId ||
    !scenarioId ||
    !moduleId ||
    !selectedActionId ||
    !recommendedActionId
  ) {
    return null;
  }

  return {
    id,
    sessionId,
    scenarioId,
    module: moduleId,
    selectedActionId,
    recommendedActionId,
    isCorrect: Boolean(attempt?.isCorrect),
    sourceType: normalizeSourceType(attempt?.sourceType),
    difficulty: normalizeDifficulty(attempt?.difficulty),
    mistakeTags: normalizeStringArray(attempt?.mistakeTags),
    conceptTags: normalizeStringArray(attempt?.conceptTags),
    createdAt: normalizeTimestamp(attempt?.createdAt),
  };
}

export function normalizeTrainingSession(
  session: Partial<TrainingSession> | null | undefined,
): TrainingSession | null {
  const id = typeof session?.id === "string" ? session.id : "";
  const moduleId = normalizeTrainingModuleId(session?.module);

  if (!id || !moduleId) {
    return null;
  }

  const startedAt = normalizeTimestamp(session?.startedAt);
  const completedAt =
    typeof session?.completedAt === "string"
      ? normalizeTimestamp(session.completedAt, startedAt)
      : undefined;
  const lastActivityAt = normalizeTimestamp(
    session?.lastActivityAt,
    completedAt ?? startedAt,
  );

  return {
    id,
    module: moduleId,
    startedAt,
    lastActivityAt,
    completedAt,
    scenarioIds: normalizeStringArray(session?.scenarioIds),
    correctCount:
      typeof session?.correctCount === "number" && Number.isFinite(session.correctCount)
        ? Math.max(0, Math.round(session.correctCount))
        : 0,
    attemptIds: normalizeStringArray(session?.attemptIds),
    surfacedLeakTags: normalizeStringArray(session?.surfacedLeakTags),
  };
}

export function createEmptyProgressSnapshot(): ProgressSnapshot {
  return {
    attempts: [],
    sessions: [],
    updatedAt: null,
  };
}

function normalizeProgressSnapshot(
  snapshot: Partial<ProgressSnapshot> | null | undefined,
): ProgressSnapshot {
  return {
    attempts: Array.isArray(snapshot?.attempts)
      ? snapshot.attempts
          .map((attempt) => normalizeQuizAttempt(attempt))
          .filter((attempt): attempt is QuizAttempt => attempt !== null)
      : [],
    sessions: Array.isArray(snapshot?.sessions)
      ? snapshot.sessions
          .map((session) => normalizeTrainingSession(session))
          .filter((session): session is TrainingSession => session !== null)
      : [],
    updatedAt:
      typeof snapshot?.updatedAt === "string"
        ? normalizeTimestamp(snapshot.updatedAt)
        : null,
  };
}

export function readProgressSnapshot(): ProgressSnapshot {
  const parsedValue = readJsonStorageValue<Partial<ProgressSnapshot>>(
    progressStorageKey,
  );

  if (!parsedValue || typeof parsedValue !== "object") {
    return createEmptyProgressSnapshot();
  }

  return normalizeProgressSnapshot(parsedValue);
}

export function writeProgressSnapshot(snapshot: ProgressSnapshot) {
  const normalizedSnapshot = normalizeProgressSnapshot(snapshot);

  writeJsonStorageValue(
    progressStorageKey,
    {
      ...normalizedSnapshot,
      updatedAt: new Date().toISOString(),
    },
  );
}

export function replaceProgressSnapshot(
  snapshot: Partial<ProgressSnapshot> | null | undefined,
) {
  writeProgressSnapshot(normalizeProgressSnapshot(snapshot));
}

export function resetProgressSnapshot() {
  removeStorageValue(progressStorageKey);
}

export function recordQuizAttempt(attempt: QuizAttempt) {
  const snapshot = readProgressSnapshot();

  writeProgressSnapshot({
    ...snapshot,
    attempts: [...snapshot.attempts, attempt],
  });
}

export function recordTrainingSession(trainingSession: TrainingSession) {
  const snapshot = readProgressSnapshot();
  const existingIndex = snapshot.sessions.findIndex(
    (session) => session.id === trainingSession.id,
  );

  const nextSessions = [...snapshot.sessions];

  if (existingIndex >= 0) {
    nextSessions[existingIndex] = trainingSession;
  } else {
    nextSessions.push(trainingSession);
  }

  writeProgressSnapshot({
    ...snapshot,
    sessions: nextSessions,
  });
}
