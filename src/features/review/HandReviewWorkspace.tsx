"use client";

import { useEffect, useMemo, useState } from "react";

import { useUiCopy } from "@/components/i18n/UiLanguageProvider";
import { SurfaceCard } from "@/components/ui/SurfaceCard";
import {
  createHandReviewNoteId,
} from "@/lib/review/local-hand-review-storage";
import { cn, formatDateTimeLabel } from "@/lib/utils";
import type { HandReviewNote } from "@/types/training";
import { ReviewCard } from "@/features/review/ReviewCard";
import { getReviewCopy, getReviewUiLanguage } from "@/features/review/review-copy";
import { ReviewDetailCard } from "@/features/review/ReviewDetailCard";
import { ReviewForm } from "@/features/review/ReviewForm";
import { type HandReviewDraft } from "@/features/review/review-constants";
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

function WorkspaceStat({
  label,
  value,
  note,
}: {
  label: string;
  value: string;
  note: string;
}) {
  return (
    <div className="rounded-[22px] border border-white/10 bg-black/14 px-4 py-4">
      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-100/55">
        {label}
      </p>
      <p className="mt-2 text-2xl font-semibold text-white">{value}</p>
      <p className="mt-2 text-sm leading-6 text-slate-300">{note}</p>
    </div>
  );
}

