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
        "inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em]",
        tone === "accent" &&
          "border-accent/20 bg-accent/10 text-accent-strong",
        tone === "neutral" &&
          "border-border bg-muted/55 text-muted-foreground",
        tone === "gold" && "border-gold/25 bg-gold/15 text-amber-800",
        tone === "success" &&
          "border-emerald-200 bg-emerald-50 text-emerald-700",
        tone === "danger" && "border-rose-200 bg-rose-50 text-rose-700",
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
