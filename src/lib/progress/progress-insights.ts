import {
  contentPacks,
  contentPackMap,
  getContentPackRoute,
} from "@/data/content-packs";
import { leakTagMap } from "@/data/leak-tags";
import { allScenarios, scenarioMap } from "@/data/scenarios";
import { readLocalAppSnapshot } from "@/lib/persistence/local-app-snapshot";
import {
  difficultyLabels,
  moduleLabels,
} from "@/lib/poker/labels";
import { calculateAccuracy } from "@/lib/progress/metrics";
import { type ProgressSnapshot } from "@/lib/progress/local-progress-storage";
import { getReviewNoteFocusAreas } from "@/lib/review/review-focus";
import type {
  ContentPackProgressSummary,
  Difficulty,
  DifficultyProgressRecord,
  HandReviewNote,
  HandReviewSummary,
  InteractiveTrainingModuleId,
  LeakTagStat,
  ModuleProgressRecord,
  ProgressSummary,
  QuizAttempt,
  RecommendedFocusArea,
  RetryQueueItem,
  StudyPathStep,
  TrainingModuleId,
  TrainingSession,
  TrainingSessionSummary,
  WeakDifficultyArea,
  WeakModuleSummary,
} from "@/types/training";
import { difficultyLevels, trainingModuleIds } from "@/types/training";

const scoredTrainingModules: InteractiveTrainingModuleId[] = [
  "preflop",
  "pot-odds",
  "board-texture",
  "player-types",
  "postflop",
];

type RecommendationCandidate = RecommendedFocusArea & {
  score: number;
};

const recentPackAttemptWindow = 5;

function incrementCount(map: Map<string, number>, key: string, amount = 1) {
  map.set(key, (map.get(key) ?? 0) + amount);
}

function createEmptyDifficultyProgressRecord(): DifficultyProgressRecord {
  return {
    attempts: 0,
    correctCount: 0,
    lastCompletedAt: null,
  };
}

function createEmptyDifficultyProgressMap() {
  const record = {} as Record<Difficulty, DifficultyProgressRecord>;

  for (const difficulty of difficultyLevels) {
    record[difficulty] = createEmptyDifficultyProgressRecord();
  }

  return record;
}

function createEmptyModuleProgressRecord(): ModuleProgressRecord {
  return {
    attempts: 0,
    correctCount: 0,
    lastCompletedAt: null,
    difficultyProgress: createEmptyDifficultyProgressMap(),
  };
}

function createEmptyHandReviewSummary(): HandReviewSummary {
  return {
    noteCount: 0,
    lastUpdatedAt: null,
  };
}

function getTopLeakTagIdsFromCounts(
  counts: Map<string, number>,
  fallbackIds: string[] = [],
  limit = 3,
) {
  const topIds = [...counts.entries()]
    .sort((left, right) => right[1] - left[1])
    .slice(0, limit)
    .map(([leakTagId]) => leakTagId);

  if (topIds.length > 0) {
    return topIds;
  }

  return fallbackIds.slice(0, limit);
}

function buildStrengthNotes(
  moduleId: TrainingModuleId,
  accuracy: number,
  attemptedCount: number,
  topLeakTagIds: string[],
) {
  const notes: string[] = [];

  if (attemptedCount === 0) {
    return notes;
  }

  if (accuracy >= 80) {
    notes.push(`Recent accuracy was strong in ${moduleLabels[moduleId]}.`);
  } else if (accuracy >= 60) {
    notes.push(
      `You converted more than half of the recent spots in ${moduleLabels[moduleId]}.`,
    );
  } else {
    notes.push(`You completed a full recent run in ${moduleLabels[moduleId]}.`);
  }

  if (topLeakTagIds.length === 0) {
    notes.push("No repeat leak tags surfaced strongly in this run.");
  }

  return notes.slice(0, 2);
}

function buildWeaknessNotes(
  moduleId: TrainingModuleId,
  accuracy: number,
  topLeakTagIds: string[],
) {
  const notes: string[] = [];

  if (accuracy < 60) {
    notes.push(
      `Accuracy dipped below the current training target in ${moduleLabels[moduleId]}.`,
    );
  }

  if (topLeakTagIds.length > 0) {
    const leadLeakTag = leakTagMap[topLeakTagIds[0]];

    if (leadLeakTag) {
      notes.push(`Most missed spots pointed to ${leadLeakTag.label.toLowerCase()}.`);
    }
  }

  return notes.slice(0, 2);
}

function buildHandReviewSummary(notes: HandReviewNote[]) {
  const summary = createEmptyHandReviewSummary();

  summary.noteCount = notes.length;

  for (const note of notes) {
    if (!summary.lastUpdatedAt || note.updatedAt > summary.lastUpdatedAt) {
      summary.lastUpdatedAt = note.updatedAt;
    }
  }

  return summary;
}

