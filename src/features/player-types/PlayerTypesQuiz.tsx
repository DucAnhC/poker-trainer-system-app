"use client";

import { playerTypeScenarios } from "@/data/scenarios/player-type-scenarios";
import { TacticalTrainerModule } from "@/features/trainer/TacticalTrainerModule";

export function PlayerTypesQuiz() {
  return (
    <TacticalTrainerModule
      moduleId="player-types"
      scenarios={playerTypeScenarios}
    />
  );
}
