export function cn(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

export function formatPercent(value: number) {
  return `${Math.round(value)}%`;
}

export function formatDateTimeLabel(value: string | null) {
  if (!value) {
    return "Not yet completed";
  }

  return new Date(value).toLocaleString();
}