function buildLeakTagStats(
  attempts: QuizAttempt[],
  notes: HandReviewNote[],
): LeakTagStat[] {
  const counts = new Map<
    string,
    {
      trainingCount: number;
      reviewCount: number;
    }
  >();

  for (const attempt of attempts) {
    for (const leakTagId of attempt.mistakeTags) {
      const currentValue = counts.get(leakTagId) ?? {
        trainingCount: 0,
        reviewCount: 0,
      };

      currentValue.trainingCount += 1;
      counts.set(leakTagId, currentValue);
    }
  }

  for (const note of notes) {
    for (const leakTagId of note.leakTagIds) {
      const currentValue = counts.get(leakTagId) ?? {
        trainingCount: 0,
        reviewCount: 0,
      };

      currentValue.reviewCount += 1;
      counts.set(leakTagId, currentValue);
    }
  }

  return [...counts.entries()]
    .map(([leakTagId, value]) => ({
      leakTagId,
      totalCount: value.trainingCount + value.reviewCount,
      trainingCount: value.trainingCount,
      reviewCount: value.reviewCount,
    }))
    .sort((left, right) => right.totalCount - left.totalCount);
}

function buildSessionSummary(
  trainingSession: TrainingSession,
  sessionAttempts: QuizAttempt[],
): TrainingSessionSummary {
  const attemptedCount = sessionAttempts.length || trainingSession.attemptIds.length;
  const correctCount =
    sessionAttempts.filter((attempt) => attempt.isCorrect).length ||
    trainingSession.correctCount;
  const accuracy = calculateAccuracy(correctCount, attemptedCount);
  const leakCounts = new Map<string, number>();

  for (const attempt of sessionAttempts) {
    for (const leakTagId of attempt.mistakeTags) {
      incrementCount(leakCounts, leakTagId);
    }
  }

  const topLeakTagIds = getTopLeakTagIdsFromCounts(
    leakCounts,
    trainingSession.surfacedLeakTags,
  );

  return {
    sessionId: trainingSession.id,
    moduleId: trainingSession.module,
    modulesUsed: [trainingSession.module],
    attemptedCount,
    correctCount,
    accuracy,
    topLeakTagIds,
    strengthNotes: buildStrengthNotes(
      trainingSession.module,
      accuracy,
      attemptedCount,
      topLeakTagIds,
    ),
    weaknessNotes: buildWeaknessNotes(
      trainingSession.module,
      accuracy,
      topLeakTagIds,
    ),
    startedAt: trainingSession.startedAt,
    lastActivityAt: trainingSession.lastActivityAt,
    completedAt: trainingSession.completedAt ?? null,
    status: trainingSession.completedAt ? "completed" : "active",
  };
}

function buildRecentSessionSummaries(snapshot: ProgressSnapshot) {
  const attemptsBySessionId = new Map<string, QuizAttempt[]>();

  for (const attempt of snapshot.attempts) {
    const currentAttempts = attemptsBySessionId.get(attempt.sessionId) ?? [];
    currentAttempts.push(attempt);
    attemptsBySessionId.set(attempt.sessionId, currentAttempts);
  }

  return [...snapshot.sessions]
    .map((trainingSession) =>
      buildSessionSummary(
        trainingSession,
        attemptsBySessionId.get(trainingSession.id) ?? [],
      ),
    )
    .sort((left, right) => right.lastActivityAt.localeCompare(left.lastActivityAt));
}

function buildRecentWeakSessions(recentSessions: TrainingSessionSummary[]) {
  return recentSessions
    .filter(
      (session) =>
        session.attemptedCount > 0 &&
        (session.accuracy < 70 || session.topLeakTagIds.length > 0),
    )
    .slice(0, 4);
}

function buildWeakestModules(
  moduleProgress: Record<TrainingModuleId, ModuleProgressRecord>,
): WeakModuleSummary[] {
  return scoredTrainingModules
    .map((moduleId) => {
      const progress = moduleProgress[moduleId];
      const accuracy = calculateAccuracy(progress.correctCount, progress.attempts);

      return {
        moduleId,
        attempts: progress.attempts,
        correctCount: progress.correctCount,
        accuracy,
        lastCompletedAt: progress.lastCompletedAt,
      };
    })
    .filter((moduleInsight) => moduleInsight.attempts > 0)
    .sort((left, right) => {
      if (left.accuracy === right.accuracy) {
        if (left.attempts === right.attempts) {
          return (right.lastCompletedAt ?? "").localeCompare(left.lastCompletedAt ?? "");
        }

        return right.attempts - left.attempts;
      }

      return left.accuracy - right.accuracy;
    })
    .slice(0, 3);
}

