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
        "rounded-3xl border border-border bg-surface/90 p-6 shadow-panel backdrop-blur",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
