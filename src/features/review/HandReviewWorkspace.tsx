"use client";

import { useEffect, useMemo, useState } from "react";

import { PageHeader } from "@/components/trainer/PageHeader";
import { ProgressSummaryCard } from "@/components/trainer/ProgressSummaryCard";
import { SurfaceCard } from "@/components/ui/SurfaceCard";
import { StatusPill } from "@/components/ui/StatusPill";
import {
  createHandReviewNoteId,
} from "@/lib/review/local-hand-review-storage";
import { formatDateTimeLabel } from "@/lib/utils";
import type { HandReviewNote } from "@/types/training";
import { type HandReviewDraft } from "@/features/review/review-constants";
import { ReviewCard } from "@/features/review/ReviewCard";
import { ReviewDetailCard } from "@/features/review/ReviewDetailCard";
import { ReviewForm } from "@/features/review/ReviewForm";
import { usePersistedReviewNotes } from "@/features/review/usePersistedReviewNotes";

function getMostTaggedLeakCount(notes: HandReviewNote[]) {
  const counts = new Map<string, number>();

  for (const note of notes) {
    for (const leakTagId of note.leakTagIds) {
      counts.set(leakTagId, (counts.get(leakTagId) ?? 0) + 1);
    }
  }

  return [...counts.values()].sort((left, right) => right - left)[0] ?? 0;
}

