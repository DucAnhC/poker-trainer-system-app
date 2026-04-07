import type { HandCategory } from "@/types/poker";

export const handCategories: HandCategory[] = [
  {
    id: "premium-pair",
    label: "Premium pairs",
    summary: "Hands that often continue aggressively for value.",
    sampleHands: ["AA", "KK", "QQ"],
  },
  {
    id: "strong-broadway",
    label: "Strong Broadways",
    summary: "High-card hands that play well but still depend on position and ranges.",
    sampleHands: ["AKo", "AQs", "KQs"],
  },
  {
    id: "offsuit-broadway",
    label: "Offsuit Broadways",
    summary: "Useful but more domination-prone holdings.",
    sampleHands: ["AJo", "KQo", "QJo"],
  },
  {
    id: "suited-broadway",
    label: "Suited Broadways",
    summary: "Connected high-card hands with better playability.",
    sampleHands: ["KJs", "QJs", "JTs"],
  },
  {
    id: "suited-ace",
    label: "Suited aces",
    summary: "Hands that gain value from nut-flush potential and blocker utility.",
    sampleHands: ["A5s", "A9s", "ATs"],
  },
  {
    id: "small-pair",
    label: "Small pairs",
    summary: "Pairs that can win at showdown but are sensitive to stack depth and pressure.",
    sampleHands: ["22", "55", "77"],
  },
  {
    id: "suited-connector",
    label: "Suited connectors",
    summary: "Playability-driven hands that prefer position and depth.",
    sampleHands: ["76s", "98s", "T9s"],
  },
  {
    id: "suited-gapper",
    label: "Suited gappers",
    summary: "Lower-frequency continues that depend heavily on context.",
    sampleHands: ["97s", "T8s", "J9s"],
  },
  {
    id: "weak-offsuit",
    label: "Weak offsuit hands",
    summary: "Hands that often create domination and realization problems.",
    sampleHands: ["KTo", "Q9o", "A8o"],
  },
  {
    id: "trash",
    label: "Low-equity trash",
    summary: "Hands that mostly fold in structured baseline training.",
    sampleHands: ["94o", "72o", "83o"],
  },
];
