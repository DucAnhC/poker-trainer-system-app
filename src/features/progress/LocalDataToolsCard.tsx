"use client";

import { type ChangeEvent, useRef, useState } from "react";

import { useUiCopy } from "@/components/i18n/UiLanguageProvider";
import { SurfaceCard } from "@/components/ui/SurfaceCard";
import { StatusPill } from "@/components/ui/StatusPill";
import { mergeLocalSnapshotIntoCloud } from "@/lib/persistence/cloud-app-data";
import {
  applyLocalAppDataImport,
  createDownloadedBackupFilename,
  parseLocalAppDataImport,
  resetLocalAppData,
  serializeLocalAppDataExport,
} from "@/lib/persistence/local-app-data";
import { readLocalAppSnapshot } from "@/lib/persistence/local-app-snapshot";
import {
  getAppSnapshotStats,
  hasAppSnapshotData,
  type AppSnapshotStats,
} from "@/lib/persistence/snapshot-insights";
import type { PersistenceMode } from "@/types/training";

type LocalDataToolsCardProps = {
  onDataChanged: () => void;
  storageMode: PersistenceMode;
  userEmail: string | null;
  snapshotStats: AppSnapshotStats;
  localBackupStats: AppSnapshotStats;
};

type ToolMessage = {
  tone: "neutral" | "success" | "danger";
  text: string;
};

