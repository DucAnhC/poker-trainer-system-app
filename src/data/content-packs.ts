import type {
  ContentPack,
  Difficulty,
  InteractiveTrainingModuleId,
} from "@/types/training";

export const contentPacks: ContentPack[] = [
  {
    id: "preflop-position-basics",
    moduleId: "preflop",
    title: "Preflop Position Basics",
    focusLabel: "Position-first opens",
    summary:
      "Build the core habit of opening the right hands from the right seats before layering in tougher preflop branches.",
    route: "/trainer/preflop",
    conceptTags: ["preflop", "positions", "opening-ranges"],
    difficultyFocus: ["beginner", "intermediate"],
    learningHighlights: [
      "Why later position opens wider",
      "How position changes hand value",
      "Why autopilot opens leak chips",
    ],
    relatedPackIds: ["preflop-facing-aggression"],
    studyPathOrder: 1,
  },
  {
    id: "preflop-facing-aggression",
    moduleId: "preflop",
    title: "Preflop Facing Aggression",
    focusLabel: "Continue or fold discipline",
    summary:
      "Handle opens and re-raises more cleanly by respecting domination, stack depth, and out-of-position pressure.",
    route: "/trainer/preflop",
    conceptTags: ["preflop", "vs-open", "domination", "3betting", "stack-depth"],
    difficultyFocus: ["intermediate", "advanced-lite"],
    learningHighlights: [
      "Why some hands become dominated continues",
      "How 3-bet pressure changes the spot",
      "Why stack depth can push a hand toward 3-bet-or-fold logic",
    ],
    relatedPackIds: ["preflop-position-basics", "player-type-pressure-adjustments"],
    studyPathOrder: 2,
  },
  {
    id: "pot-odds-fundamentals",
    moduleId: "pot-odds",
    title: "Pot Odds Fundamentals",
    focusLabel: "Price and outs",
    summary:
      "Sharpen the core math habit first: know the price, count realistic outs, and stop guessing about whether a draw can continue.",
    route: "/trainer/pot-odds",
    conceptTags: ["pot-odds", "outs", "equity", "draw-discipline"],
    difficultyFocus: ["beginner", "intermediate"],
    learningHighlights: [
      "Break-even price intuition",
      "Clean outs versus dirty outs",
      "Why not every draw gets a call",
    ],
    relatedPackIds: ["postflop-turn-discipline"],
    studyPathOrder: 3,
  },
  {
    id: "pot-odds-turn-pressure",
    moduleId: "pot-odds",
    title: "Pot Odds Under Turn Pressure",
    focusLabel: "One-card-to-come discipline",
    summary:
      "Practice tougher continue-versus-fold decisions when the price worsens on later streets and implied odds shrink.",
    route: "/trainer/pot-odds",
    conceptTags: ["pot-odds", "turn-play", "equity", "implied-odds"],
    difficultyFocus: ["intermediate", "advanced-lite"],
    learningHighlights: [
      "Why one-card-to-come math matters",
      "When weak draws become folds",
      "Why implied odds should not be a vague excuse",
    ],
    relatedPackIds: ["pot-odds-fundamentals", "postflop-turn-discipline"],
    studyPathOrder: 4,
  },
  {
    id: "board-texture-fundamentals",
    moduleId: "board-texture",
    title: "Board Texture Fundamentals",
    focusLabel: "Dry versus static recognition",
    summary:
      "Learn the clean early reads first: dry boards, paired boards, and why some textures are easier for the raiser to attack.",
    route: "/trainer/board-texture",
    conceptTags: ["board-texture", "dry-board", "range-advantage"],
    difficultyFocus: ["beginner", "intermediate"],
    learningHighlights: [
      "Dry versus static board reading",
      "Paired-board interpretation",
      "Broad range-advantage takeaways",
    ],
    relatedPackIds: ["board-texture-dynamic-boards", "postflop-cbet-decisions"],
    studyPathOrder: 5,
  },
  {
    id: "board-texture-dynamic-boards",
    moduleId: "board-texture",
    title: "Board Texture Dynamic Boards",
    focusLabel: "Connected-board caution",
    summary:
      "Practice recognizing when coordinated flops and live turn cards punish automatic c-bets and simplistic range assumptions.",
    route: "/trainer/board-texture",
    conceptTags: ["board-texture", "dynamic-board", "coordination", "cbetting"],
    difficultyFocus: ["intermediate", "advanced-lite"],
    learningHighlights: [
      "How connected boards hit defenders harder",
      "Why dynamic boards change quickly",
      "When c-bet frequency should slow down",
    ],
    relatedPackIds: ["board-texture-fundamentals", "postflop-cbet-decisions", "postflop-pot-control-spots"],
    studyPathOrder: 6,
  },
  {
    id: "player-type-baseline-discipline",
    moduleId: "player-types",
    title: "Player Type Baseline Discipline",
    focusLabel: "Stay grounded first",
    summary:
      "Separate real reads from fantasy reads by learning when not to force an exploit and when baseline play is still the cleaner answer.",
    route: "/trainer/player-types",
    conceptTags: ["player-types", "baseline-vs-exploit", "discipline"],
    difficultyFocus: ["beginner", "intermediate"],
    learningHighlights: [
      "When weak reads are not enough",
      "Why baseline comes before exploit",
      "How to avoid over-adjusting",
    ],
    relatedPackIds: ["player-type-value-and-call-adjustments", "player-type-pressure-adjustments"],
    studyPathOrder: 7,
  },
  {
    id: "player-type-value-and-call-adjustments",
    moduleId: "player-types",
    title: "Player Type Value And Call Adjustments",
    focusLabel: "Thinner value, wider bluff-catches",
    summary:
      "Practice the common exploit branches that most directly affect value betting and bluff-catching decisions against clear archetypes.",
    route: "/trainer/player-types",
    conceptTags: ["player-types", "value-betting", "bluff-catching", "exploit-play"],
    difficultyFocus: ["beginner", "advanced-lite"],
    learningHighlights: [
      "When to value bet thinner",
      "When to bluff-catch wider",
      "Why player type can swing one-pair decisions",
    ],
    relatedPackIds: ["player-type-baseline-discipline", "postflop-river-value-vs-bluff"],
    studyPathOrder: 8,
  },
  {
    id: "player-type-pressure-adjustments",
    moduleId: "player-types",
    title: "Player Type Pressure Adjustments",
    focusLabel: "Punish openers and folders",
    summary:
      "Use preflop and pressure-based exploits more responsibly by attacking the right wide ranges instead of bluffing blindly.",
    route: "/trainer/player-types",
    conceptTags: ["player-types", "exploit-play", "3betting", "preflop"],
    difficultyFocus: ["intermediate", "advanced-lite"],
    learningHighlights: [
      "When extra pressure makes money",
      "Which wide ranges invite 3-bets",
      "Why not every aggressive opponent should be fought the same way",
    ],
    relatedPackIds: ["player-type-baseline-discipline", "preflop-facing-aggression"],
    studyPathOrder: 9,
  },
  {
    id: "postflop-cbet-decisions",
    moduleId: "postflop",
    title: "Postflop C-Bet Decisions",
    focusLabel: "Bet or check on the flop",
    summary:
      "Train the first postflop branch cleanly: which flops support a clear c-bet, which ones deserve a check, and why range advantage is not automatic.",
    route: "/trainer/postflop",
    conceptTags: ["postflop", "cbetting", "range-advantage", "board-texture"],
    difficultyFocus: ["beginner", "intermediate"],
    learningHighlights: [
      "When range advantage justifies a c-bet",
      "Why some textures punish automatic pressure",
      "How flop context shapes the rest of the hand",
    ],
    relatedPackIds: ["board-texture-fundamentals", "board-texture-dynamic-boards", "postflop-turn-discipline"],
    studyPathOrder: 10,
  },
  {
    id: "postflop-turn-discipline",
    moduleId: "postflop",
    title: "Postflop Turn Discipline",
    focusLabel: "Barrel or slow down",
    summary:
      "Handle the second barrel more responsibly by asking what actually changed on the turn instead of reacting automatically to a flop call.",
    route: "/trainer/postflop",
    conceptTags: ["postflop", "turn-barrel", "turn-play", "value-vs-bluff"],
    difficultyFocus: ["beginner", "intermediate", "advanced-lite"],
    learningHighlights: [
      "When to keep barreling",
      "When to let the hand check back",
      "How turn cards change value and fold equity",
    ],
    relatedPackIds: ["pot-odds-turn-pressure", "postflop-pot-control-spots", "postflop-river-value-vs-bluff"],
    studyPathOrder: 11,
  },
  {
    id: "postflop-pot-control-spots",
    moduleId: "postflop",
    title: "Postflop Pot Control Spots",
    focusLabel: "Medium-strength hand discipline",
    summary:
      "Practice when one pair should keep betting and when it should shrink the pot before the hand gets overplayed.",
    route: "/trainer/postflop",
    conceptTags: ["postflop", "pot-control", "one-pair-discipline", "turn-play"],
    difficultyFocus: ["intermediate", "advanced-lite"],
    learningHighlights: [
      "How one pair becomes a pot-control hand",
      "Why vulnerability matters",
      "How medium-strength hands get overplayed",
    ],
    relatedPackIds: ["board-texture-dynamic-boards", "postflop-turn-discipline"],
    studyPathOrder: 12,
  },
  {
    id: "postflop-river-value-vs-bluff",
    moduleId: "postflop",
    title: "Postflop River Value Vs Bluff",
    focusLabel: "Value bet or shut down",
    summary:
      "Train the broad river question cleanly: which worse hands still call, which targets are bad bluffs, and when player type changes the answer.",
    route: "/trainer/postflop",
    conceptTags: ["postflop", "river", "value-vs-bluff", "player-types"],
    difficultyFocus: ["intermediate", "advanced-lite"],
    learningHighlights: [
      "What worse hands actually call",
      "When a missed draw should stop bluffing",
      "How river discipline changes by opponent type",
    ],
    relatedPackIds: ["player-type-value-and-call-adjustments", "postflop-turn-discipline"],
    studyPathOrder: 13,
  },
];

