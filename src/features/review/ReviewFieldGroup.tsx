import type { ReactNode } from "react";

type ReviewFieldGroupProps = {
  label: string;
  hint?: string;
  children: ReactNode;
};

export function ReviewFieldGroup({
  label,
  hint,
  children,
}: ReviewFieldGroupProps) {
  return (
    <label className="space-y-2">
      <span className="block text-sm font-semibold text-foreground">{label}</span>
      {hint ? (
        <span className="block text-xs leading-5 text-muted-foreground">
          {hint}
        </span>
      ) : null}
      {children}
    </label>
  );
}
