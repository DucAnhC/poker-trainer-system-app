import { SurfaceCard } from "@/components/ui/SurfaceCard";
import { StatusPill } from "@/components/ui/StatusPill";

type ComingSoonCardProps = {
  title: string;
  description: string;
  bullets: string[];
};

export function ComingSoonCard({
  title,
  description,
  bullets,
}: ComingSoonCardProps) {
  return (
    <SurfaceCard className="flex flex-col gap-4">
      <StatusPill tone="gold">Planned next</StatusPill>
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-foreground">{title}</h2>
        <p className="text-sm leading-6 text-muted-foreground">{description}</p>
      </div>
      <ul className="space-y-2 text-sm text-muted-foreground">
        {bullets.map((bullet) => (
          <li key={bullet}>- {bullet}</li>
        ))}
      </ul>
    </SurfaceCard>
  );
}
