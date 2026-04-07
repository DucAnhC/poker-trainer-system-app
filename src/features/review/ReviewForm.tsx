"use client";

import { useState } from "react";

import { LeakTagBadge } from "@/components/ui/LeakTagBadge";
import { SurfaceCard } from "@/components/ui/SurfaceCard";
import { leakTags } from "@/data/leak-tags";
import { positions } from "@/data/positions";
import { cn } from "@/lib/utils";
import type { PositionId } from "@/types/poker";
import type { HandReviewNote, ReviewStreetFocus } from "@/types/training";
import {
  createEmptyHandReviewDraft,
  reviewStreetFocusOptions,
  type HandReviewDraft,
} from "@/features/review/review-constants";
import { ReviewFieldGroup } from "@/features/review/ReviewFieldGroup";

type ReviewFormProps = {
  onSave: (draft: HandReviewDraft) => Promise<boolean>;
  isSubmitting?: boolean;
  storageMode?: "local" | "account";
};

type ReviewFormState = {
  title: string;
  streetFocus: ReviewStreetFocus;
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
  "w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm text-foreground shadow-sm outline-none transition placeholder:text-muted-foreground focus:border-accent/40 focus:ring-2 focus:ring-accent/10";

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
  const [formState, setFormState] = useState<ReviewFormState>(
    createEmptyReviewFormState(),
  );

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
    <SurfaceCard className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent-strong">
          New review
        </p>
        <h2 className="text-2xl font-semibold text-foreground">
          Capture one hand or one decision point
        </h2>
        <p className="text-sm leading-6 text-muted-foreground">
          Keep the note structured and practical. This is a manual review tool,
          not a hand-history parser.
        </p>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit}>
        <ReviewFieldGroup
          label="Title"
          hint="Short label for the hand, spot, or leak you want to remember."
        >
          <input
            required
            value={formState.title}
            onChange={(event) => updateField("title", event.target.value)}
            disabled={isSubmitting}
            className={fieldClassName}
            placeholder="Example: BTN vs BB top pair river fold"
          />
        </ReviewFieldGroup>

        <div className="grid gap-4 md:grid-cols-2">
          <ReviewFieldGroup label="Street focus">
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
                  {option.label}
                </option>
              ))}
            </select>
          </ReviewFieldGroup>

          <ReviewFieldGroup
            label="Effective stack"
            hint="Optional. Use big blinds when that helps the review."
          >
            <input
              value={formState.effectiveStackBb}
              onChange={(event) =>
                updateField("effectiveStackBb", event.target.value)
              }
              disabled={isSubmitting}
              inputMode="numeric"
              className={fieldClassName}
              placeholder="100"
            />
          </ReviewFieldGroup>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <ReviewFieldGroup label="Hero position">
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
              <option value="">Not specified</option>
              {positions.map((position) => (
                <option key={position.id} value={position.id}>
                  {position.label}
                </option>
              ))}
            </select>
          </ReviewFieldGroup>

          <ReviewFieldGroup label="Villain position">
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
              <option value="">Not specified</option>
              {positions.map((position) => (
                <option key={position.id} value={position.id}>
                  {position.label}
                </option>
              ))}
            </select>
          </ReviewFieldGroup>
        </div>

        <ReviewFieldGroup
          label="Board"
          hint="Optional. Use a simple text format like Ah Kd 7c when relevant."
        >
          <input
            value={formState.board}
            onChange={(event) => updateField("board", event.target.value)}
            disabled={isSubmitting}
            className={fieldClassName}
            placeholder="Ah Kd 7c"
          />
        </ReviewFieldGroup>

        <ReviewFieldGroup
          label="Action history summary"
          hint="Describe the line briefly so the future you can reconstruct the spot."
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
            placeholder="CO opens, BTN calls, BB folds. Flop Qh 8h 4c, CO c-bets one-third pot..."
          />
        </ReviewFieldGroup>

        <div className="grid gap-4 md:grid-cols-2">
          <ReviewFieldGroup
            label="Your chosen action"
            hint="What you actually did or wanted to do in the spot."
          >
            <input
              required
              value={formState.chosenAction}
              onChange={(event) =>
                updateField("chosenAction", event.target.value)
              }
              disabled={isSubmitting}
              className={fieldClassName}
              placeholder="Called river raise"
            />
          </ReviewFieldGroup>

          <ReviewFieldGroup
            label="What are you unsure about?"
            hint="Focus the review on the real decision question."
          >
            <input
              required
              value={formState.uncertainty}
              onChange={(event) => updateField("uncertainty", event.target.value)}
              disabled={isSubmitting}
              className={fieldClassName}
              placeholder="Was this a disciplined fold or too tight?"
            />
          </ReviewFieldGroup>
        </div>

        <ReviewFieldGroup
          label="Optional note"
          hint="Use this for takeaways, reads, or mental-game context."
        >
          <textarea
            rows={3}
            value={formState.note}
            onChange={(event) => updateField("note", event.target.value)}
            disabled={isSubmitting}
            className={cn(fieldClassName, "min-h-24 resize-y")}
            placeholder="I may have let the previous bad beat affect this decision."
          />
        </ReviewFieldGroup>

        <div className="space-y-3">
          <div className="space-y-1">
            <p className="text-sm font-semibold text-foreground">Leak tags</p>
            <p className="text-xs leading-5 text-muted-foreground">
              Pick any tags that help classify the leak or uncertainty. These are
              learner-facing heuristics, not perfect diagnoses.
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            {leakTags.map((leakTag) => {
              const isSelected = formState.leakTagIds.includes(leakTag.id);

              return (
                <label
                  key={leakTag.id}
                  className={cn(
                    "flex cursor-pointer gap-3 rounded-2xl border border-border/70 bg-muted/20 p-4 transition hover:border-accent/30 hover:bg-accent/5",
                    isSelected && "border-accent/35 bg-accent/5",
                  )}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => handleToggleLeakTag(leakTag.id)}
                    disabled={isSubmitting}
                    className="mt-1 h-4 w-4 rounded border-border text-accent-strong focus:ring-accent/30"
                  />
                  <div className="space-y-2">
                    <LeakTagBadge leakTag={leakTag} />
                    <p className="text-xs leading-5 text-muted-foreground">
                      {leakTag.description}
                    </p>
                  </div>
                </label>
              );
            })}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border/70 pt-4">
          <p className="text-xs leading-5 text-muted-foreground">
            {storageMode === "account"
              ? "Saved notes write to the signed-in account and can sync across future sessions."
              : "Saved notes stay local to this browser through localStorage."}
          </p>
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-full bg-accent-strong px-5 py-3 text-sm font-semibold text-white transition hover:bg-accent"
          >
            {isSubmitting ? "Saving review note..." : "Save review note"}
          </button>
        </div>
      </form>
    </SurfaceCard>
  );
}
