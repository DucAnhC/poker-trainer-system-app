import type {
  Difficulty,
  DifficultyProgressRecord,
} from "@/types/training";

export function calculateAccuracy(correctCount: number, attempts: number) {
  if (attempts <= 0) {
    return 0;
  }

  return (correctCount / attempts) * 100;
}

export function getWeakestDifficultyEntry(
  entries: Array<[Difficulty, DifficultyProgressRecord]>,
) {
  if (entries.length === 0) {
    return null;
  }

  return [...entries].sort((left, right) => {
    const leftAccuracy = calculateAccuracy(
      left[1].correctCount,
      left[1].attempts,
    );
    const rightAccuracy = calculateAccuracy(
      right[1].correctCount,
      right[1].attempts,
    );

    if (leftAccuracy === rightAccuracy) {
      return right[1].attempts - left[1].attempts;
    }

    return leftAccuracy - rightAccuracy;
  })[0];
}
