import { PageHeader } from "@/components/trainer/PageHeader";
import { StatusPill } from "@/components/ui/StatusPill";
import { SurfaceCard } from "@/components/ui/SurfaceCard";
import { AuthPageCard } from "@/features/auth/AuthPageCard";

export default function AuthPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Account"
        title="Sign in when you want progress and reviews to follow the account"
        description="The local-first trainer still works without an account, while Phase 10 makes the account-backed path easier to deploy and validate with clearer production setup expectations."
        aside={
          <>
            <StatusPill tone="success">Phase 10 live</StatusPill>
            <StatusPill>Production auth prep</StatusPill>
          </>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,0.95fr)_minmax(320px,1.05fr)]">
        <SurfaceCard className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent-strong">
              Why sign in
            </p>
            <h2 className="text-2xl font-semibold text-foreground">
              Keep the current product behavior, add account-backed syncing
            </h2>
          </div>

          <ul className="space-y-3 text-sm leading-6 text-muted-foreground">
            <li>- Training modules stay the same and still use the current scenario model.</li>
            <li>- Signed-in users can store attempts, session history, and review notes in the database.</li>
            <li>- The dashboard now makes account mode, recent study history, and next-step guidance easier to read.</li>
            <li>- Existing local browser data can be imported into the account later from the dashboard through a merge flow that keeps the local copy.</li>
            <li>- Local-only study remains available when you choose not to sign in.</li>
          </ul>
        </SurfaceCard>

        <AuthPageCard />
      </div>
    </div>
  );
}
