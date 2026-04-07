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
    <label className="space-y-3">
      <span className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-300">
        {label}
      </span>
      {hint ? (
        <span className="block text-xs leading-5 text-slate-400">
          {hint}
        </span>
      ) : null}
      {children}
    </label>
  );
}
