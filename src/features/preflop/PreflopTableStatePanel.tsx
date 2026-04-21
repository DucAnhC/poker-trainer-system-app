import {
  ActionHistory,
  CoachAnchor,
  SceneHeader,
  SeatBadge,
  SpotTag,
  StatPill,
  TableSceneShell,
} from "@/components/poker-room/PokerRoom";
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
  const formattedHistory = scenario.actionHistory.map((step) =>
    formatPreflopHistoryStep(step, language),
  );
  const coachActions =
    language === "vi"
      ? [
          {
            label: "Goi y ngan",
            helper: "Nudge ngan dua tren vi tri va action history.",
          },
          {
            label: "Vi sao line nay",
            helper: "Reveal giai thich tiep theo se bam vao concept chinh.",
          },
          {
            label: "Tinh huong tuong tu",
            helper: "Chuan bi cho compare spot o cung family hand.",
          },
        ]
      : [
          {
            label: "Quick hint",
            helper: "A short nudge built from seat and action history.",
          },
          {
            label: "Why this line",
            helper: "The reveal explanation will stay tied to the main concept.",
          },
          {
            label: "Similar spot",
            helper: "Reserved for a follow-up hand from the same family.",
          },
        ];

  return (
    <TableSceneShell
      header={
        <SceneHeader
          eyebrow={copy.tableStateEyebrow}
          title={scenario.title}
          description={scenario.learningGoal}
          tags={
            <>
              <SpotTag tone="cyan">{questionNumber}/{totalQuestions}</SpotTag>
              <SpotTag>{getPreflopSourceTypeLabel(scenario.sourceType, language)}</SpotTag>
              <SpotTag>{getPreflopPackLabel(activeContentPack.id, language)}</SpotTag>
              <SpotTag tone="emerald">
                {getPreflopPotTypeLabel(scenario.potType, language)}
              </SpotTag>
              {retryHint ? <SpotTag tone="amber">{copy.retryLabel}</SpotTag> : null}
            </>
          }
          aside={
            <div className="grid gap-3 sm:grid-cols-2 2xl:grid-cols-1">
              <StatPill label={copy.handLabel} value={scenario.handLabel} />
              <StatPill
                label={copy.stackLabel}
                value={`${scenario.effectiveStackBb}bb`}
              />
            </div>
          }
        />
      }
      footer={
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1.12fr)_minmax(0,0.88fr)]">
          <ActionHistory label={copy.actionLaneLabel} steps={formattedHistory} />
          <div className="rounded-[24px] border border-white/12 bg-black/14 p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-emerald-100/55">
              {copy.focusLabel}
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              {scenario.learningGoal}
            </p>
            {retryHint ? (
              <div className="mt-4 rounded-[20px] border border-amber-200/18 bg-amber-300/10 p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-amber-100">
                  {copy.retryLabel}
                </p>
                <p className="mt-2 text-sm leading-6 text-amber-50/90">
                  {retryHint.reason}
                </p>
              </div>
            ) : null}
          </div>
        </div>
      }
      coach={
        <CoachAnchor
          title={language === "vi" ? "Cue nhanh truoc khi chot" : "Quick cue before you lock"}
          body={
            language === "vi"
              ? "Doc vi tri, stack va action history truoc khi khoa line. Coach se khong lo dap an truoc reveal."
              : "Read position, stack depth, and prior action before locking the line. The coach stays short and does not reveal the answer before commit."
          }
          modeLabel={language === "vi" ? "Nudge coach" : "Nudge coach"}
          actions={coachActions}
        />
      }
    >
      <div className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <SeatBadge
            role={copy.heroValueLabel}
            position={scenario.heroPosition}
            stack={`${scenario.effectiveStackBb}bb`}
            tone="cyan"
          />
          <SeatBadge
            role={copy.villainLabel}
            position={scenario.villainPosition ?? copy.noVillainLabel}
            tone="slate"
          />
        </div>

        <div className="rounded-[30px] border border-white/10 bg-black/14 p-4 sm:p-5">
          <PreflopHandVisual handLabel={scenario.handLabel} language={language} />
        </div>

        <div className="rounded-[26px] border border-white/12 bg-black/18 p-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-emerald-100/55">
                {copy.spotLabel}
              </p>
              <p className="mt-2 break-words text-xl font-semibold leading-7 text-white text-pretty">
                {getPreflopPotTypeLabel(scenario.potType, language)}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <SpotTag tone="cyan" className="text-sm tracking-[0.08em] normal-case">
                {scenario.handLabel}
              </SpotTag>
              {conceptLabels.map((conceptLabel) => (
                <SpotTag key={`${scenario.id}-${conceptLabel}`} tone="slate">
                  {conceptLabel}
                </SpotTag>
              ))}
            </div>
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-emerald-100/55">
                {copy.positionLabel}
              </p>
              <div className="mt-3 flex flex-wrap gap-3">
                <SeatBadge
                  role={copy.heroValueLabel}
                  position={scenario.heroPosition}
                  tone="emerald"
                />
                <SeatBadge
                  role={copy.villainLabel}
                  position={scenario.villainPosition ?? copy.noVillainLabel}
                />
              </div>
            </div>

            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-emerald-100/55">
                {copy.focusLabel}
              </p>
              <p className="mt-3 max-w-3xl break-words text-sm leading-6 text-slate-300 text-pretty">
                {language === "vi"
                  ? "Hero hand la protagonist cua scene nay. Chot line dua tren vi tri, lich su action, va stack depth truoc khi reveal bai hoc."
                  : "Hero hand is the protagonist of this scene. Lock the line using seat, action history, and stack depth before the lesson reveals."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </TableSceneShell>
  );
}
