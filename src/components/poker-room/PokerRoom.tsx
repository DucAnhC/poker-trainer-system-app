import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type Tone = "cyan" | "emerald" | "amber" | "rose" | "slate" | "ghost";
type CardSize = "sm" | "md" | "lg" | "xl";

export type CoachActionItem = {
  label: string;
  helper?: string;
};

const toneClasses: Record<Tone, string> = {
  cyan: "border-cyan-200/20 bg-cyan-300/10 text-cyan-100",
  emerald: "border-emerald-200/20 bg-emerald-300/10 text-emerald-100",
  amber: "border-amber-200/20 bg-amber-300/10 text-amber-100",
  rose: "border-rose-200/20 bg-rose-300/10 text-rose-100",
  slate: "border-white/12 bg-black/18 text-slate-200",
  ghost: "border-white/12 bg-white/[0.06] text-white/85",
};

const microLabelClassName =
  "text-[11px] font-semibold uppercase tracking-[0.1em]";
const labelTextClassName = "text-[10px] font-semibold uppercase tracking-[0.12em]";
const panelTitleClassName =
  "text-2xl font-semibold tracking-tight text-white text-pretty sm:text-[2rem]";
const bodyTextClassName = "text-sm leading-6 text-slate-300 text-pretty";
const cardValueClassName =
  "break-words text-[15px] font-semibold leading-6 text-white text-pretty sm:text-base";
const buttonTextClassName = "text-sm font-semibold tracking-[0.08em]";

function getSuitSymbol(suit: string) {
  if (suit === "s") {
    return "♠";
  }

  if (suit === "h") {
    return "♥";
  }

  if (suit === "d") {
    return "♦";
  }

  return "♣";
}

function getSuitToneClassName(suit: string) {
  if (suit === "h" || suit === "d") {
    return "text-rose-600";
  }

  return "text-slate-900";
}

function parseCard(card: string) {
  const trimmedCard = card.trim();

  if (trimmedCard.length < 2) {
    return {
      rank: trimmedCard || "?",
      suit: "",
      suitSymbol: "",
      toneClassName: "text-slate-900",
    };
  }

  const suit = trimmedCard.slice(-1).toLowerCase();
  const rank = trimmedCard.slice(0, -1).toUpperCase().replace("10", "T");

  return {
    rank,
    suit,
    suitSymbol: getSuitSymbol(suit),
    toneClassName: getSuitToneClassName(suit),
  };
}

function getCardSizeClassName(size: CardSize) {
  if (size === "sm") {
    return "h-[78px] w-[56px] rounded-[18px] p-2.5";
  }

  if (size === "lg") {
    return "h-[124px] w-[86px] rounded-[24px] p-3.5";
  }

  if (size === "xl") {
    return "h-[144px] w-[98px] rounded-[28px] p-4";
  }

  return "h-[96px] w-[68px] rounded-[20px] p-3";
}

export function SpotTag({
  children,
  tone = "ghost",
  className,
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex max-w-full items-center justify-center rounded-full border px-3 py-1 text-center leading-5 break-words text-pretty",
        microLabelClassName,
        toneClasses[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function StatPill({
  label,
  value,
  note,
  className,
}: {
  label: string;
  value: string;
  note?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "min-w-0 rounded-[22px] border border-white/10 bg-black/14 px-4 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]",
        className,
      )}
    >
      <p className={cn(labelTextClassName, "text-emerald-100/55")}>{label}</p>
      <p className="mt-2 break-words text-xl font-semibold leading-7 text-white text-pretty sm:text-2xl">
        {value}
      </p>
      {note ? <p className={cn("mt-2", bodyTextClassName)}>{note}</p> : null}
    </div>
  );
}

export function SceneStatCard({
  label,
  value,
  wide = false,
  className,
}: {
  label: string;
  value: string;
  wide?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "min-w-0 rounded-[22px] border border-white/12 bg-black/14 px-4 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]",
        wide && "sm:col-span-2 2xl:col-span-1",
        className,
      )}
    >
      <p className={cn(microLabelClassName, "text-emerald-100/55")}>{label}</p>
      <p className={cn("mt-2", cardValueClassName)}>{value}</p>
    </div>
  );
}

