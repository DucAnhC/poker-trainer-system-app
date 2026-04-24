import { describe, expect, it } from "vitest";

import {
  buildTrainerSessionPlan,
  shouldRefreshTrainerSessionPlan,
} from "@/lib/training/session-plan";
import type { RetryQueueItem, TrainingScenarioBase } from "@/types/training";

function createScenario(id: string): TrainingScenarioBase {
  return {
    id,
    module: "preflop",
    contentPackId: "preflop-position-basics",
    mode: "preflop-trainer",
    title: id,
    learningGoal: "Test ordering.",
    prompt: "Pick a line.",
    street: "preflop",
    difficulty: "beginner",
    sourceType: "baseline",
    keyConcepts: ["preflop"],
    tags: ["preflop"],
    assumptions: [],
    rationaleBlocks: [],
    candidateActions: [],
    recommendedActionId: "fold",
    mistakeTags: [],
    version: 1,
  };
}

function createRetryItem(
  scenarioId: string,
  priorityScore: number,
): RetryQueueItem {
  return {
    scenarioId,
    priorityScore,
    moduleId: "preflop",
    contentPackId: "preflop-position-basics",
    title: scenarioId,
    difficulty: "beginner",
    reason: "Retry this spot.",
    supportingLeakTagIds: [],
    supportingConceptTags: ["preflop"],
  };
}

describe("trainer session plan", () => {
  it("orders adaptive sessions by retry priority without mutating the input pool", () => {
    const scenarios = [
      createScenario("spot-a"),
      createScenario("spot-b"),
      createScenario("spot-c"),
    ];

    const plan = buildTrainerSessionPlan({
      scenarios,
      retryQueueItems: [createRetryItem("spot-c", 10)],
      queueMode: "adaptive",
    });

    expect(plan.scenarioIds).toEqual(["spot-c", "spot-a", "spot-b"]);
    expect(scenarios.map((scenario) => scenario.id)).toEqual([
      "spot-a",
      "spot-b",
      "spot-c",
    ]);
  });

  it("builds mistake review sessions from retry scenarios only", () => {
    const scenarios = [
      createScenario("spot-a"),
      createScenario("spot-b"),
      createScenario("spot-c"),
    ];

    const plan = buildTrainerSessionPlan({
      scenarios,
      retryQueueItems: [
        createRetryItem("spot-c", 7),
        createRetryItem("spot-a", 12),
      ],
      queueMode: "mistakes",
    });

    expect(plan.scenarioIds).toEqual(["spot-a", "spot-c"]);
  });

  it("keeps an in-progress session stable when persisted retry data changes", () => {
    expect(
      shouldRefreshTrainerSessionPlan({
        currentConfigSignature: "preflop::all::adaptive::spot-a|spot-b",
        nextConfigSignature: "preflop::all::adaptive::spot-a|spot-b",
        currentRetryQueueSignature: "",
        nextRetryQueueSignature: "spot-b:6",
        isSessionPristine: false,
      }),
    ).toBe(false);

    expect(
      shouldRefreshTrainerSessionPlan({
        currentConfigSignature: "preflop::all::adaptive::spot-a|spot-b",
        nextConfigSignature: "preflop::all::adaptive::spot-a|spot-b",
        currentRetryQueueSignature: "",
        nextRetryQueueSignature: "spot-b:6",
        isSessionPristine: true,
      }),
    ).toBe(true);
  });

  it("always refreshes when pack, difficulty, queue mode, or scenario pool changes", () => {
    expect(
      shouldRefreshTrainerSessionPlan({
        currentConfigSignature: "preflop::all::adaptive::spot-a|spot-b",
        nextConfigSignature: "preflop::beginner::adaptive::spot-a",
        currentRetryQueueSignature: "",
        nextRetryQueueSignature: "",
        isSessionPristine: false,
      }),
    ).toBe(true);
  });
});
