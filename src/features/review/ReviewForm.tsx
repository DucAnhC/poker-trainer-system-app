"use client";

import { useState } from "react";

import { useUiCopy } from "@/components/i18n/UiLanguageProvider";
import { LeakTagBadge } from "@/components/ui/LeakTagBadge";
import { SurfaceCard } from "@/components/ui/SurfaceCard";
import { leakTags } from "@/data/leak-tags";
import { positions } from "@/data/positions";
import { getReviewCopy, getReviewUiLanguage } from "@/features/review/review-copy";
import { ReviewFieldGroup } from "@/features/review/ReviewFieldGroup";
import {
  createEmptyHandReviewDraft,
  reviewStreetFocusOptions,
  type HandReviewDraft,
} from "@/features/review/review-constants";
import { cn } from "@/lib/utils";
import type { PositionId } from "@/types/poker";
import type { HandReviewNote } from "@/types/training";

type ReviewFormProps = {
  onSave: (draft: HandReviewDraft) => Promise<boolean>;
  isSubmitting?: boolean;
  storageMode?: "local" | "account";
};

type ReviewFormState = {
  title: string;
  streetFocus: HandReviewDraft["streetFocus"];
  heroPosition: PositionId | "";
  villainPosition: PositionId | "";
  effectiveStackBb: string;
  board: string;
  actionHistorySummary: string;
  chosenAction: string;
  uncertainty: string;
  note: string;
  leakTagIds: HandReviewNote["leakTagIds"];
};

const fieldClassName =
  "w-full rounded-[22px] border border-white/12 bg-black/18 px-4 py-3 text-sm text-white shadow-sm outline-none transition placeholder:text-slate-500 focus:border-cyan-300/35 focus:ring-2 focus:ring-cyan-300/10";

function createEmptyReviewFormState(): ReviewFormState {
  const emptyDraft = createEmptyHandReviewDraft();

  return {
    title: emptyDraft.title,
    streetFocus: emptyDraft.streetFocus,
    heroPosition: "",
    villainPosition: "",
    effectiveStackBb: "",
    board: emptyDraft.board,
    actionHistorySummary: emptyDraft.actionHistorySummary,
    chosenAction: emptyDraft.chosenAction,
    uncertainty: emptyDraft.uncertainty,
    note: emptyDraft.note,
    leakTagIds: emptyDraft.leakTagIds,
  };
}

function parseEffectiveStack(value: string) {
  if (value.trim().length === 0) {
    return null;
  }

  const parsedValue = Number(value);

  return Number.isFinite(parsedValue) ? parsedValue : null;
}

