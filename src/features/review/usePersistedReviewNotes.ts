"use client";

import {
  deleteCloudHandReviewNote,
  persistCloudHandReviewNote,
} from "@/lib/persistence/cloud-app-data";
import {
  deleteHandReviewNote,
  saveHandReviewNote,
} from "@/lib/review/local-hand-review-storage";
import { usePersistedAppSnapshot } from "@/features/persistence/usePersistedAppSnapshot";
import type { HandReviewNote } from "@/types/training";

export function usePersistedReviewNotes() {
  const {
    hasLoaded,
    loadError,
    refreshSnapshot,
    snapshot,
    storageMode,
    userEmail,
  } = usePersistedAppSnapshot();
  const notes = snapshot.handReviewNotes;

  async function saveNote(note: HandReviewNote) {
    if (storageMode === "account") {
      await persistCloudHandReviewNote(note);
      await refreshSnapshot();
      return;
    }

    saveHandReviewNote(note);
    await refreshSnapshot();
  }

  async function deleteNote(noteId: string) {
    if (storageMode === "account") {
      await deleteCloudHandReviewNote(noteId);
      await refreshSnapshot();
      return;
    }

    deleteHandReviewNote(noteId);
    await refreshSnapshot();
  }

  return {
    notes,
    hasLoaded,
    errorMessage: loadError,
    refreshNotes: refreshSnapshot,
    saveNote,
    deleteNote,
    storageMode,
    userEmail,
  };
}
