import { SurfaceCard } from "@/components/ui/SurfaceCard";
import { StatusPill } from "@/components/ui/StatusPill";

type ProgressSummaryCardProps = {
  title: string;
  value: string;
  description: string;
  tone?: "accent" | "neutral" | "gold" | "success" | "danger";
};

export function ProgressSummaryCard({
  title,
  value,
  description,
  tone = "neutral",
}: ProgressSummaryCardProps) {
  return (
    <SurfaceCard className="space-y-3">
      <StatusPill tone={tone}>{title}</StatusPill>
      <p className="break-words text-2xl font-semibold leading-snug tracking-tight text-foreground">
        {value}
      </p>
      <p className="text-sm leading-6 text-muted-foreground">{description}</p>
    </SurfaceCard>
  );
}
