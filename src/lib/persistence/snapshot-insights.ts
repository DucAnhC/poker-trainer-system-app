import type { LocalAppSnapshot } from "@/lib/persistence/local-app-snapshot";
import type { HandReviewNote, TrainingModuleId } from "@/types/training";

export interface AppSnapshotStats {
  attemptCount: number;
  sessionCount: number;
  completedSessionCount: number;
  activeSessionCount: number;
  reviewNoteCount: number;
  lastActivityAt: string | null;
}

export interface StudyAnalyticsSummary {
  attemptsLast7Days: number;
  completedSessionsLast30Days: number;
  reviewNotesLast30Days: number;
  activeStudyDaysLast14Days: number;
  activeModuleCount: number;
  lastReviewUpdatedAt: string | null;
  lastTrainingActivityAt: string | null;
}

function getLatestTimestamp(values: Array<string | null | undefined>) {
  const timestamps = values
    .filter((value): value is string => typeof value === "string" && value.length > 0)
    .sort((left, right) => right.localeCompare(left));

  return timestamps[0] ?? null;
}

function isOnOrAfterCutoff(value: string, cutoffTimestamp: number) {
  const parsedValue = new Date(value).getTime();

  if (Number.isNaN(parsedValue)) {
    return false;
  }

  return parsedValue >= cutoffTimestamp;
}

function getCutoffTimestamp(days: number) {
  return Date.now() - days * 24 * 60 * 60 * 1000;
}

export function getAppSnapshotStats(
  snapshot: LocalAppSnapshot,
): AppSnapshotStats {
  const { attempts, sessions, updatedAt } = snapshot.progress;

  return {
    attemptCount: attempts.length,
    sessionCount: sessions.length,
    completedSessionCount: sessions.filter((session) => Boolean(session.completedAt))
      .length,
    activeSessionCount: sessions.filter((session) => !session.completedAt).length,
    reviewNoteCount: snapshot.handReviewNotes.length,
    lastActivityAt: getLatestTimestamp([
      updatedAt,
      ...snapshot.handReviewNotes.map((note) => note.updatedAt),
    ]),
  };
}

export function hasAppSnapshotData(stats: AppSnapshotStats) {
  return (
    stats.attemptCount > 0 ||
    stats.sessionCount > 0 ||
    stats.reviewNoteCount > 0
  );
}

export function getRecentReviewNotes(
  notes: HandReviewNote[],
  limit = 3,
) {
  return [...notes]
    .sort((left, right) => right.updatedAt.localeCompare(left.updatedAt))
    .slice(0, limit);
}

export function getStudyAnalyticsSummary(
  snapshot: LocalAppSnapshot,
): StudyAnalyticsSummary {
  const attemptsLast7DaysCutoff = getCutoffTimestamp(7);
  const completedSessionsLast30DaysCutoff = getCutoffTimestamp(30);
  const reviewNotesLast30DaysCutoff = getCutoffTimestamp(30);
  const activeStudyDaysLast14DaysCutoff = getCutoffTimestamp(14);
  const activeModuleIds = new Set<TrainingModuleId>();
  const activityDays = new Set<string>();

  for (const attempt of snapshot.progress.attempts) {
    activeModuleIds.add(attempt.module);

    if (isOnOrAfterCutoff(attempt.createdAt, activeStudyDaysLast14DaysCutoff)) {
      activityDays.add(attempt.createdAt.slice(0, 10));
    }
  }

  for (const session of snapshot.progress.sessions) {
    activeModuleIds.add(session.module);

    if (isOnOrAfterCutoff(session.lastActivityAt, activeStudyDaysLast14DaysCutoff)) {
      activityDays.add(session.lastActivityAt.slice(0, 10));
    }
  }

  for (const note of snapshot.handReviewNotes) {
    if (isOnOrAfterCutoff(note.updatedAt, activeStudyDaysLast14DaysCutoff)) {
      activityDays.add(note.updatedAt.slice(0, 10));
    }
  }

  return {
    attemptsLast7Days: snapshot.progress.attempts.filter((attempt) =>
      isOnOrAfterCutoff(attempt.createdAt, attemptsLast7DaysCutoff),
    ).length,
    completedSessionsLast30Days: snapshot.progress.sessions.filter(
      (session) =>
        Boolean(session.completedAt) &&
        isOnOrAfterCutoff(
          session.completedAt ?? session.lastActivityAt,
          completedSessionsLast30DaysCutoff,
        ),
    ).length,
    reviewNotesLast30Days: snapshot.handReviewNotes.filter((note) =>
      isOnOrAfterCutoff(note.updatedAt, reviewNotesLast30DaysCutoff),
    ).length,
    activeStudyDaysLast14Days: activityDays.size,
    activeModuleCount: activeModuleIds.size,
    lastReviewUpdatedAt: getLatestTimestamp(
      snapshot.handReviewNotes.map((note) => note.updatedAt),
    ),
    lastTrainingActivityAt: getLatestTimestamp([
      snapshot.progress.updatedAt,
      ...snapshot.progress.sessions.map((session) => session.lastActivityAt),
      ...snapshot.progress.attempts.map((attempt) => attempt.createdAt),
    ]),
  };
}
