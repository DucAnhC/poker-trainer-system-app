import type { HandReviewNote, ReviewStreetFocus } from "@/types/training";

export type HandReviewDraft = Omit<
  HandReviewNote,
  "id" | "createdAt" | "updatedAt"
>;

export const reviewStreetFocusOptions: Array<{
  value: ReviewStreetFocus;
  label: string;
}> = [
  { value: "general", label: "General" },
  { value: "preflop", label: "Preflop" },
  { value: "flop", label: "Flop" },
  { value: "turn", label: "Turn" },
  { value: "river", label: "River" },
];

export function createEmptyHandReviewDraft(): HandReviewDraft {
  return {
    title: "",
    streetFocus: "general",
    heroPosition: null,
    villainPosition: null,
    effectiveStackBb: null,
    board: "",
    actionHistorySummary: "",
    chosenAction: "",
    uncertainty: "",
    note: "",
    leakTagIds: [],
  };
}
