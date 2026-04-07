import { PageLoadingState } from "@/components/ui/PageLoadingState";

export default function RootLoading() {
  return (
    <PageLoadingState
      eyebrow="Loading"
      title="Preparing the poker trainer system"
      description="Loading the current route, persisted study data, and account state."
    />
  );
}