function buildWeakDifficultyAreas(
  moduleProgress: Record<TrainingModuleId, ModuleProgressRecord>,
): WeakDifficultyArea[] {
  const areas: WeakDifficultyArea[] = [];

  for (const moduleId of scoredTrainingModules) {
    const difficultyProgress = moduleProgress[moduleId].difficultyProgress;

    for (const difficulty of difficultyLevels) {
      const progress = difficultyProgress[difficulty];

      if (progress.attempts === 0) {
        continue;
      }

      const accuracy = calculateAccuracy(progress.correctCount, progress.attempts);

      areas.push({
        moduleId,
        difficulty,
        attempts: progress.attempts,
        correctCount: progress.correctCount,
        accuracy,
      });
    }
  }

  return areas
    .sort((left, right) => {
      if (left.accuracy === right.accuracy) {
        return right.attempts - left.attempts;
      }

      return left.accuracy - right.accuracy;
    })
    .slice(0, 6);
}

function buildContentPackProgress(
  snapshot: ProgressSnapshot,
): ContentPackProgressSummary[] {
  const progressByPackId = new Map<string, ContentPackProgressSummary>();
  const attemptsByPackId = new Map<string, QuizAttempt[]>();

  for (const contentPack of contentPacks) {
    progressByPackId.set(contentPack.id, {
      contentPackId: contentPack.id,
      moduleId: contentPack.moduleId,
      title: contentPack.title,
      attempts: 0,
      correctCount: 0,
      accuracy: 0,
      recentAttemptCount: 0,
      recentAccuracy: null,
      lastCompletedAt: null,
      difficultyFocus: contentPack.difficultyFocus,
    });
  }

  for (const attempt of snapshot.attempts) {
    const scenario = scenarioMap[attempt.scenarioId];

    if (!scenario) {
      continue;
    }

    const contentPackProgress = progressByPackId.get(scenario.contentPackId);

    if (!contentPackProgress) {
      continue;
    }

    const currentAttempts = attemptsByPackId.get(scenario.contentPackId) ?? [];
    currentAttempts.push(attempt);
    attemptsByPackId.set(scenario.contentPackId, currentAttempts);

    contentPackProgress.attempts += 1;

    if (attempt.isCorrect) {
      contentPackProgress.correctCount += 1;
    }

    if (
      !contentPackProgress.lastCompletedAt ||
      attempt.createdAt > contentPackProgress.lastCompletedAt
    ) {
      contentPackProgress.lastCompletedAt = attempt.createdAt;
    }
  }

  return [...progressByPackId.values()].map((contentPackProgress) => ({
    ...contentPackProgress,
    accuracy: calculateAccuracy(
      contentPackProgress.correctCount,
      contentPackProgress.attempts,
    ),
    recentAttemptCount: (
      attemptsByPackId.get(contentPackProgress.contentPackId) ?? []
    )
      .sort((left, right) => right.createdAt.localeCompare(left.createdAt))
      .slice(0, recentPackAttemptWindow).length,
    recentAccuracy: (() => {
      const recentAttempts = (
        attemptsByPackId.get(contentPackProgress.contentPackId) ?? []
      )
        .sort((left, right) => right.createdAt.localeCompare(left.createdAt))
        .slice(0, recentPackAttemptWindow);

      if (recentAttempts.length === 0) {
        return null;
      }

      return calculateAccuracy(
        recentAttempts.filter((attempt) => attempt.isCorrect).length,
        recentAttempts.length,
      );
    })(),
  }));
}

