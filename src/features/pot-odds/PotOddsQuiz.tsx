"use client";

import { potOddsScenarios } from "@/data/scenarios/pot-odds-scenarios";
import { TacticalTrainerModule } from "@/features/trainer/TacticalTrainerModule";

export function PotOddsQuiz() {
  return <TacticalTrainerModule moduleId="pot-odds" scenarios={potOddsScenarios} />;
}
