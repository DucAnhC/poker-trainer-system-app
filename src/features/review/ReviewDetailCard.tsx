"use client";

import Link from "next/link";

import { useUiCopy } from "@/components/i18n/UiLanguageProvider";
import { LeakTagBadge } from "@/components/ui/LeakTagBadge";
import { SurfaceCard } from "@/components/ui/SurfaceCard";
import { StatusPill } from "@/components/ui/StatusPill";
import { trainingModules } from "@/data/training-modules";
import { getReviewCopy, getReviewUiLanguage } from "@/features/review/review-copy";
import { positionLabels } from "@/lib/poker/labels";
import { getReviewNoteFocusAreas } from "@/lib/review/review-focus";
import { formatDateTimeLabel } from "@/lib/utils";
import type { HandReviewNote } from "@/types/training";

type ReviewDetailCardProps = {
  note: HandReviewNote | null;
  onDelete: (noteId: string) => void;
  isDeleting?: boolean;
};

function DetailTile({
  label,
  value,
}: {
  label: string;
  value: string | null | undefined;
}) {
  if (!value) {
    return null;
  }

  return (
    <div className="rounded-[22px] border border-white/10 bg-black/12 px-4 py-4">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
        {label}
      </p>
      <p className="mt-2 text-sm leading-6 text-white">{value}</p>
    </div>
  );
}

export function ReviewDetailCard({
  note,
  onDelete,
  isDeleting = false,
}: ReviewDetailCardProps) {
  const uiCopy = useUiCopy();
  const copy = getReviewCopy(getReviewUiLanguage(uiCopy.locale));

  if (!note) {
    return (
      <SurfaceCard className="rounded-[32px] border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.98),rgba(8,15,28,0.96))] p-5 text-white shadow-panel">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-cyan-200/80">
          {copy.detailEyebrow}
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-white">
          {copy.detailTitle}
        </h2>
        <p className="mt-3 text-sm leading-6 text-slate-300">
          {copy.detailBody}
        </p>
      </SurfaceCard>
    );
  }

  const reviewFocusAreas = getReviewNoteFocusAreas(note, 2);

  return (
    <SurfaceCard className="rounded-[32px] border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.98),rgba(8,15,28,0.96))] p-5 text-white shadow-panel">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-cyan-200/20 bg-cyan-300/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-cyan-100">
              {copy.streetFocusLabels[note.streetFocus]}
            </span>
            <span className="rounded-full border border-white/12 bg-black/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-200">
              {formatDateTimeLabel(note.updatedAt)}
            </span>
          </div>
          <h2 className="text-2xl font-semibold text-white">{note.title}</h2>
        </div>

        <button
          type="button"
          onClick={() => onDelete(note.id)}
          disabled={isDeleting}
          className="rounded-full border border-rose-300/35 bg-rose-400/10 px-4 py-2 text-sm font-semibold text-rose-100 transition hover:border-rose-300/50 hover:bg-rose-400/15"
        >
          {isDeleting ? copy.deletingLabel : copy.deleteLabel}
        </button>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2">
        <DetailTile
          label={copy.detailLabels.hero}
          value={note.heroPosition ? positionLabels[note.heroPosition] : null}
        />
        <DetailTile
          label={copy.detailLabels.villain}
          value={note.villainPosition ? positionLabels[note.villainPosition] : null}
        />
        <DetailTile
          label={copy.detailLabels.stack}
          value={
            typeof note.effectiveStackBb === "number"
              ? `${note.effectiveStackBb}bb`
              : null
          }
        />
        <DetailTile label={copy.detailLabels.board} value={note.board} />
      </div>

      <div className="mt-4 space-y-3">
        <DetailTile label={copy.detailLabels.actionHistory} value={note.actionHistorySummary} />
        <DetailTile label={copy.detailLabels.chosenAction} value={note.chosenAction} />
        <DetailTile label={copy.detailLabels.uncertainty} value={note.uncertainty} />
        <DetailTile label={copy.detailLabels.note} value={note.note} />
      </div>

      <div className="mt-4 space-y-2">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
          {copy.detailLabels.leakTags}
        </p>
        <div className="flex flex-wrap gap-2">
          {note.leakTagIds.length > 0 ? (
            note.leakTagIds.map((leakTagId) => (
              <LeakTagBadge key={leakTagId} leakTagId={leakTagId} />
            ))
          ) : (
            <span className="rounded-full border border-white/10 bg-black/16 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-300">
              {copy.noLeakTagsAssigned}
            </span>
          )}
        </div>
      </div>

      {reviewFocusAreas.length > 0 ? (
        <div className="mt-5 rounded-[26px] border border-white/10 bg-black/12 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-200/80">
            {copy.followUpLabel}
          </p>
          <div className="mt-4 space-y-3">
            {reviewFocusAreas.map((focusArea) => {
              const route =
                trainingModules.find((module) => module.id === focusArea.moduleId)
                  ?.route ?? "/dashboard";

              return (
                <div
                  key={focusArea.moduleId}
                  className="rounded-[22px] border border-white/10 bg-black/16 p-4"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <StatusPill tone="gold">{focusArea.heuristicLabel}</StatusPill>
                    <span className="text-sm font-semibold text-white">
                      {focusArea.title}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    {focusArea.reason}
                  </p>
                  <Link
                    href={route}
                    className="mt-4 inline-flex rounded-full border border-white/12 bg-black/15 px-4 py-2 text-sm font-semibold text-white transition hover:border-cyan-300/25 hover:text-cyan-100"
                  >
                    {copy.openModuleLabel}
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      ) : null}
    </SurfaceCard>
  );
}
