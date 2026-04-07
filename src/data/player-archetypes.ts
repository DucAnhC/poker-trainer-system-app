import type { PlayerArchetype } from "@/types/poker";

export const playerArchetypes: PlayerArchetype[] = [
  {
    id: "nit",
    name: "Nit",
    description: "Very selective player who under-bluffs and often over-folds medium strength.",
    commonLeaks: ["Folds too much to pressure", "Rarely shows thin bluffs"],
    defaultAdjustments: ["Steal more often", "Fold more comfortably versus late-street aggression"],
  },
  {
    id: "tag",
    name: "Tight-aggressive regular",
    description: "Closer to baseline play with disciplined ranges and pressure.",
    commonLeaks: ["Less obvious population leaks", "Still tends to follow strong range logic"],
    defaultAdjustments: ["Stay close to baseline", "Avoid heroic exploit guesses without evidence"],
  },
  {
    id: "lag",
    name: "Loose-aggressive player",
    description: "Applies pressure with wider ranges and more frequent aggression.",
    commonLeaks: ["Can over-bluff", "Can attack capped ranges too aggressively"],
    defaultAdjustments: ["Call tighter in thin spots", "Defend credible bluff-catchers selectively"],
  },
  {
    id: "calling-station",
    name: "Calling station",
    description: "Calls too often and folds too little, especially postflop.",
    commonLeaks: ["Pays off too wide", "Does not respect thin value bets enough"],
    defaultAdjustments: ["Value bet more often", "Cut down low-equity bluffs"],
  },
  {
    id: "maniac",
    name: "Maniac",
    description: "Hyper-aggressive player who applies pressure with too many bluffs and thin barrels.",
    commonLeaks: ["Over-bluffs big nodes", "Builds large pots with unstable ranges"],
    defaultAdjustments: ["Value bet and bluff-catch a little wider", "Avoid fancy bluffs with weak blockers"],
  },
  {
    id: "passive-rec",
    name: "Passive recreational player",
    description: "Enters many hands but uses aggressive actions too rarely.",
    commonLeaks: ["Value-heavy aggression", "Inconsistent range construction"],
    defaultAdjustments: ["Fold more to sudden strength", "Take initiative when checked to"],
  },
];
