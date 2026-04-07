import { leakTagMap } from "@/data/leak-tags";
import { moduleLabels } from "@/lib/poker/labels";
import type {
  HandReviewNote,
  RecommendedFocusArea,
  TrainingModuleId,
} from "@/types/training";

type RecommendationCandidate = RecommendedFocusArea & {
  score: number;
};

const keywordRecommendations: Array<{
  moduleId: TrainingModuleId;
  keywords: string[];
  reason: string;
  score: number;
}> = [
  {
    moduleId: "postflop",
    keywords: [
      "c-bet",
      "cbet",
      "barrel",
      "turn barrel",
      "check back",
      "pot control",
      "value bet",
      "bluff catch",
      "bluff-catch",
      "flop",
      "turn",
      "river",
    ],
    reason:
      "This review note points to later-street action selection, pot control, or barreling decisions.",
    score: 70,
  },
  {
    moduleId: "pot-odds",
    keywords: [
      "pot odds",
      "price",
      "outs",
      "draw",
      "flush draw",
      "straight draw",
      "gutshot",
      "open-ended",
      "equity",
    ],
    reason:
      "This review note sounds driven by draw math, price, or continue-versus-fold uncertainty.",
    score: 68,
  },
  {
    moduleId: "preflop",
    keywords: [
      "preflop",
      "open",
      "3-bet",
      "3bet",
      "4-bet",
      "4bet",
      "squeeze",
      "position",
      "blind vs blind",
    ],
    reason:
      "This review note points back to preflop discipline, position, or re-raise structure.",
    score: 62,
  },
  {
    moduleId: "board-texture",
    keywords: [
      "board texture",
      "dry",
      "wet",
      "dynamic",
      "static",
      "paired board",
      "two-tone",
      "monotone",
      "coordinated",
    ],
    reason:
      "This review note sounds tied to reading the board correctly before choosing a postflop line.",
    score: 60,
  },
  {
    moduleId: "player-types",
    keywords: [
      "player type",
      "calling station",
      "nit",
      "tag",
      "lag",
      "maniac",
      "passive",
      "recreational",
      "population",
    ],
    reason:
      "This review note looks connected to opponent-profile adjustments rather than a pure baseline spot.",
    score: 60,
  },
];

function addCandidate(
  candidates: Map<TrainingModuleId, RecommendationCandidate>,
  candidate: RecommendationCandidate,
) {
  const existingCandidate = candidates.get(candidate.moduleId);

  if (!existingCandidate) {
    candidates.set(candidate.moduleId, candidate);
    return;
  }

  candidates.set(candidate.moduleId, {
    ...(candidate.score > existingCandidate.score ? candidate : existingCandidate),
    supportingLeakTagIds: [
      ...new Set([
        ...existingCandidate.supportingLeakTagIds,
        ...candidate.supportingLeakTagIds,
      ]),
    ],
  });
}

function getNoteSearchText(note: HandReviewNote) {
  return [
    note.title,
    note.streetFocus,
    note.board,
    note.actionHistorySummary,
    note.chosenAction,
    note.uncertainty,
    note.note,
  ]
    .join(" ")
    .toLowerCase();
}

export function getReviewNoteFocusAreas(
  note: HandReviewNote,
  limit = 2,
): RecommendedFocusArea[] {
  const candidates = new Map<TrainingModuleId, RecommendationCandidate>();
  const noteSearchText = getNoteSearchText(note);

  if (note.streetFocus === "flop" || note.streetFocus === "turn" || note.streetFocus === "river") {
    addCandidate(candidates, {
      moduleId: "postflop",
      title: moduleLabels.postflop,
      reason:
        "This saved review is centered on a later-street decision, so the postflop module is the cleanest follow-up study path.",
      heuristicLabel: "Review note heuristic",
      supportingLeakTagIds: note.leakTagIds,
      score: 64,
    });
  }

  for (const keywordRecommendation of keywordRecommendations) {
    if (
      keywordRecommendation.keywords.some((keyword) =>
        noteSearchText.includes(keyword),
      )
    ) {
      addCandidate(candidates, {
        moduleId: keywordRecommendation.moduleId,
        title: moduleLabels[keywordRecommendation.moduleId],
        reason: keywordRecommendation.reason,
        heuristicLabel: "Review note heuristic",
        supportingLeakTagIds: note.leakTagIds,
        score: keywordRecommendation.score,
      });
    }
  }

  for (const leakTagId of note.leakTagIds) {
    const leakTag = leakTagMap[leakTagId];

    if (!leakTag) {
      continue;
    }

    for (const moduleId of leakTag.moduleFocus) {
      if (moduleId === "hand-review") {
        continue;
      }

      addCandidate(candidates, {
        moduleId,
        title: moduleLabels[moduleId],
        reason: `The review note was tagged with ${leakTag.label.toLowerCase()}, which this module trains directly.`,
        heuristicLabel: "Leak-tag heuristic",
        supportingLeakTagIds: [leakTag.id],
        score: 58,
      });
    }
  }

  return [...candidates.values()]
    .sort((left, right) => right.score - left.score)
    .slice(0, limit)
    .map(({ score: _score, ...candidate }) => candidate);
}
