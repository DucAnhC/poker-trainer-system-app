import type { LeakTag } from "@/types/poker";
import type { TrainingModuleId } from "@/types/training";

export interface LeakTagDefinition extends LeakTag {
  moduleFocus: TrainingModuleId[];
  guidanceNote: string;
}

export const leakTags: LeakTagDefinition[] = [
  {
    id: "overvalued-one-pair",
    label: "Overvalued one pair",
    category: "postflop-planning",
    description:
      "Kept betting or calling with a one-pair hand without enough respect for board texture, action, or range pressure.",
    moduleFocus: ["board-texture", "postflop", "hand-review"],
    guidanceNote:
      "Use board-texture study and structured hand review to separate value hands from fragile bluff-catchers.",
  },
  {
    id: "called-too-wide",
    label: "Called too wide",
    category: "discipline",
    description:
      "Continued with a range that was too loose for the position, action history, or player tendency involved.",
    moduleFocus: ["preflop", "hand-review"],
    guidanceNote:
      "Revisit disciplined preflop continues and use hand review to spot where curiosity replaced range discipline.",
  },
  {
    id: "folded-too-much",
    label: "Folded too much",
    category: "discipline",
    description:
      "Gave up profitable continues too often, especially against wider or over-aggressive ranges.",
    moduleFocus: ["player-types", "hand-review"],
    guidanceNote:
      "Player-type training helps separate real strength from over-bluffing profiles.",
  },
  {
    id: "bluffed-bad-target",
    label: "Bluffed a bad target",
    category: "player-adjustment",
    description:
      "Chose aggression against a player type or range that does not fold enough.",
    moduleFocus: ["player-types", "postflop", "hand-review"],
    guidanceNote:
      "Use player-type drills to match bluff frequency to the opponent instead of bluffing on autopilot.",
  },
  {
    id: "ignored-position",
    label: "Ignored position",
    category: "range-thinking",
    description:
      "Missed how position changes opening ranges, calling quality, and postflop realization.",
    moduleFocus: ["preflop", "hand-review"],
    guidanceNote:
      "Preflop drills and review notes should keep hero and villain positions visible in every decision.",
  },
  {
    id: "poor-pot-odds-intuition",
    label: "Poor pot odds intuition",
    category: "math",
    description:
      "Misread the price of a continue or overestimated how often the hand or draw would improve.",
    moduleFocus: ["pot-odds", "hand-review"],
    guidanceNote:
      "Return to the pot-odds module when price, outs, or clean-equity decisions keep feeling fuzzy.",
  },
  {
    id: "weak-board-texture-recognition",
    label: "Weak board texture recognition",
    category: "postflop-planning",
    description:
      "Treated static and dynamic boards too similarly or missed who the texture benefits.",
    moduleFocus: ["board-texture", "postflop", "hand-review"],
    guidanceNote:
      "Board-texture drills help connect flop structure to c-bet frequency, caution, and later-street planning.",
  },
  {
    id: "auto-cbet",
    label: "C-bet too automatically",
    category: "postflop-planning",
    description:
      "Continuation-bet without a clear value, protection, or fold-equity reason for the exact board and range context.",
    moduleFocus: ["board-texture", "postflop", "hand-review"],
    guidanceNote:
      "Use postflop and board-texture drills to separate good pressure boards from spots that need more checking.",
  },
  {
    id: "gave-up-too-often",
    label: "Gave up too often",
    category: "postflop-planning",
    description:
      "Checked or folded away practical pressure or value when the board and range context still supported continuing.",
    moduleFocus: ["postflop", "hand-review"],
    guidanceNote:
      "Postflop drills help identify when betting still has a clean purpose instead of surrendering too quickly.",
  },
  {
    id: "weak-turn-discipline",
    label: "Weak turn discipline",
    category: "postflop-planning",
    description:
      "Missed how the turn card changed value, protection, or bluff incentives and kept using the flop plan automatically.",
    moduleFocus: ["postflop", "hand-review"],
    guidanceNote:
      "Use postflop turn spots to practice when to keep barreling, when to slow down, and when pot control becomes cleaner.",
  },
  {
    id: "ignored-player-type-postflop",
    label: "Ignored player type postflop",
    category: "player-adjustment",
    description:
      "Chose a postflop line without adapting to whether the opponent folds too much, calls too much, or under-bluffs.",
    moduleFocus: ["player-types", "postflop", "hand-review"],
    guidanceNote:
      "Postflop and player-type modules work together when the best line depends on who is actually in the pot.",
  },
  {
    id: "poor-pot-control",
    label: "Poor pot control decision",
    category: "postflop-planning",
    description:
      "Built a pot too aggressively with a medium-strength hand or checked back when the spot clearly wanted value and protection.",
    moduleFocus: ["postflop", "hand-review"],
    guidanceNote:
      "Revisit postflop spots that compare betting with checking back so one-pair hands stop drifting between value and bluff-catch mode.",
  },
  {
    id: "missed-value-bet",
    label: "Missed value bet",
    category: "postflop-planning",
    description:
      "Passed on a practical postflop bet when enough worse hands could still call.",
    moduleFocus: ["postflop", "hand-review"],
    guidanceNote:
      "Use postflop training to ask which worse hands continue, rather than defaulting to safety with medium-to-strong value hands.",
  },
  {
    id: "poor-player-type-adjustment",
    label: "Poor player-type adjustment",
    category: "player-adjustment",
    description:
      "Stayed too close to the wrong default or over-adjusted in a spot where a cleaner exploit was available.",
    moduleFocus: ["player-types", "postflop", "hand-review"],
    guidanceNote:
      "Use player-type practice to compare baseline lines with broad exploit deviations in a controlled way.",
  },
  {
    id: "autopilot-preflop",
    label: "Autopilot preflop decision",
    category: "range-thinking",
    description:
      "Pressed a familiar preflop button without enough attention to position, stack depth, or prior action.",
    moduleFocus: ["preflop", "hand-review"],
    guidanceNote:
      "Preflop drills should slow the decision down and force the learner to read the full spot before acting.",
  },
  {
    id: "emotional-decision",
    label: "Emotional or tilt-driven decision",
    category: "review-habit",
    description:
      "The choice was shaped more by frustration, fear, or ego than by the actual range-based decision.",
    moduleFocus: ["hand-review"],
    guidanceNote:
      "Structured hand review is the right place to label emotionally driven mistakes without judging them.",
  },
  {
    id: "opened-too-wide",
    label: "Opened too wide",
    category: "range-thinking",
    description:
      "Entered the pot with too weak a range for the position or action history.",
    moduleFocus: ["preflop", "hand-review"],
    guidanceNote:
      "Use preflop drills to tighten early-position opens and understand where wider opens actually belong.",
  },
  {
    id: "dominated-call",
    label: "Dominated call",
    category: "discipline",
    description:
      "Continued with a hand that performs poorly against the stronger range involved.",
    moduleFocus: ["preflop", "hand-review"],
    guidanceNote:
      "Dominated-call leaks are usually best fixed by improving range discipline before worrying about fancy exploits.",
  },
  {
    id: "ignored-stack-depth",
    label: "Ignored stack depth",
    category: "range-thinking",
    description:
      "Missed how shorter or deeper stacks change hand value and continue thresholds.",
    moduleFocus: ["preflop", "hand-review"],
    guidanceNote:
      "Re-run stack-sensitive preflop spots until the same hand feels different at 40bb and 100bb.",
  },
  {
    id: "ignored-price",
    label: "Ignored price",
    category: "math",
    description:
      "Made a math decision without respecting the pot odds or cost to continue.",
    moduleFocus: ["pot-odds", "hand-review"],
    guidanceNote:
      "Pot-odds drills should be the first stop when the price itself was skipped or guessed.",
  },
  {
    id: "chased-bad-draw",
    label: "Chased a bad draw",
    category: "math",
    description:
      "Continued with too few clean outs or unrealistic implied odds.",
    moduleFocus: ["pot-odds", "hand-review"],
    guidanceNote:
      "Review the price, the number of clean outs, and whether future money was realistically available.",
  },
  {
    id: "ignored-board-texture",
    label: "Ignored board texture",
    category: "postflop-planning",
    description:
      "Treated a dynamic board like a static one or missed the range interaction.",
    moduleFocus: ["board-texture", "postflop", "hand-review"],
    guidanceNote:
      "Board-texture study is the cleanest way to stop carrying the same c-bet logic onto every flop.",
  },
  {
    id: "missed-thin-value",
    label: "Missed thin value",
    category: "player-adjustment",
    description:
      "Passed on a practical exploit value bet against a player who calls too wide.",
    moduleFocus: ["player-types", "postflop", "hand-review"],
    guidanceNote:
      "Player-type drills can help the learner separate risky thin value from profitable exploit value.",
  },
  {
    id: "paid-off-tight-strength",
    label: "Paid off tight strength",
    category: "player-adjustment",
    description:
      "Called down too lightly against a range that is usually under-bluffed.",
    moduleFocus: ["player-types", "hand-review"],
    guidanceNote:
      "Use player-type practice and review notes to normalize disciplined folds against value-heavy lines.",
  },
  {
    id: "ignored-archetype-tendency",
    label: "Ignored archetype tendency",
    category: "player-adjustment",
    description:
      "Stayed blind to the broad tendency the training spot was asking you to adjust to.",
    moduleFocus: ["player-types", "hand-review"],
    guidanceNote:
      "Player-type work should make the assumed tendency explicit before you choose an exploit.",
  },
  {
    id: "overfolded-versus-aggression",
    label: "Overfolded versus aggression",
    category: "player-adjustment",
    description:
      "Gave up too quickly in a spot where an aggressive opponent is expected to show enough bluffs.",
    moduleFocus: ["player-types", "hand-review"],
    guidanceNote:
      "Player-type drills help distinguish a real value-heavy line from a player profile that over-bluffs too often.",
  },
  {
    id: "result-oriented",
    label: "Result oriented",
    category: "review-habit",
    description:
      "Judged the play based on the outcome instead of the decision quality.",
    moduleFocus: ["hand-review"],
    guidanceNote:
      "Use hand review to reframe the hand around ranges, context, and decision quality instead of the runout.",
  },
];

export const leakTagMap = Object.fromEntries(
  leakTags.map((leakTag) => [leakTag.id, leakTag]),
) as Record<string, LeakTagDefinition>;