export function SceneHeader({
  eyebrow,
  title,
  description,
  tags,
  aside,
  className,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  tags?: ReactNode;
  aside?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid gap-5 2xl:grid-cols-[minmax(0,1fr)_minmax(340px,400px)] 2xl:items-start",
        className,
      )}
    >
      <div className="min-w-0 space-y-3">
        <div className="flex flex-wrap items-center gap-2">{tags}</div>
        <div className="space-y-2">
          <p className={cn(microLabelClassName, "text-cyan-200/75")}>{eyebrow}</p>
          <h1 className="text-3xl font-semibold tracking-tight text-white text-pretty sm:text-[2.15rem]">
            {title}
          </h1>
          {description ? <p className={cn("max-w-4xl", bodyTextClassName)}>{description}</p> : null}
        </div>
      </div>

      {aside ? <div className="min-w-0">{aside}</div> : null}
    </div>
  );
}

export function TableSceneShell({
  header,
  children,
  rail,
  footer,
  coach,
  feltClassName,
  className,
}: {
  header?: ReactNode;
  children: ReactNode;
  rail?: ReactNode;
  footer?: ReactNode;
  coach?: ReactNode;
  feltClassName?: string;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "rounded-[36px] border border-emerald-950/18 bg-[linear-gradient(180deg,rgba(4,24,22,0.98),rgba(8,23,32,0.98))] p-5 text-white shadow-panel sm:p-6 xl:p-7",
        className,
      )}
    >
      {header ? <div>{header}</div> : null}

      <div className={cn(header ? "mt-5" : "")}>
        <div className="rounded-[30px] border border-white/10 bg-black/12 p-4 sm:p-5">
          <div
            className={cn(
              "grid gap-4",
              rail
                ? "2xl:grid-cols-[minmax(0,1fr)_minmax(340px,400px)]"
                : "",
            )}
          >
            <div
              className={cn(
                "min-w-0 rounded-[32px] border border-white/12 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] sm:p-5",
                "bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.26),rgba(4,28,35,0.12)_38%,rgba(3,7,18,0.3)_100%)]",
                feltClassName,
              )}
            >
              {children}
            </div>

            {rail ? <div className="min-w-0">{rail}</div> : null}
          </div>

          {footer ? <div className="mt-4">{footer}</div> : null}
        </div>
      </div>

      {coach ? <div className="mt-4">{coach}</div> : null}
    </section>
  );
}

export function PokerCard({
  card,
  size = "md",
  className,
}: {
  card: string;
  size?: CardSize;
  className?: string;
}) {
  const parsedCard = parseCard(card);

  return (
    <div
      className={cn(
        "flex shrink-0 flex-col justify-between border border-slate-200/90 bg-[linear-gradient(180deg,#ffffff,#eef4f6)] shadow-[0_20px_38px_-22px_rgba(8,15,28,0.85)]",
        getCardSizeClassName(size),
        className,
      )}
    >
      <div>
        <p
          className={cn(
            size === "xl" ? "text-[1.9rem]" : size === "lg" ? "text-[1.55rem]" : "text-xl",
            "font-black leading-none tracking-[0.02em]",
            parsedCard.toneClassName,
          )}
        >
          {parsedCard.rank}
        </p>
        <p
          className={cn(
            size === "xl" ? "text-xl" : size === "lg" ? "text-lg" : "text-base",
            "mt-1 leading-none",
            parsedCard.toneClassName,
          )}
        >
          {parsedCard.suitSymbol}
        </p>
      </div>

      <div className="flex justify-end">
        <div className="rotate-180">
          <p
            className={cn(
              size === "xl" ? "text-[1.9rem]" : size === "lg" ? "text-[1.55rem]" : "text-xl",
              "font-black leading-none tracking-[0.02em]",
              parsedCard.toneClassName,
            )}
          >
            {parsedCard.rank}
          </p>
          <p
            className={cn(
              size === "xl" ? "text-xl" : size === "lg" ? "text-lg" : "text-base",
              "mt-1 leading-none",
              parsedCard.toneClassName,
            )}
          >
            {parsedCard.suitSymbol}
          </p>
        </div>
      </div>
    </div>
  );
}

export function BoardCards({
  cards,
  size = "md",
  className,
}: {
  cards: string[];
  size?: CardSize;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-wrap items-center gap-3", className)}>
      {cards.map((card, index) => (
        <PokerCard
          key={`${card}-${index}`}
          card={card}
          size={size}
          className={cn(index % 2 === 0 ? "-rotate-[1.5deg]" : "rotate-[1.5deg]")}
        />
      ))}
    </div>
  );
}

