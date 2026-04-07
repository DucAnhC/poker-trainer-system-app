import type { TrainingModule } from "@/types/training";

export const trainingModules: TrainingModule[] = [
  {
    id: "preflop",
    title: "Preflop Trainer",
    route: "/trainer/preflop",
    summary:
      "Position-aware opening, calling, 3-betting, and fold discipline with stack-depth context.",
    phaseStatus: "interactive",
    learningFocus: ["Open or fold discipline", "Facing opens", "Stack-depth awareness"],
    sourceTypeFocus: ["simplification", "baseline"],
  },
  {
    id: "pot-odds",
    title: "Pot Odds Quiz",
    route: "/trainer/pot-odds",
    summary:
      "Quick math spots for price awareness, outs counting, and beginner-friendly draw discipline.",
    phaseStatus: "interactive",
    learningFocus: ["Pot odds", "Outs counting", "Implied-odds awareness"],
    sourceTypeFocus: ["simplification", "baseline"],
  },
  {
    id: "board-texture",
    title: "Board Texture Quiz",
    route: "/trainer/board-texture",
    summary:
      "Concept drills that teach dry versus dynamic boards and why textures change postflop plans.",
    phaseStatus: "interactive",
    learningFocus: ["Dry versus dynamic", "Range interaction", "C-bet caution"],
    sourceTypeFocus: ["simplification", "baseline"],
  },
  {
    id: "postflop",
    title: "Postflop Trainer",
    route: "/trainer/postflop",
    summary:
      "Simple flop, turn, and river decision drills for c-bets, turn barrels, pot control, and one-pair discipline.",
    phaseStatus: "interactive",
    learningFocus: [
      "C-bet versus check decisions",
      "Turn-barrel discipline",
      "Pot control and one-pair discipline",
    ],
    sourceTypeFocus: ["simplification", "baseline", "exploit"],
  },
  {
    id: "player-types",
    title: "Player Types Quiz",
    route: "/trainer/player-types",
    summary:
      "Adjustment drills for common archetypes with clear baseline versus exploit language.",
    phaseStatus: "interactive",
    learningFocus: ["Exploit discipline", "Value-bet adjustments", "Bluff selection"],
    sourceTypeFocus: ["baseline", "exploit"],
  },
  {
    id: "hand-review",
    title: "Hand Review",
    route: "/review",
    summary:
      "Structured notes for tagging mistakes, lessons learned, and future review prompts.",
    phaseStatus: "interactive",
    learningFocus: ["Review habits", "Leak tagging", "Reflection"],
    sourceTypeFocus: ["simplification"],
    ctaLabel: "Open review",
  },
];