function buildRetryQueue(
  snapshot: ProgressSnapshot,
  leakTagStats: LeakTagStat[],
): RetryQueueItem[] {
  const attemptsByScenarioId = new Map<string, QuizAttempt[]>();
  const leakTagWeights = new Map<string, number>();

  for (const leakTagStat of leakTagStats) {
    leakTagWeights.set(leakTagStat.leakTagId, leakTagStat.trainingCount);
  }

  for (const attempt of snapshot.attempts) {
    const currentAttempts = attemptsByScenarioId.get(attempt.scenarioId) ?? [];
    currentAttempts.push(attempt);
    attemptsByScenarioId.set(attempt.scenarioId, currentAttempts);
  }

  return allScenarios
    .map((scenario) => {
      const scenarioAttempts = [
        ...(attemptsByScenarioId.get(scenario.id) ?? []),
      ].sort((left, right) => right.createdAt.localeCompare(left.createdAt));
      const exactWrongCount = scenarioAttempts.filter((attempt) => !attempt.isCorrect).length;
      const exactCorrectCount = scenarioAttempts.filter((attempt) => attempt.isCorrect).length;
      const recentWrongCount = scenarioAttempts
        .slice(0, 3)
        .filter((attempt) => !attempt.isCorrect).length;
      const relatedConceptMissCount = snapshot.attempts.filter(
        (attempt) =>
          !attempt.isCorrect &&
          attempt.module === scenario.module &&
          attempt.conceptTags.some((tag) => scenario.keyConcepts.includes(tag)),
      ).length;
      const supportingLeakTagIds = scenario.mistakeTags.filter(
        (leakTagId) => (leakTagWeights.get(leakTagId) ?? 0) > 0,
      );
      const leakWeight = supportingLeakTagIds.reduce(
        (totalWeight, leakTagId) => totalWeight + (leakTagWeights.get(leakTagId) ?? 0),
        0,
      );

      let priorityScore =
        exactWrongCount * 6 +
        recentWrongCount * 4 +
        Math.max(0, relatedConceptMissCount - exactCorrectCount) +
        Math.min(leakWeight, 8);

      if (exactCorrectCount > exactWrongCount && recentWrongCount === 0) {
        priorityScore -= 4;
      }

      if (priorityScore <= 0) {
        return null;
      }

      let reason = "You missed similar concepts in this module recently.";

      if (recentWrongCount >= 2) {
        reason = "You missed this exact spot more than once recently.";
      } else if (exactWrongCount >= 2) {
        reason = "This exact scenario has produced repeat misses.";
      } else if (supportingLeakTagIds.length > 0) {
        reason = "This scenario matches one of your repeat leak themes.";
      }

      return {
        scenarioId: scenario.id,
        moduleId: scenario.module as InteractiveTrainingModuleId,
        contentPackId: scenario.contentPackId,
        title: scenario.title,
        difficulty: scenario.difficulty,
        priorityScore,
        reason,
        supportingLeakTagIds,
        supportingConceptTags: scenario.keyConcepts.slice(0, 4),
      } satisfies RetryQueueItem;
    })
    .filter((item): item is RetryQueueItem => item !== null)
    .sort((left, right) => {
      if (left.priorityScore === right.priorityScore) {
        return left.title.localeCompare(right.title);
      }

      return right.priorityScore - left.priorityScore;
    })
    .slice(0, 10);
}

function addRecommendationCandidate(
  candidates: Map<TrainingModuleId, RecommendationCandidate>,
  candidate: RecommendationCandidate,
) {
  const existingCandidate = candidates.get(candidate.moduleId);

  if (!existingCandidate) {
    candidates.set(candidate.moduleId, candidate);
    return;
  }

  const mergedSupportingLeakTagIds = [
    ...new Set([
      ...existingCandidate.supportingLeakTagIds,
      ...candidate.supportingLeakTagIds,
    ]),
  ];

  if (candidate.score > existingCandidate.score) {
    candidates.set(candidate.moduleId, {
      ...candidate,
      supportingLeakTagIds: mergedSupportingLeakTagIds,
    });
    return;
  }

  candidates.set(candidate.moduleId, {
    ...existingCandidate,
    supportingLeakTagIds: mergedSupportingLeakTagIds,
  });
}

function getContentPackProgressMap(
  contentPackProgress: ContentPackProgressSummary[],
) {
  return new Map(
    contentPackProgress.map((contentPackEntry) => [
      contentPackEntry.contentPackId,
      contentPackEntry,
    ]),
  );
}

function getRecommendationPackScore(input: {
  contentPackId: string;
  progressByPackId: Map<string, ContentPackProgressSummary>;
  preferredDifficulty?: Difficulty | null;
}) {
  const contentPack = contentPackMap[input.contentPackId];
  const progress = input.progressByPackId.get(input.contentPackId);

  if (!contentPack) {
    return Number.NEGATIVE_INFINITY;
  }

  let score = 0;

  if (
    input.preferredDifficulty &&
    contentPack.difficultyFocus.includes(input.preferredDifficulty)
  ) {
    score += 26;
  }

  if (contentPack.difficultyFocus.includes("beginner")) {
    score += 8;
  }

  if (!progress) {
    return score;
  }

  if (progress.attempts > 0) {
    score += 14;
    score += Math.max(0, 100 - progress.accuracy);
  }

  if (progress.recentAccuracy !== null) {
    score += Math.max(0, 92 - progress.recentAccuracy);

    if (progress.recentAccuracy >= progress.accuracy + 10) {
      score -= 10;
    }
  }

  return score;
}

function pickRelevantContentPack(input: {
  moduleId: InteractiveTrainingModuleId;
  progressByPackId: Map<string, ContentPackProgressSummary>;
  preferredDifficulty?: Difficulty | null;
}) {
  const preferredPacks = contentPacks.filter(
    (contentPack) =>
      contentPack.moduleId === input.moduleId &&
      (!input.preferredDifficulty ||
        contentPack.difficultyFocus.includes(input.preferredDifficulty)),
  );
  const candidatePacks =
    preferredPacks.length > 0
      ? preferredPacks
      : contentPacks.filter((contentPack) => contentPack.moduleId === input.moduleId);

  if (candidatePacks.length === 0) {
    return null;
  }

  return [...candidatePacks].sort((left, right) => {
    const leftScore = getRecommendationPackScore({
      contentPackId: left.id,
      progressByPackId: input.progressByPackId,
      preferredDifficulty: input.preferredDifficulty,
    });
    const rightScore = getRecommendationPackScore({
      contentPackId: right.id,
      progressByPackId: input.progressByPackId,
      preferredDifficulty: input.preferredDifficulty,
    });

    if (leftScore === rightScore) {
      return left.studyPathOrder - right.studyPathOrder;
    }

    return rightScore - leftScore;
  })[0];
}

