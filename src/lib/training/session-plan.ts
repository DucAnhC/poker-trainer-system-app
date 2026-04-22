import { orderScenariosByRetryPriority } from "@/lib/training/retry-queue";
import type {
  InteractiveTrainingModuleId,
  RetryQueueItem,
  TrainingDifficultyFilter,
  TrainingScenarioBase,
  TrainerQueueMode,
} from "@/types/training";

export interface TrainerSessionPlan<T extends TrainingScenarioBase> {
  scenarios: T[];
  scenarioIds: string[];
  retryQueueItems: RetryQueueItem[];
}

export function buildTrainerScenarioSignature(
  scenarios: TrainingScenarioBase[],
) {
  return scenarios.map((scenario) => scenario.id).join("|");
}

export function buildRetryQueueSignature(retryQueueItems: RetryQueueItem[]) {
  return retryQueueItems
    .map((retryItem) => `${retryItem.scenarioId}:${retryItem.priorityScore}`)
    .join("|");
}

export function buildTrainerSessionConfigSignature(input: {
  moduleId: InteractiveTrainingModuleId;
  difficultyFilter: TrainingDifficultyFilter;
  queueMode: TrainerQueueMode;
  scenarios: TrainingScenarioBase[];
}) {
  return [
    input.moduleId,
    input.difficultyFilter,
    input.queueMode,
    buildTrainerScenarioSignature(input.scenarios),
  ].join("::");
}

export function buildTrainerSessionPlan<T extends TrainingScenarioBase>(input: {
  scenarios: T[];
  retryQueueItems: RetryQueueItem[];
  queueMode: TrainerQueueMode;
}): TrainerSessionPlan<T> {
  const orderedScenarios =
    input.queueMode === "adaptive"
      ? orderScenariosByRetryPriority(input.scenarios, input.retryQueueItems)
      : input.scenarios;

  return {
    scenarios: orderedScenarios,
    scenarioIds: orderedScenarios.map((scenario) => scenario.id),
    retryQueueItems: input.retryQueueItems,
  };
}

export function shouldRefreshTrainerSessionPlan(input: {
  currentConfigSignature: string;
  nextConfigSignature: string;
  currentRetryQueueSignature: string;
  nextRetryQueueSignature: string;
  isSessionPristine: boolean;
}) {
  if (input.currentConfigSignature !== input.nextConfigSignature) {
    return true;
  }

  return (
    input.isSessionPristine &&
    input.currentRetryQueueSignature !== input.nextRetryQueueSignature
  );
}