export function HandReviewWorkspace() {
  const uiCopy = useUiCopy();
  const copy = getReviewCopy(getReviewUiLanguage(uiCopy.locale));
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
            ? copy.saveSuccessAccount
            : copy.saveSuccessLocal,
      });
      return true;
    } catch (error) {
      setActionMessage({
        tone: "danger",
        text:
          error instanceof Error
            ? error.message
            : copy.saveFailure,
      });
      return false;
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDeleteReview(noteId: string) {
    if (typeof window !== "undefined") {
      const shouldDelete = window.confirm(copy.deleteConfirm);

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
            ? copy.deleteSuccessAccount
            : copy.deleteSuccessLocal,
      });
    } catch (error) {
      setActionMessage({
        tone: "danger",
        text:
          error instanceof Error
            ? error.message
            : copy.deleteFailure,
      });
    } finally {
      setDeletingNoteId(null);
    }
  }

  const lastUpdatedAt = notes[0]?.updatedAt ?? null;

  return (
    <div className="space-y-5">
      <section className="rounded-[34px] border border-emerald-950/18 bg-[linear-gradient(180deg,rgba(4,24,22,0.98),rgba(8,23,32,0.98))] p-5 text-white shadow-panel sm:p-6">
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1.12fr)_340px] xl:items-start">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-cyan-200/20 bg-cyan-300/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-100">
                {copy.pageEyebrow}
              </span>
              <span className="rounded-full border border-white/12 bg-white/[0.06] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/85">
                {storageMode === "account" ? copy.accountMode : copy.localMode}
              </span>
              {userEmail && storageMode === "account" ? (
                <span className="rounded-full border border-white/12 bg-white/[0.06] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/85">
                  {userEmail}
                </span>
              ) : null}
              {isSaving || deletingNoteId ? (
                <span className="rounded-full border border-amber-200/20 bg-amber-300/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-100">
                  {copy.saving}
                </span>
              ) : null}
            </div>

            <div className="space-y-2">
              <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                {copy.pageTitle}
              </h1>
              <p className="max-w-2xl text-sm leading-6 text-slate-300">
                {copy.pageBody}
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <WorkspaceStat
                label={copy.savedReviews}
                value={`${notes.length}`}
                note={storageMode === "account" ? copy.accountMode : copy.localMode}
              />
              <WorkspaceStat
                label={copy.lastUpdated}
                value={hasLoaded ? formatDateTimeLabel(lastUpdatedAt) : "..."}
                note={hasLoaded ? copy.pageBody : copy.loadingBody}
              />
              <WorkspaceStat
                label={copy.leakPeak}
                value={`${getMostTaggedLeakCount(notes)}`}
                note={copy.followUpLabel}
              />
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-black/14 p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-200/80">
              {selectedNote ? copy.detailEyebrow : copy.snapshotLabel}
            </p>
            <div className="mt-3 space-y-3">
              {selectedNote ? (
                <>
                  <h2 className="text-2xl font-semibold tracking-tight text-white">
                    {selectedNote.title}
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-full border border-white/12 bg-black/16 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-200">
                      {copy.streetFocusLabels[selectedNote.streetFocus]}
                    </span>
                    {selectedNote.heroPosition || selectedNote.villainPosition ? (
                      <span className="rounded-full border border-white/12 bg-black/16 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-200">
                        {(selectedNote.heroPosition ?? "Hero") +
                          " vs " +
                          (selectedNote.villainPosition ?? "Villain")}
                      </span>
                    ) : null}
                    {typeof selectedNote.effectiveStackBb === "number" ? (
                      <span className="rounded-full border border-white/12 bg-black/16 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-200">
                        {selectedNote.effectiveStackBb}bb
                      </span>
                    ) : null}
                  </div>

                  <div className="grid gap-3">
                    <div className="rounded-[22px] border border-cyan-300/20 bg-cyan-300/[0.07] p-4">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-100/85">
                        {copy.chosenActionLabel}
                      </p>
                      <p className="mt-2 text-sm font-semibold leading-6 text-white">
                        {selectedNote.chosenAction}
                      </p>
                    </div>
                    <div className="rounded-[22px] border border-white/10 bg-black/16 p-4">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                        {copy.uncertaintyLabel}
                      </p>
                      <p className="mt-2 text-sm leading-6 text-slate-200">
                        {selectedNote.uncertainty}
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <h2 className="text-2xl font-semibold tracking-tight text-white">
                    {copy.detailTitle}
                  </h2>
                  <p className="text-sm leading-6 text-slate-300">
                    {copy.detailBody}
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.1fr)_360px]">
        <ReviewForm
          onSave={handleSaveReview}
          isSubmitting={isSaving}
          storageMode={storageMode}
        />

        <div className="space-y-5">
          <SurfaceCard className="rounded-[32px] border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.98),rgba(8,15,28,0.96))] p-5 text-white shadow-panel">
            <div className="space-y-2">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-cyan-200/80">
                {copy.listEyebrow}
              </p>
              <h2 className="text-2xl font-semibold text-white">{copy.listTitle}</h2>
              <p className="text-sm leading-6 text-slate-300">
                {storageMode === "account"
                  ? copy.listBodyAccount
                  : copy.listBodyLocal}
              </p>
            </div>

            {errorMessage ? (
              <div className="mt-4 rounded-[24px] border border-amber-200/20 bg-amber-300/10 p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-100">
                  {copy.loadIssue}
                </p>
                <p className="mt-2 text-sm leading-6 text-amber-50/90">
                  {errorMessage}
                </p>
                <button
                  type="button"
                  onClick={() => void refreshNotes()}
                  className="mt-4 rounded-full border border-white/12 bg-black/15 px-4 py-2 text-sm font-semibold text-white transition hover:border-cyan-300/25 hover:text-cyan-100"
                >
                  {copy.retry}
                </button>
              </div>
            ) : null}

            {actionMessage ? (
              <div
                className={cn(
                  "mt-4 rounded-[24px] border p-4",
                  actionMessage.tone === "danger"
                    ? "border-rose-200/30 bg-rose-400/10"
                    : "border-emerald-200/20 bg-emerald-300/10",
                )}
              >
                <p
                  className={cn(
                    "text-[11px] font-semibold uppercase tracking-[0.18em]",
                    actionMessage.tone === "danger"
                      ? "text-rose-100"
                      : "text-emerald-100",
                  )}
                >
                  {actionMessage.tone === "danger" ? copy.issueState : copy.savedState}
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-200">
                  {actionMessage.text}
                </p>
              </div>
            ) : null}

            <div className="mt-4 space-y-4">
              {notes.length > 0 ? (
                notes.map((note) => (
                  <ReviewCard
                    key={note.id}
                    note={note}
                    isSelected={note.id === selectedNoteId}
                    onSelect={setSelectedNoteId}
                  />
                ))
              ) : (
                <SurfaceCard className="rounded-[26px] border-dashed border-white/10 bg-black/12 p-5 text-white">
                  <p className="text-sm font-semibold text-white">
                    {hasLoaded ? copy.noSavedTitle : copy.loadingTitle}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    {hasLoaded ? copy.noSavedBody : copy.loadingBody}
                  </p>
                </SurfaceCard>
              )}
            </div>
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
