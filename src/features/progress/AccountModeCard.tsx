"use client";

import Link from "next/link";

import { useUiCopy } from "@/components/i18n/UiLanguageProvider";
import { SurfaceCard } from "@/components/ui/SurfaceCard";
import { StatusPill } from "@/components/ui/StatusPill";
import {
  hasAppSnapshotData,
  type AppSnapshotStats,
} from "@/lib/persistence/snapshot-insights";
import { formatDateTimeLabel } from "@/lib/utils";
import type { PersistenceMode } from "@/types/training";

type AccountModeCardProps = {
  storageMode: PersistenceMode;
  userEmail: string | null;
  snapshotStats: AppSnapshotStats;
  localBackupStats: AppSnapshotStats;
};

export function AccountModeCard({
  storageMode,
  userEmail,
  snapshotStats,
  localBackupStats,
}: AccountModeCardProps) {
  const copy = useUiCopy();
  const hasSeparateLocalBackup =
    storageMode === "account" && hasAppSnapshotData(localBackupStats);
  const signedInLabel = userEmail ?? copy.accountControls.signedInAccount;

  return (
    <SurfaceCard className="space-y-4">
      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent-strong">
          {copy.accountMode.eyebrow}
        </p>
        <h2 className="text-2xl font-semibold text-foreground">
          {storageMode === "account"
            ? copy.accountMode.titleAccount
            : copy.accountMode.titleLocal}
        </h2>
        <p className="text-sm leading-6 text-muted-foreground">
          {storageMode === "account"
            ? copy.accountMode.descriptionAccount(signedInLabel)
            : copy.accountMode.descriptionLocal}
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <StatusPill tone={storageMode === "account" ? "success" : "accent"}>
          {storageMode === "account"
            ? copy.accountMode.cloudBackedMode
            : copy.accountMode.localOnlyMode}
        </StatusPill>
        {storageMode === "account" ? (
          <StatusPill>{signedInLabel}</StatusPill>
        ) : (
          <StatusPill tone="gold">{copy.accountMode.signInWhenReady}</StatusPill>
        )}
        {hasSeparateLocalBackup ? (
          <StatusPill tone="gold">{copy.accountMode.localBackupStillAvailable}</StatusPill>
        ) : null}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-border/70 bg-muted/20 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            {copy.accountMode.currentSource}
          </p>
          <p className="mt-2 text-lg font-semibold text-foreground">
            {storageMode === "account"
              ? copy.accountMode.accountSnapshot
              : copy.accountMode.browserSnapshot}
          </p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {copy.accountMode.savedSummary(
              snapshotStats.attemptCount,
              snapshotStats.sessionCount,
              snapshotStats.reviewNoteCount,
            )}
          </p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {copy.accountMode.lastSavedActivity}:{" "}
            {snapshotStats.lastActivityAt
              ? formatDateTimeLabel(snapshotStats.lastActivityAt)
              : copy.accountMode.noSavedActivity}
          </p>
        </div>

        <div className="rounded-2xl border border-border/70 bg-muted/20 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            {copy.accountMode.syncGuidance}
          </p>
          <p className="mt-2 text-lg font-semibold text-foreground">
            {storageMode === "account"
              ? hasSeparateLocalBackup
                ? copy.accountMode.separateBackupExists
                : copy.accountMode.noExtraImportWaiting
              : copy.accountMode.accountModeOptional}
          </p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {storageMode === "account"
              ? hasSeparateLocalBackup
                ? copy.accountMode.localBackupWaiting(
                    localBackupStats.attemptCount,
                    localBackupStats.reviewNoteCount,
                  )
                : copy.accountMode.noExtraLocalData
              : copy.accountMode.localModeHelp}
          </p>
        </div>
      </div>

      {storageMode === "local" ? (
        <div className="flex flex-wrap gap-3">
          <Link
            href="/auth"
            className="rounded-full bg-accent-strong px-4 py-2 text-sm font-semibold text-white transition hover:bg-accent"
          >
            {copy.accountMode.signInForSync}
          </Link>
          <Link
            href="/review"
            className="rounded-full border border-border bg-white px-4 py-2 text-sm font-semibold text-foreground transition hover:border-accent/40 hover:text-accent-strong"
          >
            {copy.accountMode.keepStudyingLocal}
          </Link>
        </div>
      ) : null}
    </SurfaceCard>
  );
}
