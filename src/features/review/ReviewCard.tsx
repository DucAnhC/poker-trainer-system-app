"use client";

import { useUiCopy } from "@/components/i18n/UiLanguageProvider";
import { BoardCards } from "@/components/poker-room/PokerRoom";
import { LeakTagBadge } from "@/components/ui/LeakTagBadge";
import { SurfaceCard } from "@/components/ui/SurfaceCard";
import { getReviewCopy, getReviewUiLanguage } from "@/features/review/review-copy";
import { extractCardCodes } from "@/lib/poker/cards";
import { cn, formatDateTimeLabel } from "@/lib/utils";
import type { HandReviewNote } from "@/types/training";

type ReviewCardProps = {
  note: HandReviewNote;
  isSelected: boolean;
  onSelect: (noteId: string) => void;
};

export function ReviewCard({ note, isSelected, onSelect }: ReviewCardProps) {
  const uiCopy = useUiCopy();
  const copy = getReviewCopy(getReviewUiLanguage(uiCopy.locale));
  const boardCards = extractCardCodes(note.board).slice(0, 5);
  const spotLabel =
    note.heroPosition || note.villainPosition
      ? `${note.heroPosition ?? "Hero"} vs ${note.villainPosition ?? "Villain"}`
      : null;

  return (
    <button
      type="button"
      onClick={() => onSelect(note.id)}
      className="w-full text-left"
    >
      <SurfaceCard
        className={cn(
          "space-y-4 rounded-[28px] border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.98),rgba(8,15,28,0.96))] p-5 text-white transition hover:border-cyan-300/25 hover:bg-[linear-gradient(180deg,rgba(18,30,52,0.98),rgba(8,15,28,0.96))]",
          isSelected &&
            "border-cyan-300/35 bg-[linear-gradient(180deg,rgba(8,47,73,0.95),rgba(8,15,28,0.96))] shadow-[0_24px_52px_-28px_rgba(34,211,238,0.45)]",
        )}
      >
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-cyan-200/20 bg-cyan-300/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-cyan-100">
            {copy.streetFocusLabels[note.streetFocus]}
          </span>
          {spotLabel ? (
            <span className="rounded-full border border-white/12 bg-black/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-200">
              {spotLabel}
            </span>
          ) : null}
          <span className="rounded-full border border-white/12 bg-black/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-200">
            {formatDateTimeLabel(note.updatedAt)}
          </span>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-white">{note.title}</h3>
          <div className="rounded-[20px] border border-white/10 bg-black/16 px-4 py-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              {copy.chosenActionLabel}
            </p>
            <p className="mt-2 text-sm font-semibold leading-6 text-white">
              {note.chosenAction}
            </p>
          </div>
          <p className="line-clamp-2 text-sm leading-6 text-slate-300">
            {note.uncertainty}
          </p>
        </div>

        <div className="space-y-3">
          {boardCards.length > 0 ? (
            <BoardCards cards={boardCards} size="sm" />
          ) : note.board ? (
            <span className="rounded-full border border-white/10 bg-black/16 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-300">
              {note.board}
            </span>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {typeof note.effectiveStackBb === "number" ? (
            <span className="rounded-full border border-white/10 bg-black/16 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-300">
              {note.effectiveStackBb}bb
            </span>
          ) : null}
          {note.leakTagIds.length > 0 ? (
            note.leakTagIds.slice(0, 3).map((leakTagId) => (
              <LeakTagBadge key={leakTagId} leakTagId={leakTagId} />
            ))
          ) : (
            <span className="rounded-full border border-white/10 bg-black/16 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-300">
              {copy.noLeakTags}
            </span>
          )}
        </div>
      </SurfaceCard>
    </button>
  );
}