function downloadJsonFile(filename: string, content: string) {
  const blob = new Blob([content], { type: "application/json" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;
  link.click();

  window.URL.revokeObjectURL(url);
}

export function LocalDataToolsCard({
  onDataChanged,
  storageMode,
  userEmail,
  snapshotStats,
  localBackupStats,
}: LocalDataToolsCardProps) {
  const copy = useUiCopy();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [message, setMessage] = useState<ToolMessage | null>(null);
  const [isImportingToAccount, setIsImportingToAccount] = useState(false);
  const hasLocalBackupData = hasAppSnapshotData(localBackupStats);
  const hasAccountData =
    storageMode === "account" && hasAppSnapshotData(snapshotStats);

  function handleExport() {
    if (!hasLocalBackupData) {
      setMessage({
        tone: "neutral",
        text: copy.localDataTools.noLocalDataToExport,
      });
      return;
    }

    downloadJsonFile(
      createDownloadedBackupFilename(),
      serializeLocalAppDataExport(),
    );
    setMessage({
      tone: "success",
      text: copy.localDataTools.exportedBackup(
        localBackupStats.attemptCount,
        localBackupStats.sessionCount,
        localBackupStats.reviewNoteCount,
      ),
    });
  }

  async function handleImportChange(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const selectedFile = event.target.files?.[0];

    event.target.value = "";

    if (!selectedFile) {
      return;
    }

    try {
      const rawValue = await selectedFile.text();
      const parsedResult = parseLocalAppDataImport(rawValue);

      if (!parsedResult.ok) {
        setMessage({
          tone: "danger",
          text: parsedResult.message,
        });
        return;
      }

      const importStats = getAppSnapshotStats({
        progress: parsedResult.data.progress,
        handReviewNotes: parsedResult.data.handReviewNotes,
      });

      if (typeof window !== "undefined") {
        const shouldImport = window.confirm(
          copy.localDataTools.localImportConfirm(
            importStats.attemptCount,
            importStats.sessionCount,
            importStats.reviewNoteCount,
            localBackupStats.attemptCount,
            localBackupStats.sessionCount,
            localBackupStats.reviewNoteCount,
          ),
        );

        if (!shouldImport) {
          setMessage({
            tone: "neutral",
            text: copy.localDataTools.importCanceled,
          });
          return;
        }
      }

      applyLocalAppDataImport(parsedResult.data);
      onDataChanged();
      setMessage({
        tone: "success",
        text: copy.localDataTools.importApplied(
          parsedResult.data.progress.attempts.length,
          parsedResult.data.progress.sessions.length,
          parsedResult.data.handReviewNotes.length,
        ),
      });
    } catch {
      setMessage({
        tone: "danger",
        text: copy.localDataTools.importReadFailed,
      });
    }
  }

  async function handleImportToAccount() {
    if (!hasLocalBackupData) {
      setMessage({
        tone: "neutral",
        text: copy.localDataTools.noLocalDataToAccount,
      });
      return;
    }

    if (typeof window !== "undefined") {
      const shouldImport = window.confirm(
        copy.localDataTools.accountImportConfirm,
      );

      if (!shouldImport) {
        setMessage({
          tone: "neutral",
          text: copy.localDataTools.accountImportCanceled,
        });
        return;
      }
    }

    setIsImportingToAccount(true);

    try {
      const localSnapshot = readLocalAppSnapshot();
      const result = await mergeLocalSnapshotIntoCloud(localSnapshot);
      onDataChanged();
      setMessage({
        tone: "success",
        text: copy.localDataTools.accountImportDone(
          result.snapshot.progress.attempts.length,
          result.snapshot.progress.sessions.length,
          result.snapshot.handReviewNotes.length,
        ),
      });
    } catch (error) {
      setMessage({
        tone: "danger",
        text:
          error instanceof Error
            ? error.message
            : copy.localDataTools.accountImportFailed,
      });
    } finally {
      setIsImportingToAccount(false);
    }
  }

  function handleReset() {
    if (!hasLocalBackupData) {
      setMessage({
        tone: "neutral",
        text: copy.localDataTools.noLocalDataToReset,
      });
      return;
    }

    if (typeof window !== "undefined") {
      const shouldReset = window.confirm(
        copy.localDataTools.resetConfirm(
          localBackupStats.attemptCount,
          localBackupStats.sessionCount,
          localBackupStats.reviewNoteCount,
        ),
      );

      if (!shouldReset) {
        setMessage({
          tone: "neutral",
          text: copy.localDataTools.resetCanceled,
        });
        return;
      }
    }

    resetLocalAppData();
    onDataChanged();
    setMessage({
      tone: "success",
      text: copy.localDataTools.resetDone,
    });
  }

  return (
    <SurfaceCard className="space-y-4">
      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent-strong">
          {copy.localDataTools.eyebrow}
        </p>
        <h2 className="text-2xl font-semibold text-foreground">
          {copy.localDataTools.title}
        </h2>
        <p className="text-sm leading-6 text-muted-foreground">
          {storageMode === "account"
            ? copy.localDataTools.descriptionAccount
            : copy.localDataTools.descriptionLocal}
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-border/70 bg-muted/20 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            {copy.localDataTools.localBrowserBackup}
          </p>
          <p className="mt-2 text-lg font-semibold text-foreground">
            {hasLocalBackupData
              ? copy.localDataTools.readyForBackup
              : copy.localDataTools.noLocalDataSaved}
          </p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {copy.localDataTools.localBackupSummary(
              localBackupStats.attemptCount,
              localBackupStats.sessionCount,
              localBackupStats.reviewNoteCount,
            )}
          </p>
        </div>

        <div className="rounded-2xl border border-border/70 bg-muted/20 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            {storageMode === "account"
              ? copy.localDataTools.signedInAccount
              : copy.localDataTools.importBehavior}
          </p>
          <p className="mt-2 text-lg font-semibold text-foreground">
            {storageMode === "account"
              ? hasAccountData
                ? copy.localDataTools.accountDataExists
                : copy.localDataTools.accountReadyFirstImport
              : copy.localDataTools.localImportReplacesSnapshot}
          </p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {storageMode === "account"
              ? copy.localDataTools.accountSummary(
                  snapshotStats.attemptCount,
                  snapshotStats.sessionCount,
                  snapshotStats.reviewNoteCount,
                  userEmail ?? copy.localDataTools.signedInAccount,
                )
              : copy.localDataTools.localImportHelp}
          </p>
        </div>
      </div>

      {storageMode === "account" ? (
        <div className="rounded-2xl border border-emerald-200/80 bg-emerald-50/70 p-4">
          <div className="flex flex-wrap gap-2">
            <StatusPill tone="success">{copy.localDataTools.mergeByStableIds}</StatusPill>
            <StatusPill tone="accent">{copy.localDataTools.localCopyStays}</StatusPill>
            {hasAccountData ? (
              <StatusPill tone="gold">{copy.localDataTools.existingAccountDataKept}</StatusPill>
            ) : null}
          </div>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            {copy.localDataTools.mergeExplanation}
          </p>
        </div>
      ) : null}

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={handleExport}
          disabled={!hasLocalBackupData}
          className="rounded-full bg-accent-strong px-4 py-2 text-sm font-semibold text-white transition hover:bg-accent disabled:cursor-not-allowed disabled:opacity-70"
        >
          {hasLocalBackupData
            ? copy.localDataTools.exportJson
            : copy.localDataTools.noLocalDataExportButton}
        </button>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="rounded-full border border-border bg-white px-4 py-2 text-sm font-semibold text-foreground transition hover:border-accent/40 hover:text-accent-strong"
        >
          {copy.localDataTools.importJson}
        </button>
        <button
          type="button"
          onClick={handleReset}
          disabled={!hasLocalBackupData}
          className="rounded-full border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700 transition hover:border-rose-300 hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {hasLocalBackupData
            ? copy.localDataTools.resetLocalData
            : copy.localDataTools.noLocalDataResetButton}
        </button>
        {storageMode === "account" ? (
          <button
            type="button"
            onClick={handleImportToAccount}
            disabled={isImportingToAccount || !hasLocalBackupData}
            className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 transition hover:border-emerald-300 hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isImportingToAccount
              ? copy.localDataTools.importing
              : hasLocalBackupData
                ? copy.localDataTools.importLocalToAccount
                : copy.localDataTools.noLocalDataImportButton}
          </button>
        ) : null}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="application/json"
        className="hidden"
        onChange={handleImportChange}
      />

      <div className="flex flex-wrap gap-2">
        <StatusPill tone="accent">
          {storageMode === "account"
            ? copy.localDataTools.localBackupTools
            : copy.localDataTools.localOnly}
        </StatusPill>
        {storageMode === "account" ? (
          <StatusPill tone="success">
            {copy.localDataTools.syncingTo(userEmail ?? copy.settings.accountValue)}
          </StatusPill>
        ) : null}
        <StatusPill>{copy.localDataTools.jsonValidation}</StatusPill>
        <StatusPill tone="danger">{copy.localDataTools.resetRequiresConfirm}</StatusPill>
      </div>

      {message ? (
        <div className="rounded-2xl border border-border/70 bg-muted/20 p-4">
          <StatusPill tone={message.tone}>
            {copy.localDataTools[message.tone]}
          </StatusPill>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            {message.text}
          </p>
        </div>
      ) : null}
    </SurfaceCard>
  );
}
