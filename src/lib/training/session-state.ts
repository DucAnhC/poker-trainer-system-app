import type {
  TrainingModuleId,
  TrainingSession,
  TrainingSessionState,
} from "@/types/training";

function createSessionId(module: TrainingModuleId) {
  return `${module}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function createTrainingSession(
  module: TrainingModuleId,
  scenarioIds: string[],
): TrainingSession {
  const startedAt = new Date().toISOString();

  return {
    id: createSessionId(module),
    module,
    startedAt,
    lastActivityAt: startedAt,
    scenarioIds,
    correctCount: 0,
    attemptIds: [],
    surfacedLeakTags: [],
  };
}

export function createTrainingSessionState(
  module: TrainingModuleId,
  scenarioIds: string[],
): TrainingSessionState {
  return {
    session: createTrainingSession(module, scenarioIds),
    currentScenarioIndex: 0,
    completedScenarioIds: [],
    status: scenarioIds.length > 0 ? "ready" : "completed",
  };
}

export function getCurrentScenarioId(state: TrainingSessionState) {
  return state.session.scenarioIds[state.currentScenarioIndex];
}