export const contentPackMap = Object.fromEntries(
  contentPacks.map((contentPack) => [contentPack.id, contentPack]),
) as Record<string, ContentPack>;

export const contentPacksByModule = contentPacks.reduce<
  Record<ContentPack["moduleId"], ContentPack[]>
>(
  (accumulator, contentPack) => {
    const currentPacks = accumulator[contentPack.moduleId] ?? [];
    accumulator[contentPack.moduleId] = [...currentPacks, contentPack];
    return accumulator;
  },
  {
    preflop: [],
    "pot-odds": [],
    "board-texture": [],
    "player-types": [],
    postflop: [],
  },
);

export function getPrimaryContentPack(moduleId: ContentPack["moduleId"]) {
  return contentPacksByModule[moduleId][0] ?? null;
}

export function getContentPacksForModule(
  moduleId: InteractiveTrainingModuleId,
) {
  return contentPacksByModule[moduleId] ?? [];
}

export function getContentPackRoute(
  contentPackId: string | null | undefined,
  options?: {
    difficulty?: Difficulty | null;
  },
) {
  const contentPack = contentPackId ? contentPackMap[contentPackId] : null;

  if (!contentPack) {
    return "/dashboard";
  }

  const params = new URLSearchParams();
  params.set("pack", contentPack.id);

  if (options?.difficulty) {
    params.set("difficulty", options.difficulty);
  }

  return `${contentPack.route}?${params.toString()}`;
}
