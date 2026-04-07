import {
  contentPackMap,
  contentPacks,
  getContentPackRoute,
  getContentPacksForModule,
} from "@/data/content-packs";
import type {
  FollowUpSuggestion,
  ProgressSummary,
  TrainingScenario,
} from "@/types/training";

type SuggestionCandidate = FollowUpSuggestion & {
  score: number;
};

function addCandidate(
  candidates: Map<string, SuggestionCandidate>,
  candidate: SuggestionCandidate,
) {
  const existingCandidate = candidates.get(candidate.contentPackId);

  if (!existingCandidate || candidate.score > existingCandidate.score) {
    candidates.set(candidate.contentPackId, candidate);
  }
}

function getNextSameModulePack(scenario: TrainingScenario) {
  const currentPack = contentPackMap[scenario.contentPackId];

  if (!currentPack) {
    return null;
  }

  return getContentPacksForModule(currentPack.moduleId).find(
    (contentPack) =>
      contentPack.id !== currentPack.id &&
      contentPack.studyPathOrder > currentPack.studyPathOrder,
  ) ?? null;
}

function getFoundationalPack(scenario: TrainingScenario) {
  const currentPack = contentPackMap[scenario.contentPackId];

  if (!currentPack) {
    return null;
  }

  return (
    getContentPacksForModule(currentPack.moduleId).find(
      (contentPack) =>
        contentPack.id !== currentPack.id &&
        contentPack.difficultyFocus.includes("beginner"),
    ) ?? null
  );
}

export function getScenarioFollowUpSuggestions(input: {
  scenario: TrainingScenario;
  isCorrect: boolean;
  progressSummary: ProgressSummary;
}): FollowUpSuggestion[] {
  const { scenario, isCorrect, progressSummary } = input;
  const currentPack = contentPackMap[scenario.contentPackId];
  const candidates = new Map<string, SuggestionCandidate>();

  if (!currentPack) {
    return [];
  }

  if (!isCorrect) {
    addCandidate(candidates, {
      id: `${scenario.id}-retry-current-pack`,
      moduleId: currentPack.moduleId,
      contentPackId: currentPack.id,
      title: `Retry ${currentPack.title}`,
      reason:
        "Adaptive order will resurface similar weak spots from this pack sooner, which is the cleanest first response after a miss.",
      route: getContentPackRoute(currentPack.id),
      tone: "review",
      score: 120,
    });

    if (scenario.difficulty !== "beginner") {
      const foundationalPack = getFoundationalPack(scenario);

      if (foundationalPack) {
        addCandidate(candidates, {
          id: `${scenario.id}-foundation-pack`,
          moduleId: foundationalPack.moduleId,
          contentPackId: foundationalPack.id,
          title: foundationalPack.title,
          reason:
            "Step down one layer and isolate the cleaner foundational version of the same concept before coming back to the tougher spot.",
          route: getContentPackRoute(foundationalPack.id),
          tone: "review",
          score: 105,
        });
      }
    }
  } else {
    const nextSameModulePack = getNextSameModulePack(scenario);

    if (nextSameModulePack) {
      addCandidate(candidates, {
        id: `${scenario.id}-next-pack`,
        moduleId: nextSameModulePack.moduleId,
        contentPackId: nextSameModulePack.id,
        title: nextSameModulePack.title,
        reason:
          "You handled the current concept cleanly, so the next logical step is a nearby pack that adds a little more judgment.",
        route: getContentPackRoute(nextSameModulePack.id),
        tone: "advance",
        score: 100,
      });
    }
  }

  for (const followUpPackId of scenario.followUpPackIds ?? currentPack.relatedPackIds) {
    const relatedPack = contentPackMap[followUpPackId];

    if (!relatedPack) {
      continue;
    }

    const matchingRecommendation = progressSummary.recommendedFocusAreas.find(
      (recommendation) => recommendation.contentPackId === relatedPack.id,
    );
    const matchingPackProgress = progressSummary.contentPackProgress.find(
      (contentPackProgress) => contentPackProgress.contentPackId === relatedPack.id,
    );
    const hasWeakSignal =
      matchingPackProgress &&
      matchingPackProgress.attempts > 0 &&
      matchingPackProgress.accuracy < 75;

    addCandidate(candidates, {
      id: `${scenario.id}-${relatedPack.id}-related-pack`,
      moduleId: relatedPack.moduleId,
      contentPackId: relatedPack.id,
      title: relatedPack.title,
      reason:
        matchingRecommendation?.reason ??
        (hasWeakSignal
          ? `This related pack is already trending weak, so revisiting the linked concept should help the next study block stay coherent.`
          : `This pack trains the adjacent concept that most naturally supports the spot you just worked on.`),
      route: getContentPackRoute(relatedPack.id),
      tone: isCorrect ? "advance" : "related",
      score: matchingRecommendation ? 96 : hasWeakSignal ? 88 : 74,
    });
  }

  return [...candidates.values()]
    .sort((left, right) => right.score - left.score)
    .slice(0, 3)
    .map(({ score: _score, ...candidate }) => candidate);
}

export function getRelatedContentPacks(contentPackId: string) {
  const currentPack = contentPackMap[contentPackId];

  if (!currentPack) {
    return [];
  }

  return currentPack.relatedPackIds
    .map((relatedPackId) => contentPackMap[relatedPackId])
    .filter((contentPack): contentPack is NonNullable<typeof contentPack> =>
      Boolean(contentPack),
    );
}

export function getPackScenarioDensity(contentPackId: string) {
  return contentPacks.find((contentPack) => contentPack.id === contentPackId)
    ?.learningHighlights.length ?? 0;
}
