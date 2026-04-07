const storageNamespace = "poker-trainer-system";

export const progressStorageKey = `${storageNamespace}:progress`;
export const handReviewStorageKey =
  `${storageNamespace}:hand-review-notes`;

export const appStorageKeys = [
  progressStorageKey,
  handReviewStorageKey,
] as const;
