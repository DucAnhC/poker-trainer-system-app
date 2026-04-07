import type {
  RationaleBlock,
  TrainingScenario,
} from "@/types/training";
import { sourceTypeDescriptions } from "@/lib/poker/labels";
import { getConceptLabel } from "@/lib/training/concepts";

export interface ExplanationSection {
  id: string;
  eyebrow: string;
  title: string;
  blocks: RationaleBlock[];
}

export interface ExplanationOverview {
  keyConceptLabels: string[];
  sourceTypeNote: string;
}

const explanationSectionDefinitions: Array<{
  id: string;
  eyebrow: string;
  title: string;
  kinds: RationaleBlock["kind"][];
  hideWhenCorrect?: boolean;
}> = [
  {
    id: "answer-summary",
    eyebrow: "Answer summary",
    title: "What the stored training answer is saying",
    kinds: ["answer"],
  },
  {
    id: "why-it-fits",
    eyebrow: "Why it fits",
    title: "The main range, board, and action reasons behind the line",
    kinds: ["core-reason", "context-factor"],
  },
  {
    id: "weaker-lines",
    eyebrow: "Why other lines are weaker",
    title: "Tempting alternatives that lose value or clarity here",
    kinds: ["alternative-action"],
  },
  {
    id: "mistake-pattern",
    eyebrow: "Mistake pattern",
    title: "What the wrong answer often gets wrong",
    kinds: ["mistake-correction"],
    hideWhenCorrect: true,
  },
];

function sortBlocksByDisplayOrder(blocks: RationaleBlock[]) {
  const kindOrder: Record<RationaleBlock["kind"], number> = {
    answer: 0,
    "core-reason": 1,
    "context-factor": 2,
    "alternative-action": 3,
    "mistake-correction": 4,
    assumption: 5,
  };

  return [...blocks].sort(
    (left, right) => kindOrder[left.kind] - kindOrder[right.kind],
  );
}

export function getExplanationSections(
  scenario: TrainingScenario,
  isCorrect: boolean,
): ExplanationSection[] {
  return explanationSectionDefinitions
    .map((sectionDefinition) => {
      if (sectionDefinition.hideWhenCorrect && isCorrect) {
        return null;
      }

      const blocks = sortBlocksByDisplayOrder(
        scenario.rationaleBlocks.filter((rationaleBlock) =>
          sectionDefinition.kinds.includes(rationaleBlock.kind),
        ),
      );

      if (blocks.length === 0) {
        return null;
      }

      return {
        id: sectionDefinition.id,
        eyebrow: sectionDefinition.eyebrow,
        title: sectionDefinition.title,
        blocks,
      };
    })
    .filter((section): section is ExplanationSection => section !== null);
}

export function getExplanationOverview(
  scenario: TrainingScenario,
): ExplanationOverview {
  return {
    keyConceptLabels: scenario.keyConcepts.map((keyConcept) =>
      getConceptLabel(keyConcept),
    ),
    sourceTypeNote: sourceTypeDescriptions[scenario.sourceType],
  };
}
