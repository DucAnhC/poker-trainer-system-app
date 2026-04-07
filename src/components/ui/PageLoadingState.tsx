import { ProgressSummaryCard } from "@/components/trainer/ProgressSummaryCard";
import { SurfaceCard } from "@/components/ui/SurfaceCard";

type PageLoadingStateProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function PageLoadingState({
  eyebrow,
  title,
  description,
}: PageLoadingStateProps) {
  return (
    <div className="space-y-8">
      <SurfaceCard className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent-strong">
          {eyebrow}
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          {title}
        </h1>
        <p className="text-sm leading-6 text-muted-foreground">{description}</p>
      </SurfaceCard>

      <div className="grid gap-6 lg:grid-cols-4">
        <ProgressSummaryCard
          title="Loading"
          value="..."
          description="Preparing account and study data."
        />
        <ProgressSummaryCard
          title="Loading"
          value="..."
          description="Reading persisted progress."
        />
        <ProgressSummaryCard
          title="Loading"
          value="..."
          description="Loading recent history."
        />
        <ProgressSummaryCard
          title="Loading"
          value="..."
          description="Preparing actions and recommendations."
        />
      </div>
    </div>
  );
}
