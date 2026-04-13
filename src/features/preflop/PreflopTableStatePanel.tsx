import {
  ActionHistory,
  CoachAnchor,
  SceneHeader,
  SceneStatCard,
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
      ? ["Goi y ngan", "Vi sao line nay", "Tinh huong tuong tu"]
      : ["Quick hint", "Why this line", "Similar spot"];

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
            <div className="grid gap-3 sm:grid-cols-2">
              <StatPill label={copy.handLabel} value={scenario.handLabel} />
              <StatPill
                label={copy.stackLabel}
                value={`${scenario.effectiveStackBb}bb`}
              />
            </div>
          }
        />
      }
      rail={
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
          <SceneStatCard label={copy.heroLabel} value={scenario.heroPosition} />
          <SceneStatCard
            label={copy.villainLabel}
            value={scenario.villainPosition ?? copy.noVillainLabel}
          />
          <SceneStatCard
            label={copy.spotLabel}
            value={getPreflopPotTypeLabel(scenario.potType, language)}
          />
          <SceneStatCard
            label={copy.focusLabel}
            value={conceptLabels.join(" / ")}
            wide
          />
        </div>
      }
      footer={
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1.12fr)_minmax(0,0.88fr)]">
          <ActionHistory label={copy.actionLaneLabel} steps={formattedHistory} />
          <div className="rounded-[24px] border border-white/12 bg-black/14 p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-100/55">
              {copy.focusLabel}
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              {scenario.learningGoal}
            </p>
            {retryHint ? (
              <div className="mt-4 rounded-[20px] border border-amber-200/18 bg-amber-300/10 p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-100">
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
          title={language === "vi" ? "Coach ngoi canh ban" : "Coach seat by the table"}
          body={
            language === "vi"
              ? "Cho nay duoc de san cho AI tutor dang nudge, reveal feedback, va compare spot ma van giu scene poker la trung tam."
              : "This reserves the table-coach slot for nudges, reveal feedback, and similar spots while keeping the poker scene in the center."
          }
          modeLabel={language === "vi" ? "Silent coach" : "Silent coach"}
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

        <div className="grid gap-5 xl:grid-cols-[minmax(0,320px)_minmax(0,1fr)] xl:items-center">
          <PreflopHandVisual handLabel={scenario.handLabel} language={language} />

          <div className="space-y-4">
            <div className="rounded-[26px] border border-white/12 bg-black/18 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-100/55">
                {copy.positionLabel}
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
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

            <div className="rounded-[26px] border border-white/12 bg-black/18 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-100/55">
                {copy.handLabel}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <SpotTag tone="cyan" className="text-sm tracking-[0.08em] normal-case">
                  {scenario.handLabel}
                </SpotTag>
                {conceptLabels.map((conceptLabel) => (
                  <SpotTag key={`${scenario.id}-${conceptLabel}`} tone="slate">
                    {conceptLabel}
                  </SpotTag>
                ))}
              </div>
              <p className="mt-4 text-sm leading-6 text-slate-300">
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