export function ReviewForm({
  onSave,
  isSubmitting = false,
  storageMode = "local",
}: ReviewFormProps) {
  const uiCopy = useUiCopy();
  const language = getReviewUiLanguage(uiCopy.locale);
  const copy = getReviewCopy(language);
  const [formState, setFormState] = useState<ReviewFormState>(
    createEmptyReviewFormState(),
  );
  const heroPositionLabel =
    positions.find((position) => position.id === formState.heroPosition)?.label ??
    copy.notSpecified;
  const villainPositionLabel =
    positions.find((position) => position.id === formState.villainPosition)?.label ??
    copy.notSpecified;
  const selectedLeakCount = formState.leakTagIds.length;
  const boardPreview = formState.board.trim();
  const chosenActionPreview = formState.chosenAction.trim();
  const uncertaintyPreview = formState.uncertainty.trim();

  function updateField<Key extends keyof ReviewFormState>(
    key: Key,
    value: ReviewFormState[Key],
  ) {
    setFormState((currentState) => ({
      ...currentState,
      [key]: value,
    }));
  }

  function handleToggleLeakTag(leakTagId: string) {
    setFormState((currentState) => {
      const hasLeakTag = currentState.leakTagIds.includes(leakTagId);

      return {
        ...currentState,
        leakTagIds: hasLeakTag
          ? currentState.leakTagIds.filter((currentId) => currentId !== leakTagId)
          : [...currentState.leakTagIds, leakTagId],
      };
    });
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const didSave = await onSave({
      title: formState.title.trim(),
      streetFocus: formState.streetFocus,
      heroPosition: formState.heroPosition || null,
      villainPosition: formState.villainPosition || null,
      effectiveStackBb: parseEffectiveStack(formState.effectiveStackBb),
      board: formState.board.trim(),
      actionHistorySummary: formState.actionHistorySummary.trim(),
      chosenAction: formState.chosenAction.trim(),
      uncertainty: formState.uncertainty.trim(),
      note: formState.note.trim(),
      leakTagIds: formState.leakTagIds,
    });

    if (didSave) {
      setFormState(createEmptyReviewFormState());
    }
  }

  return (
    <SurfaceCard className="rounded-[34px] border-slate-900/70 bg-[linear-gradient(180deg,rgba(15,23,42,0.98),rgba(8,15,28,0.96))] p-5 text-white shadow-panel sm:p-6">
      <div className="space-y-2">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-cyan-200/80">
          {copy.formEyebrow}
        </p>
        <h2 className="text-[1.9rem] font-semibold tracking-tight text-white">
          {copy.formTitle}
        </h2>
        <p className="text-sm leading-6 text-slate-300">{copy.formBody}</p>
      </div>

      <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
        <div className="rounded-[30px] border border-white/12 bg-[radial-gradient(circle_at_top,rgba(34,197,94,0.18),rgba(8,23,42,0.08)_42%,rgba(3,7,18,0.22)_100%)] p-4 sm:p-5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-cyan-200/20 bg-cyan-300/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-cyan-100">
              {copy.snapshotLabel}
            </span>
            <span className="rounded-full border border-white/12 bg-black/16 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-200">
              {copy.streetFocusLabels[formState.streetFocus]}
            </span>
            {selectedLeakCount > 0 ? (
              <span className="rounded-full border border-amber-200/20 bg-amber-300/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-amber-100">
                {copy.leakTagsLabel} x{selectedLeakCount}
              </span>
            ) : null}
          </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
            <div className="rounded-[24px] border border-white/12 bg-black/18 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-300">
                {copy.titleLabel}
              </p>
              <p className="mt-2 text-xl font-semibold tracking-tight text-white">
                {formState.title.trim() || copy.titlePlaceholder}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-full border border-white/12 bg-black/16 px-3 py-2 text-sm font-semibold text-white/92">
                  {copy.heroLabel}: {heroPositionLabel}
                </span>
                <span className="rounded-full border border-white/12 bg-black/16 px-3 py-2 text-sm font-semibold text-white/92">
                  {copy.villainLabel}: {villainPositionLabel}
                </span>
                <span className="rounded-full border border-white/12 bg-black/16 px-3 py-2 text-sm font-semibold text-white/92">
                  {copy.stackLabel}:{" "}
                  {formState.effectiveStackBb.trim()
                    ? `${formState.effectiveStackBb.trim()}bb`
                    : "--"}
                </span>
              </div>

              <div className="mt-4 rounded-[20px] border border-white/10 bg-black/18 px-4 py-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                  {copy.boardLabel}
                </p>
                <p className="mt-2 text-sm font-semibold text-white">
                  {boardPreview || copy.boardPlaceholder}
                </p>
              </div>
            </div>

            <div className="grid gap-4">
              <div className="rounded-[24px] border border-cyan-300/20 bg-cyan-300/[0.07] p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-100/85">
                  {copy.chosenActionLabel}
                </p>
                <p className="mt-2 text-sm font-semibold leading-6 text-white">
                  {chosenActionPreview || copy.chosenActionPlaceholder}
                </p>
              </div>

              <div className="rounded-[24px] border border-white/12 bg-black/18 p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-300">
                  {copy.uncertaintyLabel}
                </p>
                <p className="mt-2 text-sm font-semibold leading-6 text-white">
                  {uncertaintyPreview || copy.uncertaintyPlaceholder}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-[28px] border border-white/10 bg-black/12 p-4 sm:p-5">
          <div className="space-y-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-200/80">
              {copy.snapshotLabel}
            </p>
          </div>

          <div className="mt-4 space-y-5">
            <ReviewFieldGroup
              label={copy.titleLabel}
              hint={copy.titleHint}
            >
              <input
                required
                value={formState.title}
                onChange={(event) => updateField("title", event.target.value)}
                disabled={isSubmitting}
                className={fieldClassName}
                placeholder={copy.titlePlaceholder}
              />
            </ReviewFieldGroup>

            <div className="grid gap-4 md:grid-cols-2">
              <ReviewFieldGroup label={copy.focusLabel}>
                <select
                  value={formState.streetFocus}
                  onChange={(event) =>
                    updateField(
                      "streetFocus",
                      event.target.value as ReviewFormState["streetFocus"],
                    )
                  }
                  disabled={isSubmitting}
                  className={fieldClassName}
                >
                  {reviewStreetFocusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {copy.streetFocusLabels[option.value]}
                    </option>
                  ))}
                </select>
              </ReviewFieldGroup>

              <ReviewFieldGroup
                label={copy.stackLabel}
                hint={copy.stackHint}
              >
                <input
                  value={formState.effectiveStackBb}
                  onChange={(event) =>
                    updateField("effectiveStackBb", event.target.value)
                  }
                  disabled={isSubmitting}
                  inputMode="numeric"
                  className={fieldClassName}
                  placeholder={copy.stackPlaceholder}
                />
              </ReviewFieldGroup>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <ReviewFieldGroup label={copy.heroLabel}>
                <select
                  value={formState.heroPosition}
                  onChange={(event) =>
                    updateField(
                      "heroPosition",
                      event.target.value as ReviewFormState["heroPosition"],
                    )
                  }
                  disabled={isSubmitting}
                  className={fieldClassName}
                >
                  <option value="">{copy.notSpecified}</option>
                  {positions.map((position) => (
                    <option key={position.id} value={position.id}>
                      {position.label}
                    </option>
                  ))}
                </select>
              </ReviewFieldGroup>

              <ReviewFieldGroup label={copy.villainLabel}>
                <select
                  value={formState.villainPosition}
                  onChange={(event) =>
                    updateField(
                      "villainPosition",
                      event.target.value as ReviewFormState["villainPosition"],
                    )
                  }
                  disabled={isSubmitting}
                  className={fieldClassName}
                >
                  <option value="">{copy.notSpecified}</option>
                  {positions.map((position) => (
                    <option key={position.id} value={position.id}>
                      {position.label}
                    </option>
                  ))}
                </select>
              </ReviewFieldGroup>
            </div>

            <ReviewFieldGroup
              label={copy.boardLabel}
              hint={copy.boardHint}
            >
              <input
                value={formState.board}
                onChange={(event) => updateField("board", event.target.value)}
                disabled={isSubmitting}
                className={fieldClassName}
                placeholder={copy.boardPlaceholder}
              />
            </ReviewFieldGroup>
          </div>
        </div>

        <div className="rounded-[28px] border border-white/10 bg-black/12 p-4 sm:p-5">
          <div className="space-y-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-200/80">
              {copy.decisionNoteLabel}
            </p>
          </div>

          <div className="mt-4 space-y-5">
            <ReviewFieldGroup
              label={copy.actionHistoryLabel}
              hint={copy.actionHistoryHint}
            >
              <textarea
                required
                rows={4}
                value={formState.actionHistorySummary}
                onChange={(event) =>
                  updateField("actionHistorySummary", event.target.value)
                }
                disabled={isSubmitting}
                className={cn(fieldClassName, "min-h-28 resize-y")}
                placeholder={copy.actionHistoryPlaceholder}
              />
            </ReviewFieldGroup>

            <div className="grid gap-4 md:grid-cols-2">
              <ReviewFieldGroup
                label={copy.chosenActionLabel}
                hint={copy.chosenActionHint}
              >
                <input
                  required
                  value={formState.chosenAction}
                  onChange={(event) =>
                    updateField("chosenAction", event.target.value)
                  }
                  disabled={isSubmitting}
                  className={fieldClassName}
                  placeholder={copy.chosenActionPlaceholder}
                />
              </ReviewFieldGroup>

              <ReviewFieldGroup
                label={copy.uncertaintyLabel}
                hint={copy.uncertaintyHint}
              >
                <input
                  required
                  value={formState.uncertainty}
                  onChange={(event) => updateField("uncertainty", event.target.value)}
                  disabled={isSubmitting}
                  className={fieldClassName}
                  placeholder={copy.uncertaintyPlaceholder}
                />
              </ReviewFieldGroup>
            </div>

            <ReviewFieldGroup
              label={copy.noteLabel}
              hint={copy.noteHint}
            >
              <textarea
                rows={3}
                value={formState.note}
                onChange={(event) => updateField("note", event.target.value)}
                disabled={isSubmitting}
                className={cn(fieldClassName, "min-h-24 resize-y")}
                placeholder={copy.notePlaceholder}
              />
            </ReviewFieldGroup>
          </div>
        </div>

        <div className="rounded-[28px] border border-white/10 bg-black/12 p-4 sm:p-5">
          <div className="space-y-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-200/80">
              {copy.leakTagsLabel}
            </p>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {leakTags.map((leakTag) => {
              const isSelected = formState.leakTagIds.includes(leakTag.id);

              return (
                <label
                  key={leakTag.id}
                  className={cn(
                    "flex cursor-pointer gap-3 rounded-[22px] border border-white/10 bg-black/12 p-4 transition hover:border-cyan-300/25 hover:bg-cyan-300/[0.06]",
                    isSelected && "border-cyan-300/30 bg-cyan-300/[0.08]",
                  )}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => handleToggleLeakTag(leakTag.id)}
                    disabled={isSubmitting}
                    className="mt-1 h-4 w-4 rounded border-white/20 bg-transparent text-cyan-300 focus:ring-cyan-300/30"
                  />
                  <div className="space-y-2">
                    <LeakTagBadge leakTag={leakTag} />
                    <p className="text-xs leading-5 text-slate-400">
                      {leakTag.description}
                    </p>
                  </div>
                </label>
              );
            })}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 rounded-[24px] border border-white/10 bg-black/12 p-4">
          <div className="space-y-1">
            <p className="text-xs leading-5 text-slate-400">
              {storageMode === "account" ? copy.storageAccount : copy.storageLocal}
            </p>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
              {copy.leakTagsLabel}: {selectedLeakCount}
            </p>
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-full bg-[linear-gradient(135deg,rgba(34,197,94,0.98),rgba(6,182,212,0.96))] px-6 py-3.5 text-sm font-semibold uppercase tracking-[0.16em] text-white shadow-[0_24px_50px_-24px_rgba(34,197,94,0.72)] transition hover:brightness-105"
          >
            {isSubmitting ? copy.savingLabel : copy.saveLabel}
          </button>
        </div>
      </form>
    </SurfaceCard>
  );
}
