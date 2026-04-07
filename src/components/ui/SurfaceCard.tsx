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
        "rounded-[28px] border border-border bg-surface/92 p-5 shadow-panel backdrop-blur sm:p-6",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
