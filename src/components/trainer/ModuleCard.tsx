"use client";

import Link from "next/link";

import { useUiCopy } from "@/components/i18n/UiLanguageProvider";
import { scenarioCountByModule } from "@/data/scenarios";
import {
  getModuleShellCopy,
  getShellLanguage,
  getSourceShellLabel,
} from "@/features/home/home-shell-copy";
import { cn } from "@/lib/utils";
import type { TrainingModule } from "@/types/training";

type ModuleCardProps = {
  module: TrainingModule;
};

const toneClasses = {
  emerald:
    "bg-[linear-gradient(135deg,rgba(5,150,105,0.96),rgba(16,185,129,0.78))] text-white",
  cyan:
    "bg-[linear-gradient(135deg,rgba(8,145,178,0.96),rgba(34,211,238,0.72))] text-white",
  amber:
    "bg-[linear-gradient(135deg,rgba(217,119,6,0.96),rgba(251,191,36,0.78))] text-slate-950",
  slate:
    "bg-[linear-gradient(135deg,rgba(15,23,42,0.96),rgba(71,85,105,0.82))] text-white",
  rose:
    "bg-[linear-gradient(135deg,rgba(190,24,93,0.92),rgba(251,113,133,0.76))] text-white",
  neutral:
    "bg-[linear-gradient(135deg,rgba(15,23,42,0.94),rgba(30,41,59,0.84))] text-white",
} as const;

export function ModuleCard({ module }: ModuleCardProps) {
  const uiCopy = useUiCopy();
  const language = getShellLanguage(uiCopy.locale);
  const copy = getModuleShellCopy(module.id, language);
  const scenarioCount = scenarioCountByModule[module.id] ?? 0;
  const isHandReview = module.id === "hand-review";

  return (
    <div className="group h-full rounded-[30px] border border-white/30 bg-[linear-gradient(180deg,rgba(255,255,255,0.86),rgba(243,249,248,0.92))] p-5 shadow-panel transition hover:-translate-y-0.5 sm:p-6">
      <div className="flex h-full flex-col gap-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-start gap-4">
            <div
              className={cn(
                "inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-[18px] text-sm font-black uppercase tracking-[0.18em] shadow-[0_20px_36px_-20px_rgba(15,23,42,0.7)]",
                toneClasses[copy.tone],
              )}
            >
              {copy.code}
            </div>

            <div className="min-w-0 space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-emerald-200/35 bg-emerald-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-700">
                  {copy.footer}
                </span>
                <span className="rounded-full border border-border bg-white/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  {isHandReview
                    ? language === "vi"
                      ? "Thủ công"
                      : "Manual"
                    : `${scenarioCount} ${language === "vi" ? "spots" : "spots"}`}
                </span>
              </div>
              <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                {copy.title}
              </h2>
              <p className="max-w-xl text-sm leading-6 text-muted-foreground">
                {copy.summary}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {copy.focuses.map((focus) => (
            <span
              key={`${module.id}-${focus}`}
              className="rounded-full border border-border/80 bg-muted/25 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground"
            >
              {focus}
            </span>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          {module.sourceTypeFocus.map((sourceType) => (
            <span
              key={`${module.id}-${sourceType}`}
              className="rounded-full border border-accent/15 bg-accent/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-accent-strong"
            >
              {getSourceShellLabel(sourceType, language)}
            </span>
          ))}
        </div>

        <div className="mt-auto flex items-center justify-between gap-4 border-t border-border/70 pt-5">
          <p className="text-sm text-muted-foreground">
            {isHandReview
              ? copy.footer
              : `${scenarioCount} ${language === "vi" ? "spot mẫu" : "sample spots"}`}
          </p>
          <Link
            href={module.route}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-semibold text-white transition hover:brightness-105",
              toneClasses[copy.tone],
            )}
          >
            {copy.cta}
          </Link>
        </div>
      </div>
    </div>
  );
}
