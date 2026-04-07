import type { Position } from "@/types/poker";

export const positions: Position[] = [
  {
    id: "UTG",
    label: "Under the Gun",
    description: "Earliest six-max position and the tightest standard opening spot.",
  },
  {
    id: "HJ",
    label: "Hijack",
    description: "Middle-late position with more room to widen compared with UTG.",
  },
  {
    id: "CO",
    label: "Cutoff",
    description: "Late position that can pressure blinds and open wider ranges.",
  },
  {
    id: "BTN",
    label: "Button",
    description: "Best seat at the table with position on every postflop street.",
  },
  {
    id: "SB",
    label: "Small Blind",
    description: "Out-of-position blind seat that often needs disciplined ranges.",
  },
  {
    id: "BB",
    label: "Big Blind",
    description: "Forced blind that defends differently because money is already in.",
  },
];
