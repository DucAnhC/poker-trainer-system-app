import { describe, expect, it } from "vitest";

import {
  buildLiveTrainingSessionSummary,
  getProgressSummary,
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
});
