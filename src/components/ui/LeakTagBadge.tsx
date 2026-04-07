import { leakTagMap, type LeakTagDefinition } from "@/data/leak-tags";
import { StatusPill } from "@/components/ui/StatusPill";
import { cn } from "@/lib/utils";

type LeakTagBadgeProps = {
  leakTagId?: string;
  leakTag?: LeakTagDefinition;
  count?: number;
  className?: string;
};

function getLeakTagTone(category: LeakTagDefinition["category"]) {
  if (category === "math") {
    return "gold" as const;
  }

  if (category === "postflop-planning" || category === "player-adjustment") {
    return "accent" as const;
  }

  if (category === "review-habit") {
    return "danger" as const;
  }

  return "neutral" as const;
}

export function LeakTagBadge({
  leakTagId,
  leakTag,
  count,
  className,
}: LeakTagBadgeProps) {
  const resolvedLeakTag = leakTag ?? (leakTagId ? leakTagMap[leakTagId] : null);

  if (!resolvedLeakTag) {
    return null;
  }

  return (
    <StatusPill
      tone={getLeakTagTone(resolvedLeakTag.category)}
      className={cn("gap-2 normal-case tracking-[0.08em]", className)}
      title={resolvedLeakTag.description}
    >
      {resolvedLeakTag.label}
      {typeof count === "number" ? <span>{count}</span> : null}
    </StatusPill>
  );
}
