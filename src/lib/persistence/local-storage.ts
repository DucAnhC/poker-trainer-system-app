function canUseLocalStorage() {
  return typeof window !== "undefined";
}

export function readJsonStorageValue<T = unknown>(key: string): T | null {
  if (!canUseLocalStorage()) {
    return null;
  }

  try {
    const rawValue = window.localStorage.getItem(key);

    if (!rawValue) {
      return null;
    }

    return JSON.parse(rawValue) as T;
  } catch {
    return null;
  }
}

export function writeJsonStorageValue(key: string, value: unknown) {
  if (!canUseLocalStorage()) {
    return;
  }

  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore local persistence failures so training flows still render.
  }
}

export function removeStorageValue(key: string) {
  if (!canUseLocalStorage()) {
    return;
  }

  try {
    window.localStorage.removeItem(key);
  } catch {
    // Ignore local persistence failures so reset tools degrade safely.
  }
}
