import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type StatusPillProps = HTMLAttributes<HTMLSpanElement> & {
  tone?: "accent" | "neutral" | "gold" | "success" | "danger";
};

export function StatusPill({
  tone = "neutral",
  className,
  children,
  ...props
}: StatusPillProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]",
        tone === "accent" &&
          "border-cyan-700/45 bg-cyan-950 text-cyan-100",
        tone === "neutral" &&
          "border-slate-700/45 bg-slate-950 text-slate-100",
        tone === "gold" && "border-amber-700/45 bg-amber-950 text-amber-100",
        tone === "success" &&
          "border-emerald-700/45 bg-emerald-950 text-emerald-100",
        tone === "danger" && "border-rose-700/45 bg-rose-950 text-rose-100",
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
