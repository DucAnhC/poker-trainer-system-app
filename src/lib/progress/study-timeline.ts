import { trainingModules } from "@/data/training-modules";
import { moduleLabels } from "@/lib/poker/labels";
import type { HandReviewNote, TrainingSessionSummary } from "@/types/training";

export type StudyTimelineEntry = {
  id: string;
  kind: "session" | "review";
  timestamp: string;
  route: string;
  title: string;
  description: string;
  badgeLabel: string;
  tone: "accent" | "success" | "gold";
  contextLabel: string;
  metricLabel: string;
  leakTagIds: string[];
  actionLabel: string;
};

function getModuleRoute(moduleId: TrainingSessionSummary["moduleId"]) {
  return trainingModules.find((module) => module.id === moduleId)?.route ?? "/dashboard";
}

function truncateText(value: string, maxLength = 150) {
  if (value.length <= maxLength) {
    return value;
  }

  return `${value.slice(0, maxLength - 1).trimEnd()}...`;
}

function buildSessionTimelineEntry(
  session: TrainingSessionSummary,
): StudyTimelineEntry {
  const isStrongCompletedSession =
    session.status === "completed" && session.accuracy >= 80;
  const isActiveSession = session.status === "active";
  const primaryNote =
    isActiveSession
      ? "The study block is still open, so you can jump back in without losing the saved context."
      : session.accuracy < 65
        ? session.weaknessNotes[0]
        : session.strengthNotes[0];

  return {
    id: `session:${session.sessionId}`,
    kind: "session",
    timestamp: session.lastActivityAt,
    route: getModuleRoute(session.moduleId),
    title: moduleLabels[session.moduleId],
    description:
      primaryNote ??
      `Saved ${moduleLabels[session.moduleId].toLowerCase()} session summary.`,
    badgeLabel: isActiveSession
      ? "Active session"
      : isStrongCompletedSession
        ? "Strong session"
        : "Completed session",
    tone: isActiveSession ? "accent" : isStrongCompletedSession ? "success" : "gold",
    contextLabel: moduleLabels[session.moduleId],
    metricLabel: `${session.attemptedCount} attempted • ${Math.round(
      session.accuracy,
    )}% accuracy`,
    leakTagIds: session.topLeakTagIds.slice(0, 2),
    actionLabel: isActiveSession ? "Resume module" : "Open module",
  };
}

function buildReviewTimelineEntry(note: HandReviewNote): StudyTimelineEntry {
  const summaryText =
    note.uncertainty.trim() ||
    note.note.trim() ||
    "Structured review note saved for later study.";

  return {
    id: `review:${note.id}`,
    kind: "review",
    timestamp: note.updatedAt,
    route: "/review",
    title: note.title,
    description: truncateText(summaryText),
    badgeLabel:
      note.leakTagIds.length > 0 ? "Tagged review" : "Review note",
    tone: note.leakTagIds.length > 0 ? "gold" : "accent",
    contextLabel: `${note.streetFocus} focus`,
    metricLabel:
      note.chosenAction.trim().length > 0
        ? `Chosen action: ${note.chosenAction}`
        : "Structured hand review",
    leakTagIds: note.leakTagIds.slice(0, 2),
    actionLabel: "Open review",
  };
}

export function getStudyTimelineEntries(input: {
  sessions: TrainingSessionSummary[];
  notes: HandReviewNote[];
  limit?: number;
}) {
  const { sessions, notes, limit = 8 } = input;

  return [
    ...sessions.map(buildSessionTimelineEntry),
    ...notes.map(buildReviewTimelineEntry),
  ]
    .sort((left, right) => right.timestamp.localeCompare(left.timestamp))
    .slice(0, limit);
}
