import {
  createEmptyProgressSnapshot,
  readProgressSnapshot,
  replaceProgressSnapshot,
  resetProgressSnapshot,
  type ProgressSnapshot,
} from "@/lib/progress/local-progress-storage";
import {
  readHandReviewNotes,
  replaceHandReviewNotes,
  resetHandReviewNotes,
} from "@/lib/review/local-hand-review-storage";
import type { HandReviewNote } from "@/types/training";

export interface LocalAppSnapshot {
  progress: ProgressSnapshot;
  handReviewNotes: HandReviewNote[];
}

export function createEmptyLocalAppSnapshot(): LocalAppSnapshot {
  return {
    progress: createEmptyProgressSnapshot(),
    handReviewNotes: [],
  };
}

export function readLocalAppSnapshot(): LocalAppSnapshot {
  return {
    progress: readProgressSnapshot(),
    handReviewNotes: readHandReviewNotes(),
  };
}

export function replaceLocalAppSnapshot(
  snapshot: Partial<LocalAppSnapshot> | null | undefined,
) {
  replaceProgressSnapshot(snapshot?.progress);
  replaceHandReviewNotes(
    Array.isArray(snapshot?.handReviewNotes) ? snapshot.handReviewNotes : [],
  );
}

export function resetLocalAppSnapshot() {
  resetProgressSnapshot();
  resetHandReviewNotes();
}
