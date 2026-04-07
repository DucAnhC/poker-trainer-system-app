import { fetchCloudAppSnapshot } from "@/lib/persistence/cloud-app-data";
import { readLocalAppSnapshot } from "@/lib/persistence/local-app-snapshot";
import type { LocalAppSnapshot } from "@/lib/persistence/local-app-snapshot";
import type { PersistenceMode } from "@/types/training";

export async function loadPersistedAppSnapshot(
  storageMode: PersistenceMode,
): Promise<LocalAppSnapshot> {
  if (storageMode === "account") {
    return fetchCloudAppSnapshot();
  }

  return readLocalAppSnapshot();
}
