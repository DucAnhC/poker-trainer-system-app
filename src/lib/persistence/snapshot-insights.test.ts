import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  getAppSnapshotStats,
  getRecentReviewNotes,
  getStudyAnalyticsSummary,
  hasAppSnapshotData,
} from "@/lib/persistence/snapshot-insights";
import type { LocalAppSnapshot } from "@/lib/persistence/local-app-snapshot";

describe("snapshot insights", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-04-07T12:00:00.000Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("builds snapshot stats from attempts, sessions, and notes", () => {
    const snapshot: LocalAppSnapshot = {
      progress: {
        attempts: [],
        sessions: [
          {
            id: "session-complete",
            module: "preflop",
            startedAt: "2026-04-05T09:30:00.000Z",
            lastActivityAt: "2026-04-05T09:45:00.000Z",
            completedAt: "2026-04-05T09:45:00.000Z",
            scenarioIds: ["preflop-co-ajo-open-100bb"],
            correctCount: 1,
            attemptIds: ["attempt-1"],
            surfacedLeakTags: [],
          },
          {
            id: "session-active",
            module: "postflop",
            startedAt: "2026-04-06T09:00:00.000Z",
            lastActivityAt: "2026-04-06T09:15:00.000Z",
            scenarioIds: ["postflop-btn-cbet-ace-high-dry"],
            correctCount: 0,
            attemptIds: [],
            surfacedLeakTags: ["poor-board-texture-reading"],
          },
        ],
        updatedAt: "2026-04-06T09:15:00.000Z",
      },
      handReviewNotes: [
        {
          id: "review-1",
          title: "River bluff catch",
          streetFocus: "river",
          heroPosition: "BTN",
          villainPosition: "BB",
          effectiveStackBb: 100,
          board: "Ah Td 4c 7s 2h",
          actionHistorySummary: "Button opens, big blind calls, river faces overbet.",
          chosenAction: "Called",
          uncertainty: "Was this too loose?",
          note: "Villain seemed splashy.",
          leakTagIds: ["called-too-wide"],
          createdAt: "2026-04-04T15:00:00.000Z",
          updatedAt: "2026-04-04T16:00:00.000Z",
        },
      ],
    };

    const stats = getAppSnapshotStats(snapshot);

    expect(stats).toEqual({
      attemptCount: 0,
      sessionCount: 2,
      completedSessionCount: 1,
      activeSessionCount: 1,
      reviewNoteCount: 1,
      lastActivityAt: "2026-04-06T09:15:00.000Z",
    });
    expect(hasAppSnapshotData(stats)).toBe(true);
  });

  it("summarizes recent study analytics and review ordering", () => {
    const snapshot: LocalAppSnapshot = {
      progress: {
        attempts: [
          {
            id: "attempt-1",
            sessionId: "session-complete",
            scenarioId: "preflop-co-ajo-open-100bb",
            module: "preflop",
            selectedActionId: "open-2.5x",
            recommendedActionId: "open-2.5x",
            isCorrect: true,
            sourceType: "baseline",
            difficulty: "beginner",
            mistakeTags: [],
            conceptTags: ["positions"],
            createdAt: "2026-04-06T10:00:00.000Z",
          },
          {
            id: "attempt-2",
            sessionId: "session-complete",
            scenarioId: "pot-odds-open-ender-small-bet",
            module: "pot-odds",
            selectedActionId: "call",
            recommendedActionId: "call",
            isCorrect: true,
            sourceType: "baseline",
            difficulty: "beginner",
            mistakeTags: [],
            conceptTags: ["pot-odds"],
            createdAt: "2026-04-01T09:30:00.000Z",
          },
          {
            id: "attempt-3",
            sessionId: "session-old",
            scenarioId: "pot-odds-gutshot-turn-overbet",
            module: "pot-odds",
            selectedActionId: "call",
            recommendedActionId: "fold",
            isCorrect: false,
            sourceType: "simplification",
            difficulty: "advanced-lite",
            mistakeTags: ["poor-pot-odds-intuition"],
            conceptTags: ["pot-odds", "turn-play"],
            createdAt: "2026-03-20T09:30:00.000Z",
          },
        ],
        sessions: [
          {
            id: "session-complete",
            module: "preflop",
            startedAt: "2026-04-05T09:00:00.000Z",
            lastActivityAt: "2026-04-05T09:45:00.000Z",
            completedAt: "2026-04-05T09:45:00.000Z",
            scenarioIds: ["preflop-co-ajo-open-100bb"],
            correctCount: 1,
            attemptIds: ["attempt-1"],
            surfacedLeakTags: [],
          },
          {
            id: "session-active",
            module: "postflop",
            startedAt: "2026-03-30T09:00:00.000Z",
            lastActivityAt: "2026-03-30T09:05:00.000Z",
            scenarioIds: ["postflop-btn-cbet-ace-high-dry"],
            correctCount: 0,
            attemptIds: [],
            surfacedLeakTags: ["poor-board-texture-reading"],
          },
        ],
        updatedAt: "2026-04-06T10:00:00.000Z",
      },
      handReviewNotes: [
        {
          id: "review-older",
          title: "Earlier note",
          streetFocus: "turn",
          heroPosition: "CO",
          villainPosition: "BTN",
          effectiveStackBb: 80,
          board: "Kh 8h 2c Tc",
          actionHistorySummary: "Raised flop, checked turn.",
          chosenAction: "Checked",
          uncertainty: "Should I keep betting?",
          note: "",
          leakTagIds: ["weak-turn-discipline"],
          createdAt: "2026-03-29T11:00:00.000Z",
          updatedAt: "2026-03-29T11:30:00.000Z",
        },
        {
          id: "review-newer",
          title: "Newest note",
          streetFocus: "river",
          heroPosition: "BTN",
          villainPosition: "BB",
          effectiveStackBb: 100,
          board: "Ah Td 4c 7s 2h",
          actionHistorySummary: "River bluff catch spot.",
          chosenAction: "Called",
          uncertainty: "Too loose?",
          note: "Need a cleaner river plan.",
          leakTagIds: ["called-too-wide"],
          createdAt: "2026-04-04T15:00:00.000Z",
          updatedAt: "2026-04-04T16:00:00.000Z",
        },
      ],
    };

    const analytics = getStudyAnalyticsSummary(snapshot);
    const recentNotes = getRecentReviewNotes(snapshot.handReviewNotes, 2);

    expect(analytics).toEqual({
      attemptsLast7Days: 2,
      completedSessionsLast30Days: 1,
      reviewNotesLast30Days: 2,
      activeStudyDaysLast14Days: 6,
      activeModuleCount: 3,
      lastReviewUpdatedAt: "2026-04-04T16:00:00.000Z",
      lastTrainingActivityAt: "2026-04-06T10:00:00.000Z",
    });
    expect(recentNotes.map((note) => note.id)).toEqual([
      "review-newer",
      "review-older",
    ]);
  });
});
