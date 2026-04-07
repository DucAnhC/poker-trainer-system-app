"use client";

import Link from "next/link";

import { useUiCopy } from "@/components/i18n/UiLanguageProvider";
import { ModuleCard } from "@/components/trainer/ModuleCard";
import { allScenarios } from "@/data/scenarios";
import { trainingModules } from "@/data/training-modules";
import {
  getHomeShellCopy,
  getShellLanguage,
} from "@/features/home/home-shell-copy";

function SnapshotStat({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[22px] border border-white/10 bg-black/[0.14] px-4 py-4">
      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-100/[0.55]">
        {label}
      </p>
      <p className="mt-2 text-2xl font-semibold text-white">{value}</p>
    </div>
  );
}

export default function HomePage() {
  const uiCopy = useUiCopy();
  const language = getShellLanguage(uiCopy.locale);
  const copy = getHomeShellCopy(language);
  const interactiveModuleCount = trainingModules.filter(
    (module) => module.phaseStatus === "interactive",
  ).length;

  return (
    <div className="space-y-8">
      <section className="grid gap-5 xl:grid-cols-[minmax(0,1.18fr)_360px]">
        <div className="rounded-[36px] border border-emerald-950/20 bg-[linear-gradient(180deg,rgba(4,24,22,0.98),rgba(8,23,32,0.98))] p-5 text-white shadow-panel sm:p-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-cyan-200/20 bg-cyan-300/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-100">
              {copy.heroEyebrow}
            </span>
            {copy.heroChips.map((chip) => (
              <span
                key={chip}
                className="rounded-full border border-white/[0.12] bg-white/[0.06] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-100"
              >
                {chip}
              </span>
            ))}
          </div>

          <div className="mt-5 space-y-3">
            <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              {copy.heroTitle}
            </h1>
            <p className="max-w-2xl text-base leading-7 text-slate-300">
              {copy.heroDescription}
            </p>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/trainer/preflop"
              className="rounded-full bg-[linear-gradient(135deg,rgba(34,197,94,0.98),rgba(6,182,212,0.96))] px-5 py-3 text-sm font-semibold text-white transition hover:brightness-105"
            >
              {copy.primaryCta}
            </Link>
            <Link
              href="/dashboard"
              className="rounded-full border border-white/[0.12] bg-white/[0.06] px-5 py-3 text-sm font-semibold text-slate-100 transition hover:border-white/20 hover:bg-white/[0.1]"
            >
              {copy.secondaryCta}
            </Link>
            <Link
              href="/settings"
              className="rounded-full border border-white/[0.12] bg-transparent px-5 py-3 text-sm font-semibold text-slate-200 transition hover:border-white/20 hover:bg-white/[0.06]"
            >
              {copy.tertiaryCta}
            </Link>
          </div>
        </div>

        <aside className="rounded-[32px] border border-slate-900/70 bg-[linear-gradient(180deg,rgba(15,23,42,0.98),rgba(8,15,28,0.96))] p-5 text-white shadow-panel sm:p-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-cyan-200/80">
            {copy.snapshotTitle}
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
            <SnapshotStat
              label={copy.snapshotLabels.modules}
              value={`${interactiveModuleCount}`}
            />
            <SnapshotStat
              label={copy.snapshotLabels.spots}
              value={`${allScenarios.length}`}
            />
            <SnapshotStat
              label={copy.snapshotLabels.review}
              value={copy.snapshotValues.review}
            />
            <SnapshotStat
              label={copy.snapshotLabels.mode}
              value={copy.snapshotValues.mode}
            />
          </div>
        </aside>
      </section>

      <section className="space-y-4">
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent-strong">
            {copy.modulesEyebrow}
          </p>
          <h2 className="text-3xl font-semibold tracking-tight text-foreground">
            {copy.modulesTitle}
          </h2>
          <p className="text-sm leading-6 text-muted-foreground">
            {copy.modulesDescription}
          </p>
        </div>

        <div className="grid gap-5 xl:grid-cols-2">
          {trainingModules.map((module) => (
            <ModuleCard key={module.id} module={module} />
          ))}
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        <div className="rounded-[30px] border border-border/70 bg-surface/[0.88] p-5 shadow-panel sm:p-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent-strong">
            {copy.loopTitle}
          </p>
          <div className="mt-4 space-y-3">
            {copy.loopBullets.map((bullet) => (
              <div
                key={bullet}
                className="rounded-[20px] border border-border/70 bg-muted/18 px-4 py-3 text-sm font-semibold text-foreground"
              >
                {bullet}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[30px] border border-border/70 bg-surface/[0.88] p-5 shadow-panel sm:p-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent-strong">
            {copy.scopeTitle}
          </p>
          <div className="mt-4 space-y-3">
            {copy.scopeBullets.map((bullet) => (
              <div
                key={bullet}
                className="rounded-[20px] border border-border/70 bg-muted/18 px-4 py-3 text-sm font-semibold text-foreground"
              >
                {bullet}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
