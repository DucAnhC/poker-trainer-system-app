import { difficultyLabels } from "@/lib/poker/labels";
import { StatusPill } from "@/components/ui/StatusPill";
import type { Difficulty } from "@/types/training";

type DifficultyBadgeProps = {
  difficulty: Difficulty;
};

function getDifficultyTone(difficulty: Difficulty) {
  if (difficulty === "beginner") {
    return "success" as const;
  }

  if (difficulty === "intermediate") {
    return "accent" as const;
  }

  return "gold" as const;
}

export function DifficultyBadge({ difficulty }: DifficultyBadgeProps) {
  return (
    <StatusPill tone={getDifficultyTone(difficulty)}>
      {difficultyLabels[difficulty]}
    </StatusPill>
  );
}