export function HandReviewWorkspace() {
  const {
    notes,
    hasLoaded,
    errorMessage,
    deleteNote,
    refreshNotes,
    saveNote,
    storageMode,
    userEmail,
  } = usePersistedReviewNotes();
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingNoteId, setDeletingNoteId] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<{
    tone: "success" | "danger";
    text: string;
  } | null>(null);

  const selectedNote = useMemo(
    () => notes.find((note) => note.id === selectedNoteId) ?? null,
    [notes, selectedNoteId],
  );

  useEffect(() => {
    if (!selectedNoteId && notes.length > 0) {
      setSelectedNoteId(notes[0]?.id ?? null);
    }
  }, [notes, selectedNoteId]);

  async function handleSaveReview(draft: HandReviewDraft) {
    const timestamp = new Date().toISOString();
    const nextNote: HandReviewNote = {
      id: createHandReviewNoteId(),
      ...draft,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    setIsSaving(true);
    setActionMessage(null);

    try {
      await saveNote(nextNote);
      setSelectedNoteId(nextNote.id);
      setActionMessage({
        tone: "success",
        text:
          storageMode === "account"
            ? "Review note saved to the signed-in account."
            : "Review note saved locally in this browser.",
      });
      return true;
    } catch (error) {
      setActionMessage({
        tone: "danger",
        text:
          error instanceof Error
            ? error.message
            : "Failed to save the review note.",
      });
      return false;
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDeleteReview(noteId: string) {
    if (typeof window !== "undefined") {
      const shouldDelete = window.confirm(
        "Delete this saved hand review note?",
      );

      if (!shouldDelete) {
        return;
      }
    }

    setDeletingNoteId(noteId);
    setActionMessage(null);

    try {
      await deleteNote(noteId);
      setSelectedNoteId((currentSelectedNoteId) => {
        if (currentSelectedNoteId !== noteId) {
          return currentSelectedNoteId;
        }

        const remainingNotes = notes.filter((note) => note.id !== noteId);

        return remainingNotes[0]?.id ?? null;
      });
      setActionMessage({
        tone: "success",
        text:
          storageMode === "account"
            ? "Review note removed from the signed-in account."
            : "Review note removed from local browser storage.",
      });
    } catch (error) {
      setActionMessage({
        tone: "danger",
        text:
          error instanceof Error
            ? error.message
            : "Failed to delete the review note.",
      });
    } finally {
      setDeletingNoteId(null);
    }
  }

  const lastUpdatedAt = notes[0]?.updatedAt ?? null;

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Hand Review"
        title="Capture confusing hands, tag the leak, and leave yourself a cleaner study trail"
        description="Review stays tied to study action: save structured notes, assign leak tags manually, and let the dashboard plus settings surfaces keep recent review activity visible alongside training history."
        aside={
          <>
            <StatusPill tone="success">Review flow live</StatusPill>
            <StatusPill>
              {storageMode === "account"
                ? `Syncing to ${userEmail ?? "account"}`
                : "Local notes enabled"}
            </StatusPill>
            {isSaving || deletingNoteId ? <StatusPill tone="gold">Saving changes</StatusPill> : null}
          </>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <ProgressSummaryCard
          title="Saved reviews"
          value={`${notes.length}`}
          description={
            storageMode === "account"
              ? "Structured notes saved to the signed-in account."
              : "Structured notes saved locally in this browser."
          }
          tone="accent"
        />
        <ProgressSummaryCard
          title="Last updated"
          value={hasLoaded ? formatDateTimeLabel(lastUpdatedAt) : "..."}
          description="Most recent manual review note timestamp."
          tone="gold"
        />
        <ProgressSummaryCard
          title="Most tagged leak count"
          value={`${getMostTaggedLeakCount(notes)}`}
          description="Simple signal for whether one leak theme keeps showing up in manual reviews."
          tone="success"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(360px,0.9fr)]">
        <ReviewForm
          onSave={handleSaveReview}
          isSubmitting={isSaving}
          storageMode={storageMode}
        />

        <div className="space-y-6">
          <SurfaceCard className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent-strong">
                Saved reviews
              </p>
              <h2 className="text-2xl font-semibold text-foreground">
                {storageMode === "account" ? "Account note list" : "Local note list"}
              </h2>
              <p className="text-sm leading-6 text-muted-foreground">
                {storageMode === "account"
                  ? "Open a saved note to read it cleanly, then delete it from the account if the spot is no longer useful."
                  : "Open a saved note to read it cleanly, then delete it if the spot is no longer useful."}
              </p>
            </div>

            {errorMessage ? (
              <div className="rounded-2xl border border-amber-200 bg-amber-50/80 p-4">
                <StatusPill tone="danger">Load issue</StatusPill>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {errorMessage}
                </p>
                <button
                  type="button"
                  onClick={() => void refreshNotes()}
                  className="mt-3 rounded-full border border-border bg-white px-4 py-2 text-sm font-semibold text-foreground transition hover:border-accent/40 hover:text-accent-strong"
                >
                  Retry loading notes
                </button>
              </div>
            ) : null}

            {actionMessage ? (
              <div
                className={`rounded-2xl border p-4 ${
                  actionMessage.tone === "danger"
                    ? "border-amber-200 bg-amber-50/80"
                    : "border-emerald-200 bg-emerald-50/70"
                }`}
              >
                <StatusPill tone={actionMessage.tone}>
                  {actionMessage.tone === "danger" ? "Save issue" : "Saved"}
                </StatusPill>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {actionMessage.text}
                </p>
              </div>
            ) : null}

            {notes.length > 0 ? (
              <div className="space-y-4">
                {notes.map((note) => (
                  <ReviewCard
                    key={note.id}
                    note={note}
                    isSelected={note.id === selectedNoteId}
                    onSelect={setSelectedNoteId}
                  />
                ))}
              </div>
            ) : (
              <SurfaceCard className="border border-dashed border-border/80 bg-muted/10 p-5">
                <p className="text-sm font-semibold text-foreground">
                  {hasLoaded ? "No saved reviews yet" : "Loading saved reviews"}
                </p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {hasLoaded
                    ? "Save a note from the form and it will appear here with its leak tags and last-updated time."
                    : "Reading the current review list from the active storage mode."}
                </p>
              </SurfaceCard>
            )}
          </SurfaceCard>

          <ReviewDetailCard
            note={selectedNote}
            onDelete={(noteId) => {
              void handleDeleteReview(noteId);
            }}
            isDeleting={deletingNoteId === selectedNote?.id}
          />
        </div>
      </div>
    </div>
  );
}
