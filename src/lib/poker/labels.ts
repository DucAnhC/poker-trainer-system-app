import type {
  HandCategoryId,
  PlayerArchetypeId,
  PositionId,
} from "@/types/poker";
import type { Difficulty, SourceType, TrainingModuleId } from "@/types/training";

export const positionLabels: Record<PositionId, string> = {
  UTG: "Under the Gun",
  HJ: "Hijack",
  CO: "Cutoff",
  BTN: "Button",
  SB: "Small Blind",
  BB: "Big Blind",
};

export const sourceTypeLabels: Record<SourceType, string> = {
  simplification: "Beginner simplification",
  baseline: "Baseline",
  exploit: "Exploit",
};

export const sourceTypeDescriptions: Record<SourceType, string> = {
  simplification:
    "This answer uses a deliberate training shortcut to keep the core lesson clear before adding more edge cases.",
  baseline:
    "This answer is the product's practical default line for the stated assumptions, not a claim that every combo always plays this way.",
  exploit:
    "This answer is an adjustment to a specific tendency or player profile, so it depends on the read being meaningful.",
};

export const difficultyLabels: Record<Difficulty, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  "advanced-lite": "Advanced-lite",
};

export const moduleLabels: Record<TrainingModuleId, string> = {
  preflop: "Preflop Trainer",
  "pot-odds": "Pot Odds Quiz",
  "board-texture": "Board Texture Quiz",
  "player-types": "Player Types Quiz",
  postflop: "Postflop Trainer",
  "hand-review": "Hand Review",
};

export const playerArchetypeLabels: Record<PlayerArchetypeId, string> = {
  nit: "Nit",
  tag: "Tight-aggressive regular",
  lag: "Loose-aggressive player",
  "calling-station": "Calling station",
  maniac: "Maniac",
  "passive-rec": "Passive recreational player",
};

export const handCategoryLabels: Record<HandCategoryId, string> = {
  "premium-pair": "Premium pair",
  "strong-broadway": "Strong Broadway",
  "offsuit-broadway": "Offsuit Broadway",
  "suited-broadway": "Suited Broadway",
  "suited-ace": "Suited ace",
  "small-pair": "Small pair",
  "suited-connector": "Suited connector",
  "suited-gapper": "Suited gapper",
  "weak-offsuit": "Weak offsuit hand",
  trash: "Low-equity trash",
};
