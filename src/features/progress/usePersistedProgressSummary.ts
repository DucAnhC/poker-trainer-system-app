"use client";

import { usePersistedAppSnapshot } from "@/features/persistence/usePersistedAppSnapshot";

export function usePersistedProgressSummary() {
  const persistedSnapshot = usePersistedAppSnapshot();

  return {
    hasLoaded: persistedSnapshot.hasLoaded,
    isAuthenticated: persistedSnapshot.isAuthenticated,
    isRefreshing: persistedSnapshot.isRefreshing,
    loadError: persistedSnapshot.loadError,
    progressSummary: persistedSnapshot.progressSummary,
    refreshProgressSummary: persistedSnapshot.refreshSnapshot,
    storageMode: persistedSnapshot.storageMode,
    userEmail: persistedSnapshot.userEmail,
    snapshot: persistedSnapshot.snapshot,
    localBackupSnapshot: persistedSnapshot.localBackupSnapshot,
    snapshotStats: persistedSnapshot.snapshotStats,
    localBackupStats: persistedSnapshot.localBackupStats,
    studyAnalytics: persistedSnapshot.studyAnalytics,
  };
}
