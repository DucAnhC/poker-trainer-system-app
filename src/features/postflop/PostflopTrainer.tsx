"use client";

import { postflopScenarios } from "@/data/scenarios/postflop-scenarios";
import { TacticalTrainerModule } from "@/features/trainer/TacticalTrainerModule";

export function PostflopTrainer() {
  return <TacticalTrainerModule moduleId="postflop" scenarios={postflopScenarios} />;
}
