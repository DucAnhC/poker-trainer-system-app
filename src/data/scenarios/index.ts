import { boardTextureScenarios } from "@/data/scenarios/board-texture-scenarios";
import { contentPacks } from "@/data/content-packs";
import { postflopScenarios } from "@/data/scenarios/postflop-scenarios";
import { playerTypeScenarios } from "@/data/scenarios/player-type-scenarios";
import { potOddsScenarios } from "@/data/scenarios/pot-odds-scenarios";
import { preflopScenarios } from "@/data/scenarios/preflop-scenarios";
import { buildScenarioRegistry } from "@/lib/training/scenario-authoring";
import type {
  InteractiveTrainingModuleId,
  TrainingScenario,
  TrainingModuleId,
} from "@/types/training";

export const scenarioSetsByModule: Record<
  InteractiveTrainingModuleId,
  TrainingScenario[]
> = {
  preflop: preflopScenarios,
  "pot-odds": potOddsScenarios,
  "board-texture": boardTextureScenarios,
  "player-types": playerTypeScenarios,
  postflop: postflopScenarios,
};

export const allScenarios = buildScenarioRegistry<TrainingScenario>(
  Object.values(scenarioSetsByModule),
);

export const scenarioMap = Object.fromEntries(
  allScenarios.map((scenario) => [scenario.id, scenario]),
) as Record<string, TrainingScenario>;

export const scenarioCountByModule = {
  ...Object.fromEntries(
    Object.entries(scenarioSetsByModule).map(([moduleId, scenarios]) => [
      moduleId,
      scenarios.length,
    ]),
  ),
  "hand-review": 0,
} as Record<TrainingModuleId, number>;

export const scenarioCountByContentPack = contentPacks.reduce<Record<string, number>>(
  (accumulator, contentPack) => {
    accumulator[contentPack.id] = allScenarios.filter(
      (scenario) => scenario.contentPackId === contentPack.id,
    ).length;
    return accumulator;
  },
  {},
);