function getSupportingConceptTags(contentPackId: string | null | undefined) {
  if (!contentPackId) {
    return [];
  }

  return contentPackMap[contentPackId]?.conceptTags.slice(0, 4) ?? [];
}

function buildRecommendedFocusAreas(
  summary: Omit<ProgressSummary, "recommendedFocusAreas" | "studyPath">,
  handReviewNotes: HandReviewNote[],
): RecommendedFocusArea[] {
  const candidates = new Map<TrainingModuleId, RecommendationCandidate>();
  const progressByPackId = getContentPackProgressMap(summary.contentPackProgress);

  if (summary.totalAttempts === 0 && handReviewNotes.length === 0) {
    return [
      {
        moduleId: "preflop",
        title: contentPackMap["preflop-position-basics"].title,
        reason:
          "Start with Preflop Basics to build position and range discipline before layering more context.",
        heuristicLabel: "Getting started heuristic",
        supportingLeakTagIds: [],
        supportingConceptTags: getSupportingConceptTags(
          "preflop-position-basics",
        ),
        difficulty: "beginner",
        contentPackId: "preflop-position-basics",
      },
    ];
  }

  for (const weakDifficultyArea of summary.weakDifficultyAreas.slice(0, 5)) {
    const contentPack = pickRelevantContentPack({
      moduleId: weakDifficultyArea.moduleId,
      progressByPackId,
      preferredDifficulty: weakDifficultyArea.difficulty,
    });
    const packProgress = contentPack
      ? progressByPackId.get(contentPack.id)
      : null;

    if (!contentPack || weakDifficultyArea.attempts < 2 || weakDifficultyArea.accuracy >= 75) {
      continue;
    }

    const isPackImproving =
      packProgress !== undefined &&
      packProgress !== null &&
      packProgress.recentAccuracy !== null &&
      packProgress.recentAccuracy > weakDifficultyArea.accuracy + 10;

    addRecommendationCandidate(candidates, {
      moduleId: weakDifficultyArea.moduleId,
      title: contentPack.title,
      reason:
        isPackImproving
          ? `${difficultyLabels[weakDifficultyArea.difficulty]} spots in ${contentPack.title} are improving recently, but the saved accuracy is still only ${Math.round(
              weakDifficultyArea.accuracy,
            )}% across ${weakDifficultyArea.attempts} attempts.`
          : `${difficultyLabels[weakDifficultyArea.difficulty]} spots in ${contentPack.title} are currently landing at ${Math.round(
              weakDifficultyArea.accuracy,
            )}% accuracy across ${weakDifficultyArea.attempts} attempts.`,
      heuristicLabel: "Difficulty heuristic",
      supportingLeakTagIds: [],
      supportingConceptTags: contentPack.conceptTags.slice(0, 4),
      difficulty: weakDifficultyArea.difficulty,
      contentPackId: contentPack.id,
      score:
        135 -
        weakDifficultyArea.accuracy +
        weakDifficultyArea.attempts -
        (isPackImproving ? 8 : 0),
    });
  }

  for (const weakModule of summary.weakestModules) {
    if (weakModule.attempts < 2 || weakModule.accuracy >= 72) {
      continue;
    }

    const contentPack = pickRelevantContentPack({
      moduleId: weakModule.moduleId,
      progressByPackId,
    });

    addRecommendationCandidate(candidates, {
      moduleId: weakModule.moduleId,
      title: contentPack?.title ?? moduleLabels[weakModule.moduleId],
      reason: `${moduleLabels[weakModule.moduleId]} accuracy is currently ${Math.round(
        weakModule.accuracy,
      )}% across ${weakModule.attempts} attempts.`,
      heuristicLabel: "Accuracy heuristic",
      supportingLeakTagIds: [],
      supportingConceptTags: contentPack?.conceptTags.slice(0, 4) ?? [],
      difficulty: null,
      contentPackId: contentPack?.id ?? null,
      score: 118 - weakModule.accuracy,
    });
  }

  for (const moduleId of scoredTrainingModules) {
    if (summary.moduleProgress[moduleId].attempts > 0) {
      continue;
    }

    const starterPack = pickRelevantContentPack({
      moduleId,
      progressByPackId,
      preferredDifficulty: "beginner",
    });

    if (!starterPack) {
      continue;
    }

    addRecommendationCandidate(candidates, {
      moduleId,
      title: starterPack.title,
      reason: `You have not started ${starterPack.title} yet, so it is a clean foundational pack to add next.`,
      heuristicLabel: "Coverage heuristic",
      supportingLeakTagIds: [],
      supportingConceptTags: starterPack.conceptTags.slice(0, 4),
      difficulty: "beginner",
      contentPackId: starterPack.id,
      score: 34,
    });
  }

  for (const weakSession of summary.recentWeakSessions.slice(0, 3)) {
    const contentPack = pickRelevantContentPack({
      moduleId: weakSession.moduleId as InteractiveTrainingModuleId,
      progressByPackId,
    });

    addRecommendationCandidate(candidates, {
      moduleId: weakSession.moduleId,
      title: contentPack?.title ?? moduleLabels[weakSession.moduleId],
      reason: `A recent ${moduleLabels[weakSession.moduleId].toLowerCase()} session landed at ${Math.round(
        weakSession.accuracy,
      )}% accuracy.`,
      heuristicLabel: "Recent session heuristic",
      supportingLeakTagIds: weakSession.topLeakTagIds,
      supportingConceptTags: contentPack?.conceptTags.slice(0, 4) ?? [],
      difficulty: null,
      contentPackId: contentPack?.id ?? null,
      score: 84 - weakSession.accuracy + weakSession.topLeakTagIds.length * 4,
    });
  }

  for (const leakTagStat of summary.leakTagStats.slice(0, 6)) {
    const leakTag = leakTagMap[leakTagStat.leakTagId];

    if (!leakTag) {
      continue;
    }

    for (const moduleId of leakTag.moduleFocus) {
      if (moduleId === "hand-review") {
        continue;
      }

      const contentPack = pickRelevantContentPack({
        moduleId,
        progressByPackId,
      });

      addRecommendationCandidate(candidates, {
        moduleId,
        title: contentPack?.title ?? moduleLabels[moduleId],
        reason: `Recent leak tags keep pointing to ${leakTag.label.toLowerCase()}.`,
        heuristicLabel: "Leak-tag heuristic",
        supportingLeakTagIds: [leakTag.id],
        supportingConceptTags: contentPack?.conceptTags.slice(0, 4) ?? [],
        difficulty: null,
        contentPackId: contentPack?.id ?? null,
        score: 60 + leakTagStat.totalCount * 8,
      });
    }
  }

  for (const retryItem of summary.retryQueue.slice(0, 5)) {
    const contentPack = contentPackMap[retryItem.contentPackId];

    addRecommendationCandidate(candidates, {
      moduleId: retryItem.moduleId,
      title: contentPack?.title ?? moduleLabels[retryItem.moduleId],
      reason: `${retryItem.reason} A ${difficultyLabels[
        retryItem.difficulty
      ].toLowerCase()} spot in ${contentPack?.title ?? moduleLabels[retryItem.moduleId]} is a good short review target.`,
      heuristicLabel: "Retry heuristic",
      supportingLeakTagIds: retryItem.supportingLeakTagIds,
      supportingConceptTags: retryItem.supportingConceptTags,
      difficulty: retryItem.difficulty,
      contentPackId: retryItem.contentPackId,
      score: 58 + retryItem.priorityScore,
    });
  }

  for (const contentPackProgress of [...summary.contentPackProgress]
    .filter(
      (contentPackEntry) =>
        contentPackEntry.attempts >= 2 && contentPackEntry.accuracy < 72,
    )
    .sort((left, right) => {
      if (left.accuracy === right.accuracy) {
        return right.attempts - left.attempts;
      }

      return left.accuracy - right.accuracy;
    })
    .slice(0, 4)) {
    const currentPack = contentPackMap[contentPackProgress.contentPackId];
    const relatedPack = currentPack?.relatedPackIds
      .map((relatedPackId) => contentPackMap[relatedPackId])
      .find((candidatePack) => Boolean(candidatePack));

    if (!currentPack || !relatedPack) {
      continue;
    }

    addRecommendationCandidate(candidates, {
      moduleId: relatedPack.moduleId,
      title: relatedPack.title,
      reason: `${currentPack.title} has been trending weak, and ${relatedPack.title} trains the adjacent concept that most naturally supports it.`,
      heuristicLabel: "Concept-link heuristic",
      supportingLeakTagIds: [],
      supportingConceptTags: [
        ...new Set([
          ...currentPack.conceptTags,
          ...relatedPack.conceptTags,
        ]),
      ].slice(0, 4),
      difficulty: relatedPack.difficultyFocus[0] ?? null,
      contentPackId: relatedPack.id,
      score: 42 + (72 - contentPackProgress.accuracy),
    });
  }

  if (summary.totalAttempts >= 4 && summary.handReviewSummary.noteCount === 0) {
    addRecommendationCandidate(candidates, {
      moduleId: "hand-review",
      title: moduleLabels["hand-review"],
      reason:
        "You already have training volume saved locally, but no structured hand review notes yet.",
      heuristicLabel: "Review habit heuristic",
      supportingLeakTagIds: [],
      difficulty: null,
      contentPackId: null,
      score: 72,
    });
  }

  for (const handReviewNote of handReviewNotes.slice(0, 6)) {
    for (const reviewFocusArea of getReviewNoteFocusAreas(handReviewNote, 2)) {
      const contentPack =
        reviewFocusArea.moduleId === "hand-review"
          ? null
          : pickRelevantContentPack({
              moduleId: reviewFocusArea.moduleId,
              progressByPackId,
              preferredDifficulty: "beginner",
            });

      addRecommendationCandidate(candidates, {
        ...reviewFocusArea,
        difficulty: "beginner",
        contentPackId: contentPack?.id ?? null,
        supportingConceptTags: contentPack?.conceptTags.slice(0, 4) ?? [],
        score:
          reviewFocusArea.moduleId === "postflop"
            ? 78
            : reviewFocusArea.moduleId === "pot-odds"
              ? 74
              : 68,
      });
    }
  }

  return [...candidates.values()]
    .sort((left, right) => right.score - left.score)
    .slice(0, 4)
    .map(({ score: _score, ...candidate }) => candidate);
}

