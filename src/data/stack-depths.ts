import type { StackDepth } from "@/types/poker";

export const stackDepths: StackDepth[] = [
  {
    id: "20bb",
    label: "20 big blinds",
    minBb: 15,
    maxBb: 25,
    trainingNotes: ["Raw equity matters more", "Marginal flats shrink quickly"],
  },
  {
    id: "40bb",
    label: "40 big blinds",
    minBb: 26,
    maxBb: 50,
    trainingNotes: ["Good bridge depth for preflop pressure", "Some speculative calls tighten"],
  },
  {
    id: "60bb",
    label: "60 big blinds",
    minBb: 51,
    maxBb: 80,
    trainingNotes: ["Room for postflop play remains", "3-bet pots still matter heavily"],
  },
  {
    id: "100bb",
    label: "100 big blinds",
    minBb: 81,
    maxBb: 140,
    trainingNotes: ["Default cash-game teaching depth", "Playability and realization matter more"],
  },
];
