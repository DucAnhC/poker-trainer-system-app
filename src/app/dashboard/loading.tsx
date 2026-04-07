import { PageLoadingState } from "@/components/ui/PageLoadingState";

export default function DashboardLoading() {
  return (
    <PageLoadingState
      eyebrow="Dashboard"
      title="Loading the study dashboard"
      description="Preparing progress summaries, recent history, and next-step guidance."
    />
  );
}