function buildStudyPath(
  summary: Omit<ProgressSummary, "studyPath">,
): StudyPathStep[] {
  let hasMarkedUpNext = false;

  return [...contentPacks]
    .sort((left, right) => left.studyPathOrder - right.studyPathOrder)
    .map((contentPack) => {
      const contentPackProgress = summary.contentPackProgress.find(
        (entry) => entry.contentPackId === contentPack.id,
      );
      const recommendation = summary.recommendedFocusAreas.find(
        (entry) =>
          entry.contentPackId === contentPack.id ||
          (entry.contentPackId === null && entry.moduleId === contentPack.moduleId),
      );

      let status: StudyPathStep["status"] = "planned";
      let reason =
        "Keep this as a later step while the earlier fundamentals settle.";

      if (
        contentPackProgress &&
        contentPackProgress.attempts >= 3 &&
        contentPackProgress.accuracy >= 75
      ) {
        status = "completed";
        reason = `${contentPackProgress.attempts} attempts logged here with ${Math.round(
          contentPackProgress.accuracy,
        )}% accuracy.`;
      } else if (recommendation) {
        status = "recommended";
        reason = recommendation.reason;
      } else if (contentPackProgress && contentPackProgress.attempts > 0) {
        status = "in-progress";
        reason = `You already started ${contentPack.title}. Keep building consistency before pushing harder.`;
      } else if (!hasMarkedUpNext) {
        status = "up-next";
        reason =
          "This is the clean next study layer once the earlier packs feel stable.";
        hasMarkedUpNext = true;
      }

      return {
        contentPackId: contentPack.id,
        moduleId: contentPack.moduleId,
        title: contentPack.title,
        route: getContentPackRoute(contentPack.id),
        difficultyFocus: contentPack.difficultyFocus,
        status,
        reason,
      };
    });
}

