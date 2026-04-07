import { contentPackMap } from "@/data/content-packs";
import type { TrainingScenarioBase } from "@/types/training";

function assertNonEmptyText(value: string, fieldName: string, scenarioId: string) {
  if (!value.trim()) {
    throw new Error(`Scenario "${scenarioId}" is missing a usable ${fieldName}.`);
  }
}

export function defineScenarioSet<T extends TrainingScenarioBase>(
  moduleId: T["module"],
  scenarios: readonly T[],
): T[] {
  const seenScenarioIds = new Set<string>();

  for (const scenario of scenarios) {
    assertNonEmptyText(scenario.id, "id", scenario.id || "(missing-id)");
    assertNonEmptyText(scenario.contentPackId, "content pack id", scenario.id);
    assertNonEmptyText(scenario.title, "title", scenario.id);
    assertNonEmptyText(scenario.prompt, "prompt", scenario.id);

    if (scenario.module !== moduleId) {
      throw new Error(
        `Scenario "${scenario.id}" was authored under "${scenario.module}" inside the "${moduleId}" scenario set.`,
      );
    }

    const contentPack = contentPackMap[scenario.contentPackId];

    if (!contentPack) {
      throw new Error(
        `Scenario "${scenario.id}" points to unknown content pack "${scenario.contentPackId}".`,
      );
    }

    if (contentPack.moduleId !== scenario.module) {
      throw new Error(
        `Scenario "${scenario.id}" points to content pack "${scenario.contentPackId}" from the "${contentPack.moduleId}" module.`,
      );
    }

    if (seenScenarioIds.has(scenario.id)) {
      throw new Error(`Duplicate scenario id "${scenario.id}" detected in the "${moduleId}" set.`);
    }

    seenScenarioIds.add(scenario.id);

    if (scenario.keyConcepts.length === 0) {
      throw new Error(
        `Scenario "${scenario.id}" must include at least one key concept.`,
      );
    }

    for (const keyConcept of scenario.keyConcepts) {
      assertNonEmptyText(keyConcept, "key concept", scenario.id);
    }

    if (scenario.candidateActions.length < 2) {
      throw new Error(
        `Scenario "${scenario.id}" needs at least two candidate actions for training use.`,
      );
    }

    const candidateActionIds = new Set<string>();

    for (const candidateAction of scenario.candidateActions) {
      assertNonEmptyText(candidateAction.id, "candidate action id", scenario.id);
      assertNonEmptyText(candidateAction.label, "candidate action label", scenario.id);

      if (candidateActionIds.has(candidateAction.id)) {
        throw new Error(
          `Scenario "${scenario.id}" repeats the candidate action id "${candidateAction.id}".`,
        );
      }

      candidateActionIds.add(candidateAction.id);
    }

    if (!candidateActionIds.has(scenario.recommendedActionId)) {
      throw new Error(
        `Scenario "${scenario.id}" points to missing recommended action "${scenario.recommendedActionId}".`,
      );
    }

    if (scenario.rationaleBlocks.length === 0) {
      throw new Error(
        `Scenario "${scenario.id}" must include at least one rationale block.`,
      );
    }

    for (const followUpPackId of scenario.followUpPackIds ?? []) {
      if (!contentPackMap[followUpPackId]) {
        throw new Error(
          `Scenario "${scenario.id}" points to unknown follow-up content pack "${followUpPackId}".`,
        );
      }
    }
  }

  return [...scenarios];
}

export function buildScenarioRegistry<T extends TrainingScenarioBase>(
  scenarioSets: ReadonlyArray<ReadonlyArray<T>>,
) {
  const allScenarios = scenarioSets.flat();
  const seenScenarioIds = new Set<string>();

  for (const scenario of allScenarios) {
    if (seenScenarioIds.has(scenario.id)) {
      throw new Error(`Duplicate scenario id "${scenario.id}" detected across modules.`);
    }

    seenScenarioIds.add(scenario.id);
  }

  return allScenarios;
}
