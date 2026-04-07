import type { Prisma } from "@prisma/client";

import {
  createEmptyLocalAppSnapshot,
  type LocalAppSnapshot,
} from "@/lib/persistence/local-app-snapshot";
import {
  createEmptyProgressSnapshot,
  normalizeQuizAttempt,
  normalizeTrainingSession,
  type ProgressSnapshot,
} from "@/lib/progress/local-progress-storage";
import { normalizeHandReviewNote } from "@/lib/review/local-hand-review-storage";
import { prisma } from "@/lib/server/prisma";
import type { HandReviewNote, QuizAttempt, TrainingSession } from "@/types/training";

function normalizeStringArray(value: Prisma.JsonValue | null | undefined) {
  if (!Array.isArray(value)) {
    return [] as string[];
  }

  return value.filter((entry): entry is string => typeof entry === "string");
}

function buildUpdatedAt(
  attempts: QuizAttempt[],
  sessions: TrainingSession[],
  notes: HandReviewNote[],
) {
  const timestamps = [
    ...attempts.map((attempt) => attempt.createdAt),
    ...sessions.map((session) => session.lastActivityAt),
    ...notes.map((note) => note.updatedAt),
  ];

  if (timestamps.length === 0) {
    return null;
  }

  return timestamps.sort((left, right) => right.localeCompare(left))[0] ?? null;
}

function mapAttemptRecord(record: {
  id: string;
  sessionId: string;
  scenarioId: string;
  module: string;
  selectedActionId: string;
  recommendedActionId: string;
  isCorrect: boolean;
  sourceType: string;
  difficulty: string;
  mistakeTags: Prisma.JsonValue;
  conceptTags: Prisma.JsonValue;
  createdAt: Date;
}) {
  return normalizeQuizAttempt({
    id: record.id,
    sessionId: record.sessionId,
    scenarioId: record.scenarioId,
    module: record.module as unknown,
    selectedActionId: record.selectedActionId,
    recommendedActionId: record.recommendedActionId,
    isCorrect: record.isCorrect,
    sourceType: record.sourceType as unknown,
    difficulty: record.difficulty as unknown,
    mistakeTags: normalizeStringArray(record.mistakeTags),
    conceptTags: normalizeStringArray(record.conceptTags),
    createdAt: record.createdAt.toISOString(),
  } as Partial<QuizAttempt>);
}

function mapTrainingSessionRecord(record: {
  id: string;
  module: string;
  startedAt: Date;
  lastActivityAt: Date;
  completedAt: Date | null;
  scenarioIds: Prisma.JsonValue;
  correctCount: number;
  attemptIds: Prisma.JsonValue;
  surfacedLeakTags: Prisma.JsonValue;
}) {
  return normalizeTrainingSession({
    id: record.id,
    module: record.module as unknown,
    startedAt: record.startedAt.toISOString(),
    lastActivityAt: record.lastActivityAt.toISOString(),
    completedAt: record.completedAt?.toISOString(),
    scenarioIds: normalizeStringArray(record.scenarioIds),
    correctCount: record.correctCount,
    attemptIds: normalizeStringArray(record.attemptIds),
    surfacedLeakTags: normalizeStringArray(record.surfacedLeakTags),
  } as Partial<TrainingSession>);
}

function mapHandReviewNoteRecord(record: {
  id: string;
  title: string;
  streetFocus: string;
  heroPosition: string | null;
  villainPosition: string | null;
  effectiveStackBb: number | null;
  board: string;
  actionHistorySummary: string;
  chosenAction: string;
  uncertainty: string;
  note: string;
  leakTagIds: Prisma.JsonValue;
  createdAt: Date;
  updatedAt: Date;
}) {
  return normalizeHandReviewNote({
    id: record.id,
    title: record.title,
    streetFocus: record.streetFocus as unknown,
    heroPosition: record.heroPosition as unknown,
    villainPosition: record.villainPosition as unknown,
    effectiveStackBb: record.effectiveStackBb,
    board: record.board,
    actionHistorySummary: record.actionHistorySummary,
    chosenAction: record.chosenAction,
    uncertainty: record.uncertainty,
    note: record.note,
    leakTagIds: normalizeStringArray(record.leakTagIds),
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
  } as Partial<HandReviewNote>);
}

