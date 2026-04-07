import { trainingModules } from "@/data/training-modules";
import type {
  ProgressSummary,
  TrainingModule,
  TrainingModuleId,
} from "@/types/training";

export type FocusLens =
  | "all"
  | "weakest-modules"
  | "common-leaks"
  | "recent-mistakes";

export const focusLensOptions: FocusLens[] = [
  "all",
  "weakest-modules",
  "common-leaks",
  "recent-mistakes",
];

export function getModuleRoute(moduleId: TrainingModule["id"]) {
  return trainingModules.find((module) => module.id === moduleId)?.route ?? "/dashboard";
}

export function getFocusModuleIds(
  lens: FocusLens,
  progressSummary: ProgressSummary,
): TrainingModuleId[] {
  if (lens === "weakest-modules") {
    return progressSummary.weakestModules.map(
      (module) => module.moduleId as TrainingModuleId,
    );
  }

  if (lens === "common-leaks") {
    return [
      ...new Set(
        progressSummary.recommendedFocusAreas
          .filter((recommendation) => recommendation.supportingLeakTagIds.length > 0)
          .map((recommendation) => recommendation.moduleId),
      ),
    ];
  }

  if (lens === "recent-mistakes") {
    return [
      ...new Set(
        progressSummary.recentWeakSessions.map((session) => session.moduleId),
      ),
    ];
  }

  return [];
}

export function getOrderedModules(
  progressSummary: ProgressSummary,
  lens: FocusLens,
) {
  const focusModuleIds = new Set(getFocusModuleIds(lens, progressSummary));

  return [...trainingModules].sort((left, right) => {
    const leftFocused = focusModuleIds.has(left.id);
    const rightFocused = focusModuleIds.has(right.id);

    if (leftFocused !== rightFocused) {
      return leftFocused ? -1 : 1;
    }

    if (left.phaseStatus === right.phaseStatus) {
      return left.title.localeCompare(right.title);
    }

    return left.phaseStatus === "interactive" ? -1 : 1;
  });
}

export function getFilteredRecommendations(
  progressSummary: ProgressSummary,
  lens: FocusLens,
) {
  const recommendations = progressSummary.recommendedFocusAreas;

  if (lens === "weakest-modules") {
    const moduleIds = new Set<TrainingModuleId>(
      progressSummary.weakestModules.map((module) => module.moduleId),
    );
    const filtered = recommendations.filter((recommendation) =>
      moduleIds.has(recommendation.moduleId),
    );

    return filtered.length > 0 ? filtered : recommendations;
  }

  if (lens === "common-leaks") {
    const filtered = recommendations.filter(
      (recommendation) => recommendation.supportingLeakTagIds.length > 0,
    );

    return filtered.length > 0 ? filtered : recommendations;
  }

  if (lens === "recent-mistakes") {
    const moduleIds = new Set<TrainingModuleId>(
      progressSummary.recentWeakSessions.map((session) => session.moduleId),
    );
    const filtered = recommendations.filter((recommendation) =>
      moduleIds.has(recommendation.moduleId),
    );

    return filtered.length > 0 ? filtered : recommendations;
  }

  return recommendations;
}

export function getActiveSessionForModule(
  progressSummary: ProgressSummary,
  moduleId: TrainingModuleId,
) {
  return (
    progressSummary.recentSessions.find(
      (session) => session.moduleId === moduleId && session.status === "active",
    ) ?? null
  );
}

export function getLatestSession(progressSummary: ProgressSummary) {
  return (
    progressSummary.recentSessions.find((session) => session.attemptedCount > 0) ??
    progressSummary.recentSessions[0] ??
    null
  );
}

export function getHasAnyStoredActivity(progressSummary: ProgressSummary) {
  return (
    progressSummary.totalAttempts > 0 ||
    progressSummary.handReviewSummary.noteCount > 0 ||
    progressSummary.recentSessions.length > 0
  );
}

export function getLensLabel(lens: FocusLens) {
  if (lens === "weakest-modules") {
    return "Weakest modules";
  }

  if (lens === "common-leaks") {
    return "Most common leaks";
  }

  if (lens === "recent-mistakes") {
    return "Recent mistakes";
  }

  return "All study data";
}

export function getLensDescription(lens: FocusLens) {
  if (lens === "weakest-modules") {
    return "Sort the dashboard toward modules with the weakest saved accuracy so far.";
  }

  if (lens === "common-leaks") {
    return "Prioritize modules that line up with the repeat leak tags surfacing locally.";
  }

  if (lens === "recent-mistakes") {
    return "Bring recent weak sessions to the front so the latest misses are easier to revisit.";
  }

  return "Keep the full local picture visible across volume, leaks, sessions, and recommendations.";
}

export function getHighlightedModuleIds(
  lens: FocusLens,
  progressSummary: ProgressSummary,
) {
  return new Set(getFocusModuleIds(lens, progressSummary));
}
