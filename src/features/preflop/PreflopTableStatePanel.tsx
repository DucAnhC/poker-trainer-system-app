import type { ContentPack, RetryQueueItem } from "@/types/training";

import { PreflopHandVisual } from "@/features/preflop/PreflopHandVisual";
import {
  formatPreflopHistoryStep,
  getPreflopConceptLabel,
  getPreflopDrillCopy,
  getPreflopPackLabel,
  getPreflopPotTypeLabel,
  getPreflopSourceTypeLabel,
  type PreflopUiLanguage,
} from "@/features/preflop/preflop-trainer-copy";

type PreflopTableStatePanelProps = {
  language: PreflopUiLanguage;
  scenario: {
    id: string;
    title: string;
    learningGoal: string;
    difficulty: string;
    sourceType: "simplification" | "baseline" | "exploit";
    heroPosition: string;
    villainPosition?: string;
    handLabel: string;
    effectiveStackBb: number;
    actionHistory: string[];
    potType: "unopened" | "vs-open" | "vs-3bet" | "vs-4bet";
    keyConcepts: string[];
  };
  activeContentPack: ContentPack;
  questionNumber: number;
  totalQuestions: number;
  retryHint?: RetryQueueItem | null;
};

function FactTile({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[20px] border border-white/12 bg-black/14 px-4 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-100/55">
        {label}
      </p>
      <p className="mt-2 text-lg font-semibold text-white">{value}</p>
    </div>
  );
}

export function PreflopTableStatePanel({
  language,
  scenario,
  activeContentPack,
  questionNumber,
  totalQuestions,
  retryHint = null,
}: PreflopTableStatePanelProps) {
  const copy = getPreflopDrillCopy(language);
  const conceptLabels = scenario.keyConcepts.map((conceptId) =>
    getPreflopConceptLabel(conceptId, language),
  );

  return (
    <section className="rounded-[34px] border border-emerald-950/20 bg-[linear-gradient(180deg,rgba(7,30,28,0.97),rgba(8,23,32,0.96))] p-5 text-white shadow-panel sm:p-6">
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full border border-cyan-200/20 bg-cyan-300/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-100">
          {copy.tableStateEyebrow}
        </span>
        <span className="rounded-full border border-white/12 bg-white/[0.06] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/85">
          {questionNumber}/{totalQuestions}
        </span>
        <span className="rounded-full border border-white/12 bg-white/[0.06] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/85">
          {getPreflopSourceTypeLabel(scenario.sourceType, language)}
        </span>
        <span className="rounded-full border border-white/12 bg-white/[0.06] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/85">
          {getPreflopPackLabel(activeContentPack.id, language)}
        </span>
        {retryHint ? (
          <span className="rounded-full border border-amber-200/20 bg-amber-300/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-100">
            {copy.retryLabel}
          </span>
        ) : null}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="rounded-full border border-white/12 bg-black/14 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-200">
          {scenario.title}
        </span>
        {conceptLabels.map((conceptLabel) => (
          <span
            key={`${scenario.id}-${conceptLabel}`}
            className="rounded-full border border-white/12 bg-black/14 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-200"
          >
            {conceptLabel}
          </span>
        ))}
      </div>

      <div className="mt-4 rounded-[30px] border border-emerald-300/14 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.22),rgba(15,23,42,0.08)_42%,rgba(3,7,18,0.18)_100%)] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] sm:p-5">
        <div className="grid gap-4 xl:grid-cols-[260px_minmax(0,1fr)]">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-center gap-2">
              <span className="rounded-full border border-cyan-200/20 bg-cyan-300/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-cyan-100">
                {copy.heroLabel}
              </span>
              <span className="rounded-full border border-white/12 bg-black/16 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-100">
                {scenario.heroPosition}
              </span>
              <span className="rounded-full border border-white/12 bg-black/16 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-100">
                {scenario.effectiveStackBb}bb
              </span>
            </div>

            <PreflopHandVisual handLabel={scenario.handLabel} language={language} />
          </div>

          <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <FactTile label={copy.heroLabel} value={copy.heroValueLabel} />
              <FactTile label={copy.positionLabel} value={scenario.heroPosition} />
              <FactTile label={copy.handLabel} value={scenario.handLabel} />
              <FactTile
                label={copy.villainLabel}
                value={scenario.villainPosition ?? copy.noVillainLabel}
              />
              <FactTile
                label={copy.stackLabel}
                value={`${scenario.effectiveStackBb}bb`}
              />
              <FactTile
                label={copy.spotLabel}
                value={getPreflopPotTypeLabel(scenario.potType, language)}
              />
            </div>

            <div className="rounded-[24px] border border-white/12 bg-black/14 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-100/55">
                {copy.actionLaneLabel}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                {scenario.actionHistory.map((step, index) => (
                  <div
                    key={`${scenario.id}-${step}-${index}`}
                    className="flex items-center gap-2"
                  >
                    {index > 0 ? (
                      <span className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-100/55">
                        {"->"}
                      </span>
                    ) : null}
                    <span className="rounded-full border border-white/12 bg-black/16 px-3 py-2 text-sm font-semibold text-white/92">
                      {formatPreflopHistoryStep(step, language)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[24px] border border-white/12 bg-black/14 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-100/55">
                {copy.focusLabel}
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                {scenario.learningGoal}
              </p>
            </div>
          </div>
        </div>
      </div>

      {retryHint ? (
        <div className="mt-4 rounded-[24px] border border-amber-200/18 bg-amber-300/10 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-100">
            {copy.focusLabel}
          </p>
          <p className="mt-2 text-sm leading-6 text-amber-50/90">{retryHint.reason}</p>
        </div>
      ) : null}
    </section>
  );
}