function mergeStringArrays(...values: string[][]) {
  return [...new Set(values.flat())];
}

function serializeTrainingSession(trainingSession: TrainingSession) {
  return {
    module: trainingSession.module,
    startedAt: new Date(trainingSession.startedAt),
    lastActivityAt: new Date(trainingSession.lastActivityAt),
    completedAt: trainingSession.completedAt
      ? new Date(trainingSession.completedAt)
      : null,
    scenarioIds: trainingSession.scenarioIds,
    correctCount: trainingSession.correctCount,
    attemptIds: trainingSession.attemptIds,
    surfacedLeakTags: trainingSession.surfacedLeakTags,
  };
}

function serializeQuizAttempt(attempt: QuizAttempt) {
  return {
    sessionId: attempt.sessionId,
    scenarioId: attempt.scenarioId,
    module: attempt.module,
    selectedActionId: attempt.selectedActionId,
    recommendedActionId: attempt.recommendedActionId,
    isCorrect: attempt.isCorrect,
    sourceType: attempt.sourceType,
    difficulty: attempt.difficulty,
    mistakeTags: attempt.mistakeTags,
    conceptTags: attempt.conceptTags,
    createdAt: new Date(attempt.createdAt),
  };
}

function serializeHandReviewNote(note: HandReviewNote) {
  return {
    title: note.title,
    streetFocus: note.streetFocus,
    heroPosition: note.heroPosition,
    villainPosition: note.villainPosition,
    effectiveStackBb: note.effectiveStackBb,
    board: note.board,
    actionHistorySummary: note.actionHistorySummary,
    chosenAction: note.chosenAction,
    uncertainty: note.uncertainty,
    note: note.note,
    leakTagIds: note.leakTagIds,
    createdAt: new Date(note.createdAt),
    updatedAt: new Date(note.updatedAt),
  };
}

function mergeTrainingSession(
  existingSession: TrainingSession,
  incomingSession: TrainingSession,
) {
  const completedAt = [existingSession.completedAt, incomingSession.completedAt]
    .filter((value): value is string => typeof value === "string")
    .sort((left, right) => right.localeCompare(left))[0];

  return {
    ...incomingSession,
    startedAt:
      existingSession.startedAt.localeCompare(incomingSession.startedAt) <= 0
        ? existingSession.startedAt
        : incomingSession.startedAt,
    lastActivityAt:
      existingSession.lastActivityAt.localeCompare(incomingSession.lastActivityAt) >=
      0
        ? existingSession.lastActivityAt
        : incomingSession.lastActivityAt,
    completedAt,
    scenarioIds: incomingSession.scenarioIds.length
      ? incomingSession.scenarioIds
      : existingSession.scenarioIds,
    correctCount: Math.max(existingSession.correctCount, incomingSession.correctCount),
    attemptIds: mergeStringArrays(
      existingSession.attemptIds,
      incomingSession.attemptIds,
    ),
    surfacedLeakTags: mergeStringArrays(
      existingSession.surfacedLeakTags,
      incomingSession.surfacedLeakTags,
    ),
  };
}

export async function getUserAppSnapshot(
  userId: string,
): Promise<LocalAppSnapshot> {
  const [attemptRecords, sessionRecords, noteRecords] = await prisma.$transaction([
    prisma.trainingAttemptRecord.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    }),
    prisma.trainingSessionRecord.findMany({
      where: {
        userId,
      },
      orderBy: {
        lastActivityAt: "desc",
      },
    }),
    prisma.handReviewNoteRecord.findMany({
      where: {
        userId,
      },
      orderBy: {
        updatedAt: "desc",
      },
    }),
  ]);

  const attempts = attemptRecords
    .map((record) => mapAttemptRecord(record))
    .filter((attempt): attempt is QuizAttempt => attempt !== null);
  const sessions = sessionRecords
    .map((record) => mapTrainingSessionRecord(record))
    .filter((session): session is TrainingSession => session !== null);
  const handReviewNotes = noteRecords.map((record) =>
    mapHandReviewNoteRecord(record),
  );

  const progress: ProgressSnapshot = {
    attempts,
    sessions,
    updatedAt: buildUpdatedAt(attempts, sessions, handReviewNotes),
  };

  return {
    progress,
    handReviewNotes,
  };
}

