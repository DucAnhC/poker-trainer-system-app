import { describe, expect, it } from "vitest";

import {
  buildLiveTrainingSessionSummary,
  getProgressSummary,
  getRecurringMistakeInsights,
  getTopLeakTagDefinitions,
} from "@/lib/progress/progress-insights";
import type { HandReviewNote } from "@/types/training";

describe("progress insights", () => {
  it("builds a progress summary from attempts, sessions, and review notes", () => {
    const reviewNotes: HandReviewNote[] = [
      {
        id: "review-1",
        title: "Button call versus UTG open",
        streetFocus: "preflop",
        heroPosition: "BTN",
        villainPosition: "UTG",
        effectiveStackBb: 100,
        board: "",
        actionHistorySummary: "UTG opens, button holds AJo.",
        chosenAction: "Called",
        uncertainty: "Am I defending too wide here?",
        note: "Need cleaner dominated-hand discipline.",
        leakTagIds: ["ignored-position"],
        createdAt: "2026-04-04T09:00:00.000Z",
        updatedAt: "2026-04-04T10:00:00.000Z",
      },
    ];

    const summary = getProgressSummary(
      {
        attempts: [
          {
            id: "attempt-preflop-wrong",
            sessionId: "session-preflop",
            scenarioId: "preflop-btn-vs-utg-ajo",
            module: "preflop",
            selectedActionId: "call",
            recommendedActionId: "fold",
            isCorrect: false,
            sourceType: "simplification",
            difficulty: "intermediate",
            mistakeTags: ["called-too-wide", "ignored-position"],
            conceptTags: ["vs-open", "domination"],
            createdAt: "2026-04-06T09:00:00.000Z",
          },
          {
            id: "attempt-preflop-right",
            sessionId: "session-preflop",
            scenarioId: "preflop-co-ajo-open-100bb",
            module: "preflop",
            selectedActionId: "open-2.5x",
            recommendedActionId: "open-2.5x",
            isCorrect: true,
            sourceType: "baseline",
            difficulty: "beginner",
            mistakeTags: [],
            conceptTags: ["positions", "opening-ranges"],
            createdAt: "2026-04-06T09:02:00.000Z",
          },
          {
            id: "attempt-pot-odds-wrong",
            sessionId: "session-pot-odds",
            scenarioId: "pot-odds-gutshot-turn-overbet",
            module: "pot-odds",
            selectedActionId: "call",
            recommendedActionId: "fold",
            isCorrect: false,
            sourceType: "simplification",
            difficulty: "advanced-lite",
            mistakeTags: ["poor-pot-odds-intuition", "chased-bad-draw"],
            conceptTags: ["pot-odds", "turn-play", "implied-odds"],
            createdAt: "2026-04-05T08:30:00.000Z",
          },
        ],
        sessions: [
          {
            id: "session-preflop",
            module: "preflop",
            startedAt: "2026-04-06T08:55:00.000Z",
            lastActivityAt: "2026-04-06T09:05:00.000Z",
            completedAt: "2026-04-06T09:05:00.000Z",
            scenarioIds: [
              "preflop-btn-vs-utg-ajo",
              "preflop-co-ajo-open-100bb",
            ],
            correctCount: 1,
            attemptIds: ["attempt-preflop-wrong", "attempt-preflop-right"],
            surfacedLeakTags: ["called-too-wide", "ignored-position"],
          },
          {
            id: "session-pot-odds",
            module: "pot-odds",
            startedAt: "2026-04-05T08:20:00.000Z",
            lastActivityAt: "2026-04-05T08:30:00.000Z",
            scenarioIds: ["pot-odds-gutshot-turn-overbet"],
            correctCount: 0,
            attemptIds: ["attempt-pot-odds-wrong"],
            surfacedLeakTags: ["poor-pot-odds-intuition"],
          },
        ],
        updatedAt: "2026-04-06T09:05:00.000Z",
      },
      reviewNotes,
    );

    expect(summary.totalAttempts).toBe(3);
    expect(summary.correctCount).toBe(1);
    expect(summary.overallAccuracy).toBeCloseTo(33.333, 2);
    expect(summary.moduleProgress.preflop.attempts).toBe(2);
    expect(summary.moduleProgress["pot-odds"].attempts).toBe(1);
    expect(summary.handReviewSummary.noteCount).toBe(1);
    expect(summary.weakestModules[0]?.moduleId).toBe("pot-odds");
    expect(summary.leakTagStats[0]?.leakTagId).toBe("ignored-position");

    const preflopAggressionPack = summary.contentPackProgress.find(
      (entry) => entry.contentPackId === "preflop-facing-aggression",
    );
    const potOddsTurnPack = summary.contentPackProgress.find(
      (entry) => entry.contentPackId === "pot-odds-turn-pressure",
    );

    expect(preflopAggressionPack).toMatchObject({
      attempts: 1,
      correctCount: 0,
      accuracy: 0,
    });
    expect(potOddsTurnPack).toMatchObject({
      attempts: 1,
      correctCount: 0,
      accuracy: 0,
    });
    expect(summary.retryQueue.map((item) => item.scenarioId)).toContain(
      "pot-odds-gutshot-turn-overbet",
    );
    expect(summary.recommendedFocusAreas.some((item) => item.moduleId === "pot-odds")).toBe(
      true,
    );
  });

  it("builds a live session summary without persisted storage", () => {
    const summary = buildLiveTrainingSessionSummary({
      moduleId: "postflop",
      attemptedCount: 4,
      correctCount: 3,
      surfacedLeakTagIds: ["poor-pot-control", "missed-value-bets"],
      startedAt: "2026-04-07T09:00:00.000Z",
      lastActivityAt: "2026-04-07T09:12:00.000Z",
      completedAt: "2026-04-07T09:12:00.000Z",
    });

    expect(summary).toMatchObject({
      moduleId: "postflop",
      attemptedCount: 4,
      correctCount: 3,
      status: "completed",
      topLeakTagIds: ["poor-pot-control", "missed-value-bets"],
    });
    expect(summary.accuracy).toBe(75);
    expect(summary.strengthNotes.length).toBeGreaterThan(0);
    expect(summary.weaknessNotes.length).toBeGreaterThan(0);
  });

  it("surfaces recurring mistake tags from repeated wrong answers", () => {
    const summary = getProgressSummary(
      {
        attempts: [
          {
            id: "attempt-pot-odds-wrong-1",
            sessionId: "session-pot-odds",
            scenarioId: "pot-odds-gutshot-turn-overbet",
            module: "pot-odds",
            selectedActionId: "call",
            recommendedActionId: "fold",
            isCorrect: false,
            sourceType: "simplification",
            difficulty: "advanced-lite",
            mistakeTags: ["poor-pot-odds-intuition", "chased-bad-draw"],
            conceptTags: ["pot-odds", "turn-play"],
            createdAt: "2026-04-07T09:00:00.000Z",
          },
          {
            id: "attempt-pot-odds-wrong-2",
            sessionId: "session-pot-odds",
            scenarioId: "pot-odds-gutshot-turn-overbet",
            module: "pot-odds",
            selectedActionId: "call",
            recommendedActionId: "fold",
            isCorrect: false,
            sourceType: "simplification",
            difficulty: "advanced-lite",
            mistakeTags: ["poor-pot-odds-intuition"],
            conceptTags: ["pot-odds", "turn-play"],
            createdAt: "2026-04-07T09:02:00.000Z",
          },
          {
            id: "attempt-pot-odds-correct",
            sessionId: "session-pot-odds",
            scenarioId: "pot-odds-open-ender-small-bet",
            module: "pot-odds",
            selectedActionId: "call",
            recommendedActionId: "call",
            isCorrect: true,
            sourceType: "baseline",
            difficulty: "beginner",
            mistakeTags: [],
            conceptTags: ["pot-odds"],
            createdAt: "2026-04-07T09:04:00.000Z",
          },
        ],
        sessions: [],
        updatedAt: "2026-04-07T09:04:00.000Z",
      },
      [],
    );

    const potOddsLeak = summary.leakTagStats.find(
      (leakTagStat) => leakTagStat.leakTagId === "poor-pot-odds-intuition",
    );
    const chasedDrawLeak = summary.leakTagStats.find(
      (leakTagStat) => leakTagStat.leakTagId === "chased-bad-draw",
    );

    expect(potOddsLeak).toMatchObject({
      totalCount: 2,
      trainingCount: 2,
      reviewCount: 0,
    });
    expect(chasedDrawLeak).toMatchObject({
      totalCount: 1,
      trainingCount: 1,
      reviewCount: 0,
    });
    expect(summary.leakTagStats[0]?.leakTagId).toBe("poor-pot-odds-intuition");

    const retryItem = summary.retryQueue.find(
      (item) => item.scenarioId === "pot-odds-gutshot-turn-overbet",
    );

    expect(retryItem?.supportingLeakTagIds).toContain(
      "poor-pot-odds-intuition",
    );
    expect(retryItem?.reason).toContain("hơn một lần");

    const topLeakDefinitions = getTopLeakTagDefinitions(summary.leakTagStats, 1);
    const recurringInsights = getRecurringMistakeInsights(summary.leakTagStats, {
      matchingLeakTagIds: ["poor-pot-odds-intuition", "chased-bad-draw"],
    });

    expect(topLeakDefinitions[0]).toMatchObject({
      leakTagId: "poor-pot-odds-intuition",
      totalCount: 2,
    });
    expect(topLeakDefinitions[0]?.leakTag.label).toBeTruthy();
    expect(recurringInsights).toHaveLength(1);
    expect(recurringInsights[0]).toMatchObject({
      leakTagId: "poor-pot-odds-intuition",
      trainingCount: 2,
    });
  });
});
