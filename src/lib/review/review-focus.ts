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
      "kìm pot",
      "kiểm soát pot",
      "barrel turn",
      "bắt bluff",
    ],
    reason:
      "Ghi chú này đang trỏ tới quyết định ở street sau, kìm cỡ pot hoặc nhịp barrel.",
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
      "giá",
      "outs",
      "draw",
    ],
    reason:
      "Ghi chú này nghe như đang vướng ở toán draw, giá call hoặc quyết định tiếp tục hay fold.",
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
      "vị trí",
      "mù đối đầu mù",
    ],
    reason:
      "Ghi chú này đang quay về kỷ luật preflop, vị trí hoặc cấu trúc re-raise.",
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
      "kết cấu board",
      "board khô",
      "board động",
      "liên kết",
    ],
    reason:
      "Ghi chú này gắn với việc đọc đúng kết cấu board trước khi chốt line postflop.",
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
      "kiểu người chơi",
      "read",
      "xu hướng",
    ],
    reason:
      "Ghi chú này có vẻ liên quan tới điều chỉnh theo kiểu đối thủ hơn là một tình huống cơ bản thuần túy.",
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
        "Ghi chú đã lưu này xoay quanh một quyết định ở street sau, nên bài luyện Postflop là bước ôn tiếp sạch nhất.",
      heuristicLabel: "Gợi ý từ ghi chú",
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
        heuristicLabel: "Gợi ý từ ghi chú",
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
        reason: `Ghi chú này đã được gắn nhãn ${leakTag.label.toLowerCase()}, và module này luyện trực tiếp đúng leak đó.`,
        heuristicLabel: "Gợi ý từ leak",
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
