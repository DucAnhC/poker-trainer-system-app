import { describe, expect, it } from "vitest";

import {
  getFilteredRecommendations,
  getHasAnyStoredActivity,
  getOrderedModules,
} from "@/features/progress/dashboard-selectors";
import { createEmptyProgressSummary } from "@/lib/progress/progress-insights";

describe("dashboard selectors", () => {
  it("surfaces activity only when attempts, reviews, or sessions exist", () => {
    const emptySummary = createEmptyProgressSummary();

    expect(getHasAnyStoredActivity(emptySummary)).toBe(false);

    const attemptSummary = createEmptyProgressSummary();
    attemptSummary.totalAttempts = 1;

    expect(getHasAnyStoredActivity(attemptSummary)).toBe(true);
  });

  it("filters and orders modules around the chosen focus lens", () => {
    const summary = createEmptyProgressSummary();
    summary.weakestModules = [
      {
        moduleId: "postflop",
        attempts: 6,
        correctCount: 2,
        accuracy: 33.3,
        lastCompletedAt: "2026-04-06T09:00:00.000Z",
      },
    ];
    summary.recentWeakSessions = [
      {
        sessionId: "session-1",
        moduleId: "pot-odds",
        modulesUsed: ["pot-odds"],
        attemptedCount: 3,
        correctCount: 1,
        accuracy: 33.3,
        topLeakTagIds: ["poor-pot-odds-intuition"],
        strengthNotes: [],
        weaknessNotes: ["Recent misses clustered around pot odds."],
        startedAt: "2026-04-05T08:00:00.000Z",
        lastActivityAt: "2026-04-05T08:15:00.000Z",
        completedAt: "2026-04-05T08:15:00.000Z",
        status: "completed",
      },
    ];
    summary.recommendedFocusAreas = [
      {
        moduleId: "postflop",
        title: "Postflop Turn Discipline",
        reason: "Recent postflop accuracy is weak.",
        heuristicLabel: "Accuracy heuristic",
        supportingLeakTagIds: [],
        supportingConceptTags: ["postflop"],
        difficulty: "intermediate",
        contentPackId: "postflop-turn-discipline",
      },
      {
        moduleId: "pot-odds",
        title: "Pot Odds Fundamentals",
        reason: "Recent leak tags keep pointing to poor pot-odds intuition.",
        heuristicLabel: "Leak-tag heuristic",
        supportingLeakTagIds: ["poor-pot-odds-intuition"],
        supportingConceptTags: ["pot-odds"],
        difficulty: "beginner",
        contentPackId: "pot-odds-fundamentals",
      },
    ];

    const weakestModules = getOrderedModules(summary, "weakest-modules");
    const leakRecommendations = getFilteredRecommendations(summary, "common-leaks");
    const recentMistakesRecommendations = getFilteredRecommendations(
      summary,
      "recent-mistakes",
    );

    expect(weakestModules[0]?.id).toBe("postflop");
    expect(leakRecommendations).toHaveLength(1);
    expect(leakRecommendations[0]?.moduleId).toBe("pot-odds");
    expect(recentMistakesRecommendations[0]?.moduleId).toBe("pot-odds");
  });
});
