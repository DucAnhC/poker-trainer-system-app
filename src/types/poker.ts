export type PositionId = "UTG" | "HJ" | "CO" | "BTN" | "SB" | "BB";

export interface Position {
  id: PositionId;
  label: string;
  description: string;
}

export type HandCategoryId =
  | "premium-pair"
  | "strong-broadway"
  | "offsuit-broadway"
  | "suited-broadway"
  | "suited-ace"
  | "small-pair"
  | "suited-connector"
  | "suited-gapper"
  | "weak-offsuit"
  | "trash";

export interface HandCategory {
  id: HandCategoryId;
  label: string;
  summary: string;
  sampleHands: string[];
}

export type PlayerArchetypeId =
  | "nit"
  | "tag"
  | "lag"
  | "calling-station"
  | "maniac"
  | "passive-rec";

export interface PlayerArchetype {
  id: PlayerArchetypeId;
  name: string;
  description: string;
  commonLeaks: string[];
  defaultAdjustments: string[];
}

export type StackDepthId = "20bb" | "40bb" | "60bb" | "100bb";

export interface StackDepth {
  id: StackDepthId;
  label: string;
  minBb: number;
  maxBb: number;
  trainingNotes: string[];
}

export interface BoardTextureProfile {
  id: string;
  flop: [string, string, string];
  turn?: string;
  river?: string;
  suitedness: "rainbow" | "two-tone" | "monotone";
  connectedness: "disconnected" | "semi-connected" | "highly-connected";
  pairedness: "unpaired" | "paired" | "double-paired";
  dynamicLevel: "static" | "medium" | "dynamic";
  notes: string[];
}

export interface LeakTag {
  id: string;
  label: string;
  category:
    | "range-thinking"
    | "math"
    | "discipline"
    | "player-adjustment"
    | "postflop-planning"
    | "review-habit";
  description: string;
}