export function createEmptyProgressSummary(): ProgressSummary {
  const moduleProgress = {} as Record<TrainingModuleId, ModuleProgressRecord>;

  for (const moduleId of trainingModuleIds) {
    moduleProgress[moduleId] = createEmptyModuleProgressRecord();
  }

  return {
    totalAttempts: 0,
    correctCount: 0,
    overallAccuracy: 0,
    lastCompletedAt: null,
    difficultyProgress: createEmptyDifficultyProgressMap(),
    moduleProgress,
    weakDifficultyAreas: [],
    contentPackProgress: [],
    leakTagStats: [],
    retryQueue: [],
    recentSessions: [],
    recentWeakSessions: [],
    weakestModules: [],
    handReviewSummary: createEmptyHandReviewSummary(),
    recommendedFocusAreas: [],
    studyPath: [],
  };
}

export function buildLiveTrainingSessionSummary(input: {
  moduleId: TrainingModuleId;
  attemptedCount: number;
  correctCount: number;
  surfacedLeakTagIds: string[];
  startedAt: string;
  lastActivityAt: string;
  completedAt: string | null;
}): TrainingSessionSummary {
  const accuracy = calculateAccuracy(input.correctCount, input.attemptedCount);
  const topLeakTagIds = input.surfacedLeakTagIds.slice(0, 3);

  return {
    sessionId: `live-${input.moduleId}`,
    moduleId: input.moduleId,
    modulesUsed: [input.moduleId],
    attemptedCount: input.attemptedCount,
    correctCount: input.correctCount,
    accuracy,
    topLeakTagIds,
    strengthNotes: buildStrengthNotes(
      input.moduleId,
      accuracy,
      input.attemptedCount,
      topLeakTagIds,
    ),
    weaknessNotes: buildWeaknessNotes(input.moduleId, accuracy, topLeakTagIds),
    startedAt: input.startedAt,
    lastActivityAt: input.lastActivityAt,
    completedAt: input.completedAt,
    status: input.completedAt ? "completed" : "active",
  };
}

