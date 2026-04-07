"use client";

import { boardTextureScenarios } from "@/data/scenarios/board-texture-scenarios";
import { TacticalTrainerModule } from "@/features/trainer/TacticalTrainerModule";

export function BoardTextureQuiz() {
  return (
    <TacticalTrainerModule
      moduleId="board-texture"
      scenarios={boardTextureScenarios}
    />
  );
}
