import type {
  RetryQueueItem,
  TrainingDifficultyFilter,
  TrainingScenarioBase,
  InteractiveTrainingModuleId,
} from "@/types/training";

export function getModuleRetryQueueItems(
  retryQueue: RetryQueueItem[],
  moduleId: InteractiveTrainingModuleId,
  difficultyFilter: TrainingDifficultyFilter,
) {
  return retryQueue.filter(
    (retryItem) =>
      retryItem.moduleId === moduleId &&
      (difficultyFilter === "all" || retryItem.difficulty === difficultyFilter),
  );
}

export function orderScenariosByRetryPriority<T extends TrainingScenarioBase>(
  scenarios: T[],
  retryQueue: RetryQueueItem[],
) {
  if (retryQueue.length === 0) {
    return scenarios;
  }

  const priorityByScenarioId = new Map(
    retryQueue.map((retryItem) => [retryItem.scenarioId, retryItem.priorityScore]),
  );

  return [...scenarios]
    .map((scenario, index) => ({
      scenario,
      index,
      priorityScore: priorityByScenarioId.get(scenario.id) ?? 0,
    }))
    .sort((left, right) => {
      if (left.priorityScore === right.priorityScore) {
        return left.index - right.index;
      }

      return right.priorityScore - left.priorityScore;
    })
    .map((entry) => entry.scenario);
}

export function getRetryItemForScenario(
  retryQueue: RetryQueueItem[],
  scenarioId: string | undefined,
) {
  if (!scenarioId) {
    return null;
  }

  return retryQueue.find((retryItem) => retryItem.scenarioId === scenarioId) ?? null;
}
