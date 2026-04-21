"use client";

import { useEffect, useMemo, useState } from "react";

import { useUiCopy } from "@/components/i18n/UiLanguageProvider";
import {
  ActionHistory,
  BoardCards,
  CoachAnchor,
  SceneHeader,
  SeatBadge,
  SpotTag,
  StatPill,
  TableSceneShell,
} from "@/components/poker-room/PokerRoom";
import { SurfaceCard } from "@/components/ui/SurfaceCard";
import {
  createHandReviewNoteId,
} from "@/lib/review/local-hand-review-storage";
import { extractCardCodes } from "@/lib/poker/cards";
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

function getReviewActionSteps(summary: string) {
  const steps = summary
    .split(/\r?\n|->|>/)
    .map((step) => step.trim())
    .filter(Boolean);

  return steps.length > 0 ? steps : [summary.trim()].filter(Boolean);
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
    <div className="min-w-0 rounded-[22px] border border-white/10 bg-black/14 px-4 py-4">
      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-emerald-100/55">
        {label}
      </p>
      <p className="mt-2 break-words text-xl font-semibold leading-7 text-white text-pretty sm:text-2xl">
        {value}
      </p>
      <p className="mt-2 text-sm leading-6 text-slate-300 text-pretty">{note}</p>
    </div>
  );
}

export function HandReviewWorkspace() {
  const uiCopy = useUiCopy();
  const language = getReviewUiLanguage(uiCopy.locale);
  const copy = getReviewCopy(language);
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
  const selectedBoardCards = selectedNote ? extractCardCodes(selectedNote.board).slice(0, 5) : [];
  const selectedActionSteps = selectedNote
    ? getReviewActionSteps(selectedNote.actionHistorySummary)
    : [];
  const coachActions =
    language === "vi"
      ? [
          {
            label: "Goi y ngan",
            helper: "Tom tat leak hoac next review point rat ngan.",
          },
          {
            label: "Giai thich them",
            helper: "Mo rong vi sao note nay dang quan trong.",
          },
          {
            label: "Tinh huong tuong tu",
            helper: "Goi y mot hand tiep theo de replay.",
          },
        ]
      : [
          {
            label: "Quick hint",
            helper: "A short leak or next-review cue.",
          },
          {
            label: "Explain more",
            helper: "Expand why this note matters.",
          },
          {
            label: "Similar spot",
            helper: "Suggest the next replay hand.",
          },
        ];

  return (
    <div className="space-y-5">
      <TableSceneShell
        header={
          <SceneHeader
            eyebrow={copy.pageEyebrow}
            title={copy.pageTitle}
            description={copy.pageBody}
            tags={
              <>
                <SpotTag tone="cyan">{storageMode === "account" ? copy.accountMode : copy.localMode}</SpotTag>
                {userEmail && storageMode === "account" ? <SpotTag>{userEmail}</SpotTag> : null}
                {isSaving || deletingNoteId ? <SpotTag tone="amber">{copy.saving}</SpotTag> : null}
              </>
            }
            aside={
              <div className="grid gap-3 md:grid-cols-3 2xl:grid-cols-1">
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
            }
          />
        }
        rail={
          <div className="grid gap-3 sm:grid-cols-2 2xl:grid-cols-1">
            <StatPill label={copy.savedReviews} value={`${notes.length}`} />
            <StatPill
              label={copy.lastUpdated}
              value={hasLoaded ? formatDateTimeLabel(lastUpdatedAt) : "..."}
            />
            <StatPill label={copy.leakPeak} value={`${getMostTaggedLeakCount(notes)}`} />
          </div>
        }
        footer={
          selectedNote ? (
            <div className="grid gap-4 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
              <ActionHistory label={copy.detailLabels.actionHistory} steps={selectedActionSteps} />
              <div className="rounded-[24px] border border-white/12 bg-black/14 p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-emerald-100/55">
                  {copy.uncertaintyLabel}
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  {selectedNote.uncertainty}
                </p>
              </div>
            </div>
          ) : undefined
        }
        coach={
          <CoachAnchor
            title={copy.pageEyebrow}
            body={
              language === "vi"
                ? "Review module nay da duoc to chuc nhu mot replay station, va coach seat nay duoc de san cho next hand suggestions, leak recap, va explain follow-up."
                : "This review module is now framed as a replay station, and this coach seat is reserved for next-hand suggestions, leak recaps, and follow-up explanations."
            }
            modeLabel={language === "vi" ? "Study coach" : "Study coach"}
            actions={coachActions}
          />
        }
      >
        {selectedNote ? (
          <div className="space-y-5">
            <div className="flex flex-wrap items-center gap-2">
              <SpotTag tone="cyan">{copy.streetFocusLabels[selectedNote.streetFocus]}</SpotTag>
              {typeof selectedNote.effectiveStackBb === "number" ? (
                <SpotTag>{selectedNote.effectiveStackBb}bb</SpotTag>
              ) : null}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <SeatBadge
                role={copy.heroLabel}
                position={selectedNote.heroPosition ?? copy.notSpecified}
                stack={
                  typeof selectedNote.effectiveStackBb === "number"
                    ? `${selectedNote.effectiveStackBb}bb`
                    : undefined
                }
                tone="cyan"
              />
              <SeatBadge
                role={copy.villainLabel}
                position={selectedNote.villainPosition ?? copy.notSpecified}
                tone="slate"
              />
            </div>

            <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)] xl:items-center">
              <div className="rounded-[28px] border border-white/12 bg-black/18 p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-emerald-100/55">
                  {copy.snapshotLabel}
                </p>
                {selectedBoardCards.length > 0 ? (
                  <div className="mt-4">
                    <BoardCards cards={selectedBoardCards} size="lg" />
                  </div>
                ) : (
                  <p className="mt-4 text-sm leading-6 text-slate-300">
                    {selectedNote.board || copy.boardPlaceholder}
                  </p>
                )}
              </div>

              <div className="grid gap-4">
                <div className="rounded-[24px] border border-cyan-300/20 bg-cyan-300/[0.07] p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-cyan-100/85">
                    {copy.chosenActionLabel}
                  </p>
                  <p className="mt-2 text-sm font-semibold leading-6 text-white">
                    {selectedNote.chosenAction}
                  </p>
                </div>

                <div className="rounded-[24px] border border-white/12 bg-black/18 p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-300">
                    {copy.detailEyebrow}
                  </p>
                  <p className="mt-2 text-xl font-semibold tracking-tight text-white">
                    {selectedNote.title}
                  </p>
                  <p className="mt-3 text-sm leading-6 text-slate-300">
                    {selectedNote.note || copy.detailBody}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-[28px] border border-white/12 bg-black/18 p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-cyan-200/80">
              {copy.snapshotLabel}
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">
              {copy.detailTitle}
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-300">{copy.detailBody}</p>
          </div>
        )}
      </TableSceneShell>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(360px,420px)] xl:items-start">
        <ReviewForm
          onSave={handleSaveReview}
          isSubmitting={isSaving}
          storageMode={storageMode}
        />

        <div className="space-y-5">
          <SurfaceCard className="rounded-[32px] border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.98),rgba(8,15,28,0.96))] p-5 text-white shadow-panel">
            <div className="space-y-2">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-cyan-200/80">
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
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-amber-100">
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
                    "text-[11px] font-semibold uppercase tracking-[0.12em]",
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