export async function upsertUserQuizAttempt(
  userId: string,
  input: Partial<QuizAttempt> | null | undefined,
) {
  const attempt = normalizeQuizAttempt(input);

  if (!attempt) {
    throw new Error("INVALID_ATTEMPT");
  }

  await prisma.trainingAttemptRecord.upsert({
    where: {
      userId_id: {
        userId,
        id: attempt.id,
      },
    },
    create: {
      userId,
      id: attempt.id,
      ...serializeQuizAttempt(attempt),
    },
    update: serializeQuizAttempt(attempt),
  });

  return attempt;
}

export async function upsertUserTrainingSession(
  userId: string,
  input: Partial<TrainingSession> | null | undefined,
) {
  const normalizedSession = normalizeTrainingSession(input);

  if (!normalizedSession) {
    throw new Error("INVALID_SESSION");
  }

  const existingRecord = await prisma.trainingSessionRecord.findUnique({
    where: {
      userId_id: {
        userId,
        id: normalizedSession.id,
      },
    },
  });

  const existingSession = existingRecord
    ? mapTrainingSessionRecord(existingRecord)
    : null;
  const nextSession =
    existingSession && existingSession !== null
      ? mergeTrainingSession(existingSession, normalizedSession)
      : normalizedSession;

  await prisma.trainingSessionRecord.upsert({
    where: {
      userId_id: {
        userId,
        id: nextSession.id,
      },
    },
    create: {
      userId,
      id: nextSession.id,
      ...serializeTrainingSession(nextSession),
    },
    update: serializeTrainingSession(nextSession),
  });

  return nextSession;
}

export async function upsertUserHandReviewNote(
  userId: string,
  input: Partial<HandReviewNote> | null | undefined,
) {
  const normalizedNote = normalizeHandReviewNote(input ?? {});
  const existingRecord = await prisma.handReviewNoteRecord.findUnique({
    where: {
      userId_id: {
        userId,
        id: normalizedNote.id,
      },
    },
  });
  const existingNote = existingRecord
    ? mapHandReviewNoteRecord(existingRecord)
    : null;
  const nextNote =
    existingNote && existingNote.updatedAt.localeCompare(normalizedNote.updatedAt) > 0
      ? existingNote
      : normalizedNote;

  await prisma.handReviewNoteRecord.upsert({
    where: {
      userId_id: {
        userId,
        id: nextNote.id,
      },
    },
    create: {
      userId,
      id: nextNote.id,
      ...serializeHandReviewNote(nextNote),
    },
    update: serializeHandReviewNote(nextNote),
  });

  return nextNote;
}

export async function deleteUserHandReviewNote(userId: string, noteId: string) {
  await prisma.handReviewNoteRecord.deleteMany({
    where: {
      userId,
      id: noteId,
    },
  });
}

export async function mergeUserLocalSnapshotToCloud(
  userId: string,
  snapshot: Partial<LocalAppSnapshot> | null | undefined,
) {
  const safeSnapshot = snapshot ?? createEmptyLocalAppSnapshot();
  const progress = safeSnapshot.progress ?? createEmptyProgressSnapshot();
  const notes = Array.isArray(safeSnapshot.handReviewNotes)
    ? safeSnapshot.handReviewNotes
    : [];

  for (const trainingSession of progress.sessions) {
    await upsertUserTrainingSession(userId, trainingSession);
  }

  for (const attempt of progress.attempts) {
    await upsertUserQuizAttempt(userId, attempt);
  }

  for (const note of notes) {
    await upsertUserHandReviewNote(userId, note);
  }

  return getUserAppSnapshot(userId);
}
