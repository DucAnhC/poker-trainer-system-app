"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";

import { useUiCopy } from "@/components/i18n/UiLanguageProvider";
import { SurfaceCard } from "@/components/ui/SurfaceCard";
import { StatusPill } from "@/components/ui/StatusPill";
import {
  hasAppSnapshotData,
  type AppSnapshotStats,
} from "@/lib/persistence/snapshot-insights";
import { formatDateTimeLabel } from "@/lib/utils";
import type { PersistenceMode } from "@/types/training";

type AccountControlsCardProps = {
  storageMode: PersistenceMode;
  userEmail: string | null;
  snapshotStats: AppSnapshotStats;
  localBackupStats: AppSnapshotStats;
  isRefreshing: boolean;
  onRefresh: () => void | Promise<void>;
};

export function AccountControlsCard({
  storageMode,
  userEmail,
  snapshotStats,
  localBackupStats,
  isRefreshing,
  onRefresh,
}: AccountControlsCardProps) {
  const copy = useUiCopy();
  const hasLocalBackupWaiting =
    storageMode === "account" && hasAppSnapshotData(localBackupStats);
  const signedInLabel = userEmail ?? copy.accountControls.signedInAccount;

  return (
    <SurfaceCard className="space-y-4">
      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent-strong">
          {copy.accountControls.eyebrow}
        </p>
        <h2 className="text-2xl font-semibold text-foreground">
          {storageMode === "account"
            ? copy.accountControls.titleAccount
            : copy.accountControls.titleLocal}
        </h2>
        <p className="text-sm leading-6 text-muted-foreground">
          {storageMode === "account"
            ? copy.accountControls.descriptionAccount(signedInLabel)
            : copy.accountControls.descriptionLocal}
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-border/70 bg-muted/20 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            {copy.accountControls.currentSnapshot}
          </p>
          <p className="mt-2 text-lg font-semibold text-foreground">
            {storageMode === "account"
              ? copy.accountControls.accountBackedData
              : copy.accountControls.browserLocalData}
          </p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {copy.accountControls.lastSavedActivity}:{" "}
            {snapshotStats.lastActivityAt
              ? formatDateTimeLabel(snapshotStats.lastActivityAt)
              : copy.accountControls.noSavedActivity}
          </p>
        </div>

        <div className="rounded-2xl border border-border/70 bg-muted/20 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            {copy.accountControls.nextSafeAction}
          </p>
          <p className="mt-2 text-lg font-semibold text-foreground">
            {storageMode === "account"
              ? hasLocalBackupWaiting
                ? copy.accountControls.importToolsBelow
                : copy.accountControls.keepTrainingOrRefresh
              : copy.accountControls.keepTrainingLocal}
          </p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {storageMode === "account"
              ? hasLocalBackupWaiting
                ? copy.accountControls.localBackupWaiting(
                    localBackupStats.attemptCount,
                    localBackupStats.reviewNoteCount,
                  )
                : copy.accountControls.noSeparateLocalData
              : copy.accountControls.localModeHelp}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <StatusPill tone={storageMode === "account" ? "success" : "accent"}>
          {storageMode === "account"
            ? copy.accountControls.signedInMode
            : copy.accountControls.localMode}
        </StatusPill>
        {storageMode === "account" ? (
          <StatusPill>{signedInLabel}</StatusPill>
        ) : (
          <StatusPill tone="gold">{copy.accountControls.accountSyncOptional}</StatusPill>
        )}
        {hasLocalBackupWaiting ? (
          <StatusPill tone="gold">{copy.accountControls.localBackupWaitingPill}</StatusPill>
        ) : null}
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => void onRefresh()}
          disabled={isRefreshing}
          className="rounded-full border border-border bg-white px-4 py-2 text-sm font-semibold text-foreground transition hover:border-accent/40 hover:text-accent-strong disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isRefreshing
            ? copy.accountControls.refreshing
            : copy.accountControls.refreshSavedData}
        </button>

        {storageMode === "account" ? (
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/settings" })}
            className="rounded-full border border-border bg-white px-4 py-2 text-sm font-semibold text-foreground transition hover:border-accent/40 hover:text-accent-strong"
          >
            {copy.accountControls.signOut}
          </button>
        ) : (
          <Link
            href="/auth"
            className="rounded-full bg-accent-strong px-4 py-2 text-sm font-semibold text-white transition hover:bg-accent"
          >
            {copy.accountControls.signInOrCreate}
          </Link>
        )}

        <Link
          href="/dashboard"
          className="rounded-full border border-border bg-white px-4 py-2 text-sm font-semibold text-foreground transition hover:border-accent/40 hover:text-accent-strong"
        >
          {copy.accountControls.openDashboard}
        </Link>

        <Link
          href="/review"
          className="rounded-full border border-border bg-white px-4 py-2 text-sm font-semibold text-foreground transition hover:border-accent/40 hover:text-accent-strong"
        >
          {copy.accountControls.openHandReview}
        </Link>
      </div>
    </SurfaceCard>
  );
}