export function getProgressSummary(
  snapshot?: ProgressSnapshot,
  handReviewNotes?: HandReviewNote[],
): ProgressSummary {
  const localAppSnapshot =
    snapshot && handReviewNotes
      ? null
      : readLocalAppSnapshot();
  const resolvedSnapshot = snapshot ?? localAppSnapshot?.progress ?? {
    attempts: [],
    sessions: [],
    updatedAt: null,
  };
  const resolvedHandReviewNotes =
    handReviewNotes ?? localAppSnapshot?.handReviewNotes ?? [];
  const summary = createEmptyProgressSummary();

  for (const attempt of resolvedSnapshot.attempts) {
    summary.totalAttempts += 1;

    if (attempt.isCorrect) {
      summary.correctCount += 1;
    }

    const moduleRecord = summary.moduleProgress[attempt.module];
    moduleRecord.attempts += 1;

    if (attempt.isCorrect) {
      moduleRecord.correctCount += 1;
    }

    const moduleDifficultyRecord = moduleRecord.difficultyProgress[attempt.difficulty];
    moduleDifficultyRecord.attempts += 1;

    if (attempt.isCorrect) {
      moduleDifficultyRecord.correctCount += 1;
    }

    const difficultyRecord = summary.difficultyProgress[attempt.difficulty];
    difficultyRecord.attempts += 1;

    if (attempt.isCorrect) {
      difficultyRecord.correctCount += 1;
    }
  }

  for (const trainingSession of resolvedSnapshot.sessions) {
    if (!trainingSession.completedAt) {
      continue;
    }

    const moduleRecord = summary.moduleProgress[trainingSession.module];

    if (
      !moduleRecord.lastCompletedAt ||
      trainingSession.completedAt > moduleRecord.lastCompletedAt
    ) {
      moduleRecord.lastCompletedAt = trainingSession.completedAt;
    }

    if (
      !summary.lastCompletedAt ||
      trainingSession.completedAt > summary.lastCompletedAt
    ) {
      summary.lastCompletedAt = trainingSession.completedAt;
    }

    const scenarioDifficulties = [
      ...new Set(
        trainingSession.scenarioIds
          .map((scenarioId) => scenarioMap[scenarioId]?.difficulty)
          .filter((difficulty): difficulty is Difficulty => Boolean(difficulty)),
      ),
    ];

    for (const difficulty of scenarioDifficulties) {
      const moduleDifficultyRecord = moduleRecord.difficultyProgress[difficulty];

      if (
        !moduleDifficultyRecord.lastCompletedAt ||
        trainingSession.completedAt > moduleDifficultyRecord.lastCompletedAt
      ) {
        moduleDifficultyRecord.lastCompletedAt = trainingSession.completedAt;
      }

      const difficultyRecord = summary.difficultyProgress[difficulty];

      if (
        !difficultyRecord.lastCompletedAt ||
        trainingSession.completedAt > difficultyRecord.lastCompletedAt
      ) {
        difficultyRecord.lastCompletedAt = trainingSession.completedAt;
      }
    }
  }

  summary.overallAccuracy = calculateAccuracy(
    summary.correctCount,
    summary.totalAttempts,
  );
  summary.leakTagStats = buildLeakTagStats(
    resolvedSnapshot.attempts,
    resolvedHandReviewNotes,
  );
  summary.contentPackProgress = buildContentPackProgress(resolvedSnapshot);
  summary.retryQueue = buildRetryQueue(resolvedSnapshot, summary.leakTagStats);
  summary.recentSessions = buildRecentSessionSummaries(resolvedSnapshot);
  summary.recentWeakSessions = buildRecentWeakSessions(summary.recentSessions);
  summary.weakestModules = buildWeakestModules(summary.moduleProgress);
  summary.weakDifficultyAreas = buildWeakDifficultyAreas(summary.moduleProgress);
  summary.handReviewSummary = buildHandReviewSummary(resolvedHandReviewNotes);
  summary.recommendedFocusAreas = buildRecommendedFocusAreas(
    summary,
    resolvedHandReviewNotes,
  );
  summary.studyPath = buildStudyPath(summary);

  return summary;
}

export function getTopLeakTagDefinitions(
  leakTagStats: LeakTagStat[],
  limit = 3,
) {
  return leakTagStats
    .slice(0, limit)
    .map((leakTagStat) => {
      const leakTag = leakTagMap[leakTagStat.leakTagId];

      if (!leakTag) {
        return null;
      }

      return {
        ...leakTagStat,
        leakTag,
      };
    })
    .filter((entry): entry is NonNullable<typeof entry> => entry !== null);
}
