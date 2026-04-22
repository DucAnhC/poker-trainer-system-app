import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type SurfaceCardProps = HTMLAttributes<HTMLDivElement>;

export function SurfaceCard({
  className,
  children,
  ...props
}: SurfaceCardProps) {
  return (
    <div
      className={cn(
        "rounded-[28px] border border-slate-200/90 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(241,245,249,0.96))] p-5 shadow-[0_28px_80px_-34px_rgba(0,0,0,0.68)] ring-1 ring-white/10 backdrop-blur sm:p-6",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