export function HeroHand({
  label,
  cards,
  detail,
  className,
}: {
  label: string;
  cards: string[];
  detail?: string;
  className?: string;
}) {
  const [firstCard, secondCard] = cards;

  return (
    <div
      className={cn(
        "rounded-[28px] border border-white/12 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.1),rgba(4,28,35,0.08)_60%,rgba(3,7,18,0.16)_100%)] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]",
        className,
      )}
    >
      <div className="relative mx-auto flex h-44 w-[13.75rem] items-center justify-center">
        {firstCard ? (
          <PokerCard card={firstCard} size="xl" className="-rotate-6 translate-x-4" />
        ) : null}
        {secondCard ? (
          <PokerCard
            card={secondCard}
            size="xl"
            className="absolute rotate-6 -translate-x-4"
          />
        ) : null}
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
        <SpotTag tone="cyan" className="text-sm tracking-[0.06em] normal-case">
          {label}
        </SpotTag>
        {detail ? <SpotTag tone="slate">{detail}</SpotTag> : null}
      </div>
    </div>
  );
}

export function SeatBadge({
  role,
  position,
  stack,
  tone = "slate",
  className,
}: {
  role: string;
  position: string;
  stack?: string;
  tone?: Tone;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "inline-flex min-w-[160px] max-w-full items-center gap-3 rounded-full border px-4 py-3 shadow-[0_18px_34px_-26px_rgba(8,15,28,0.85)]",
        toneClasses[tone],
        className,
      )}
    >
      <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/14 bg-black/20 text-[10px] font-semibold tracking-[0.12em] text-white">
        {role}
      </span>
      <span className="min-w-0 space-y-0.5">
        <span className="block break-words text-sm font-semibold leading-5 text-white text-pretty">
          {position}
        </span>
        {stack ? (
          <span className="block break-words text-[11px] font-semibold leading-5 text-white/70">
            {stack}
          </span>
        ) : null}
      </span>
    </div>
  );
}

export const PositionBadge = SeatBadge;

export function ChipStack({
  label,
  value,
  accent = "emerald",
  className,
}: {
  label: string;
  value: string;
  accent?: Tone;
  className?: string;
}) {
  const chipTone =
    accent === "amber"
      ? "from-amber-300/80 to-amber-500/90"
      : accent === "rose"
        ? "from-rose-300/80 to-rose-500/90"
        : accent === "cyan"
          ? "from-cyan-300/80 to-cyan-500/90"
          : "from-emerald-300/80 to-emerald-500/90";

  return (
    <div
      className={cn(
        "min-w-0 rounded-[24px] border border-white/12 bg-black/18 px-4 py-4 text-center shadow-[0_18px_34px_-24px_rgba(8,15,28,0.9)]",
        className,
      )}
    >
      <div className="mx-auto flex w-fit flex-col items-center">
        {[0, 1, 2].map((chip) => (
          <span
            key={chip}
            className={cn(
              "relative h-3.5 w-20 rounded-full border border-white/20 bg-gradient-to-r shadow-[0_10px_18px_-12px_rgba(8,15,28,0.8)]",
              chipTone,
              chip > 0 ? "-mt-1.5" : "",
            )}
          />
        ))}
      </div>
      <p className={cn("mt-4", microLabelClassName, "text-emerald-100/55")}>{label}</p>
      <p className="mt-2 break-words text-3xl font-semibold tracking-tight text-white text-pretty">
        {value}
      </p>
    </div>
  );
}

export function PotDisplay({
  potLabel,
  potValue,
  callLabel,
  callValue,
  centerLabel,
  centerValue,
  footer,
  className,
}: {
  potLabel: string;
  potValue: string;
  callLabel: string;
  callValue: string;
  centerLabel: string;
  centerValue: string;
  footer?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid gap-4 lg:grid-cols-[minmax(140px,180px)_minmax(0,1fr)_minmax(140px,180px)] lg:items-center",
        className,
      )}
    >
      <ChipStack label={potLabel} value={potValue} accent="emerald" />

      <div className="mx-auto flex h-[220px] w-[220px] items-center justify-center rounded-full border border-cyan-200/22 bg-[radial-gradient(circle,rgba(6,182,212,0.24),rgba(15,23,42,0.4)_56%,rgba(3,7,18,0.96)_100%)] shadow-[0_28px_64px_-36px_rgba(6,182,212,0.75)]">
        <div className="flex h-[172px] w-[172px] flex-col items-center justify-center rounded-full border border-white/10 bg-black/25 px-3 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
          <p className={cn(microLabelClassName, "text-cyan-100/80")}>{centerLabel}</p>
          <p className="mt-2 text-5xl font-semibold tracking-tight text-white">{centerValue}</p>
          {footer ? (
            <p className="mt-2 break-words text-[11px] font-semibold leading-5 text-slate-300 text-pretty">
              {footer}
            </p>
          ) : null}
        </div>
      </div>

      <ChipStack label={callLabel} value={callValue} accent="cyan" />
    </div>
  );
}

export function ActionHistory({
  label,
  steps,
  className,
}: {
  label: string;
  steps: string[];
  className?: string;
}) {
  if (steps.length === 0) {
    return null;
  }

  return (
    <div className={cn("min-w-0 rounded-[24px] border border-white/12 bg-black/14 p-4", className)}>
      <p className={cn(microLabelClassName, "text-emerald-100/55")}>{label}</p>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        {steps.map((step, index) => (
          <div key={`${step}-${index}`} className="flex min-w-0 items-center gap-2">
            {index > 0 ? (
              <span className="hidden h-px w-5 rounded-full bg-gradient-to-r from-cyan-300/45 to-emerald-300/25 sm:block" />
            ) : null}
            <div className="flex min-w-0 items-center gap-2 rounded-[18px] border border-white/12 bg-black/16 px-3 py-2 text-sm font-semibold text-white/92">
              <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-white/10 bg-black/15 text-[10px] font-semibold tracking-[0.12em] text-slate-300">
                {index + 1}
              </span>
              <span className="break-words text-pretty">{step}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function CoachAnchor({
  title,
  body,
  modeLabel,
  actions,
  tone = "cyan",
  className,
}: {
  title: string;
  body: string;
  modeLabel: string;
  actions: CoachActionItem[];
  tone?: Tone;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(8,20,35,0.88),rgba(3,10,24,0.9))] p-4 text-white shadow-[0_18px_44px_-34px_rgba(8,15,28,0.9)]",
        className,
      )}
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full border bg-black/25 text-[11px] font-semibold tracking-[0.12em]",
            toneClasses[tone],
          )}
        >
          AI
        </div>
        <div className="min-w-0 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <SpotTag tone={tone}>{modeLabel}</SpotTag>
            <SpotTag tone="slate">Coach seat</SpotTag>
          </div>
          <p className="text-lg font-semibold text-white text-pretty">{title}</p>
          <p className={bodyTextClassName}>{body}</p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {actions.map((action) => (
          <div
            key={action.label}
            className="min-w-0 flex-1 basis-[13rem] rounded-[18px] border border-white/10 bg-white/[0.045] px-3 py-2.5"
          >
            <p className="break-words text-sm font-semibold leading-5 text-white text-pretty">
              {action.label}
            </p>
            {action.helper ? (
              <p className="mt-1 break-words text-xs leading-5 text-slate-400 text-pretty">
                {action.helper}
              </p>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}

export function ActionOptionCard({
  index,
  label,
  subtitle,
  metaLabel,
  note,
  isSelected,
  isLocked,
  isRecommended = false,
  isSubmittedChoice = false,
  selectedTag,
  bestTag,
  onSelect,
  className,
  highTension = false,
}: {
  index: number;
  label: string;
  subtitle?: string;
  metaLabel?: string;
  note?: string;
  isSelected: boolean;
  isLocked: boolean;
  isRecommended?: boolean;
  isSubmittedChoice?: boolean;
  selectedTag: string;
  bestTag: string;
  onSelect: () => void;
  className?: string;
  highTension?: boolean;
}) {
  const showSubmittedState = isLocked && (isRecommended || isSubmittedChoice);
  const isIncorrectSubmitted = isSubmittedChoice && !isRecommended;

  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={isLocked}
      aria-pressed={isSelected}
      className={cn(
        "group w-full min-w-0 rounded-[28px] border px-4 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/70 active:scale-[0.99]",
        highTension ? "min-h-[118px] py-5" : "min-h-[96px] py-4",
        "bg-white/[0.04] text-white/92 shadow-[0_14px_34px_-24px_rgba(15,23,42,0.85)]",
        !isLocked &&
          "hover:-translate-y-0.5 hover:border-cyan-200/30 hover:bg-white/[0.09] hover:shadow-[0_24px_48px_-28px_rgba(6,182,212,0.5)]",
        !isSelected && !showSubmittedState && "border-white/10",
        isSelected &&
          !isLocked &&
          "border-cyan-300/70 bg-[linear-gradient(135deg,rgba(8,47,73,0.95),rgba(8,145,178,0.3))] shadow-[0_24px_48px_-24px_rgba(103,232,249,0.55)]",
        isLocked &&
          isRecommended &&
          "border-emerald-300/65 bg-[linear-gradient(135deg,rgba(6,78,59,0.95),rgba(52,211,153,0.26))] shadow-[0_20px_46px_-24px_rgba(52,211,153,0.55)]",
        isIncorrectSubmitted &&
          "border-rose-300/60 bg-[linear-gradient(135deg,rgba(76,5,25,0.96),rgba(251,113,133,0.18))] shadow-[0_18px_44px_-24px_rgba(251,113,133,0.45)]",
        isLocked && !isRecommended && !isSubmittedChoice && "border-white/10 opacity-75",
        className,
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <div
            className={cn(
              "mt-1 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-[11px] font-semibold tracking-[0.12em]",
              isSelected || showSubmittedState
                ? "border-white/35 bg-white/12 text-white"
                : "border-white/12 bg-black/10 text-slate-300",
            )}
          >
            {`${index + 1}`.padStart(2, "0")}
          </div>

          <div className="min-w-0 flex-1">
            {metaLabel ? (
              <div className="flex flex-wrap items-center gap-2">
                <SpotTag tone="cyan" className="bg-black/18 text-cyan-100/90">
                  {metaLabel}
                </SpotTag>
              </div>
            ) : null}
            <p className="mt-3 break-words text-lg font-semibold leading-7 text-white text-pretty sm:text-xl">
              {label}
            </p>
            {subtitle ? (
              <p className="mt-1 break-words text-sm font-medium leading-6 text-cyan-100/85 text-pretty">
                {subtitle}
              </p>
            ) : null}
            {note ? (
              <p className="mt-3 break-words text-sm leading-6 text-rose-100/90 text-pretty">
                {note}
              </p>
            ) : null}
          </div>
        </div>

        <div className="flex shrink-0 flex-wrap items-center justify-end gap-2">
          {isSubmittedChoice ? (
            <SpotTag tone="slate" className="text-[10px]">
              {selectedTag}
            </SpotTag>
          ) : null}
          {isRecommended ? (
            <SpotTag tone="emerald" className="text-[10px]">
              {bestTag}
            </SpotTag>
          ) : null}
          {!isRecommended && !isSubmittedChoice && !isLocked ? (
            <SpotTag tone="slate" className="text-[10px]">
              Lock
            </SpotTag>
          ) : null}
        </div>
      </div>
    </button>
  );
}

export function ActionTray({
  eyebrow,
  title,
  hint,
  children,
  selectedLabel,
  selectedValue,
  selectedMeta,
  stateLabel,
  stateHint,
  stateTone = "slate",
  primaryLabel,
  onPrimary,
  primaryDisabled,
  secondaryLabel,
  onSecondary,
  coach,
  highTension = false,
  className,
}: {
  eyebrow: string;
  title: string;
  hint: string;
  children: ReactNode;
  selectedLabel: string;
  selectedValue: string;
  selectedMeta?: string;
  stateLabel?: string;
  stateHint?: string;
  stateTone?: Tone;
  primaryLabel: string;
  onPrimary: () => void;
  primaryDisabled: boolean;
  secondaryLabel: string;
  onSecondary: () => void;
  coach?: ReactNode;
  highTension?: boolean;
  className?: string;
}) {
  return (
    <aside
      className={cn(
        "min-w-0 rounded-[32px] border border-slate-900/70 bg-[linear-gradient(180deg,rgba(15,23,42,0.98),rgba(8,15,28,0.96))] p-5 text-white shadow-panel xl:sticky xl:top-6",
        className,
      )}
    >
      <div className="space-y-2">
        <p className={cn(microLabelClassName, "text-cyan-200/80")}>{eyebrow}</p>
        <h2 className="text-[1.85rem] font-semibold tracking-tight text-white text-pretty">
          {title}
        </h2>
        <p className={bodyTextClassName}>{hint}</p>
      </div>

      {stateLabel ? (
        <div className="mt-4 rounded-[22px] border border-white/10 bg-black/16 p-4">
          <div className="flex flex-wrap items-center gap-2">
            <SpotTag tone={stateTone}>{stateLabel}</SpotTag>
          </div>
          {stateHint ? <p className={cn("mt-2", bodyTextClassName)}>{stateHint}</p> : null}
        </div>
      ) : null}

      <div className="mt-5 space-y-3">{children}</div>

      <div
        className={cn(
          "mt-5 rounded-[28px] border p-4",
          selectedValue
            ? "border-cyan-300/22 bg-cyan-300/[0.07]"
            : "border-white/10 bg-white/[0.05]",
        )}
      >
        <div className="space-y-2">
          <p className={cn(microLabelClassName, "text-slate-300")}>{selectedLabel}</p>
          <p className="break-words text-xl font-semibold leading-7 text-white text-pretty">
            {selectedValue}
          </p>
          {selectedMeta ? (
            <div className="pt-1">
              <SpotTag tone="cyan" className="bg-black/18 text-[10px] text-cyan-100/90">
                {selectedMeta}
              </SpotTag>
            </div>
          ) : null}
        </div>

        <div className="mt-4 grid gap-3">
          <button
            type="button"
            onClick={onPrimary}
            disabled={primaryDisabled}
            className={cn(
              "w-full rounded-full px-5 transition active:scale-[0.99]",
              buttonTextClassName,
              highTension ? "py-5" : "py-4",
              primaryDisabled
                ? "cursor-not-allowed bg-slate-600/60 text-slate-300"
                : "bg-[linear-gradient(135deg,rgba(34,197,94,0.98),rgba(6,182,212,0.96))] text-white shadow-[0_24px_50px_-24px_rgba(34,197,94,0.72)] hover:brightness-105",
            )}
          >
            {primaryLabel}
          </button>

          <button
            type="button"
            onClick={onSecondary}
            className={cn(
              "w-full rounded-full border border-white/12 bg-transparent px-5 py-3 text-slate-200 transition hover:border-white/22 hover:bg-white/[0.06]",
              buttonTextClassName,
            )}
          >
            {secondaryLabel}
          </button>
        </div>
      </div>

      {coach ? <div className="mt-5">{coach}</div> : null}
    </aside>
  );
}

export function RevealStatePanel({
  eyebrow,
  title,
  description,
  revealed,
  placeholderLabels,
  coach,
  children,
  className,
}: {
  eyebrow: string;
  title: string;
  description: string;
  revealed: boolean;
  placeholderLabels: string[];
  coach?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  if (!revealed) {
    return (
      <section
        className={cn(
          "rounded-[32px] border border-white/12 bg-[linear-gradient(180deg,rgba(8,20,35,0.98),rgba(3,10,24,0.96))] p-5 text-white shadow-panel sm:p-6",
          className,
        )}
      >
        <div className="space-y-2">
          <p className={cn(microLabelClassName, "text-cyan-200/80")}>{eyebrow}</p>
          <h2 className={panelTitleClassName}>{title}</h2>
          <p className={bodyTextClassName}>{description}</p>
        </div>

        <div className="mt-5 rounded-[24px] border border-white/10 bg-black/14 p-4">
          <div className="flex flex-wrap gap-2">
            {placeholderLabels.map((label) => (
              <SpotTag key={label} tone="slate" className="text-slate-300">
                {label}
              </SpotTag>
            ))}
          </div>
          <div className="mt-4 h-3 w-full max-w-md rounded-full bg-white/8" />
          <div className="mt-2 h-3 w-3/4 max-w-sm rounded-full bg-white/6" />
        </div>

        {coach ? <div className="mt-5">{coach}</div> : null}
      </section>
    );
  }

  return (
    <section
      className={cn(
        "rounded-[32px] border border-white/12 bg-[linear-gradient(180deg,rgba(8,20,35,0.98),rgba(3,10,24,0.96))] p-5 text-white shadow-panel sm:p-6",
        className,
      )}
    >
      <div className="space-y-2">
        <p className={cn(microLabelClassName, "text-cyan-200/80")}>{eyebrow}</p>
        <h2 className={panelTitleClassName}>{title}</h2>
        <p className={bodyTextClassName}>{description}</p>
      </div>

      <div className="mt-5 space-y-4">{children}</div>

      {coach ? <div className="mt-5">{coach}</div> : null}
    </section>
  );
}
