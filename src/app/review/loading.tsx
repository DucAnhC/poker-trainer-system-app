import { PageLoadingState } from "@/components/ui/PageLoadingState";

export default function ReviewLoading() {
  return (
    <PageLoadingState
      eyebrow="Hand Review"
      title="Loading saved review notes"
      description="Preparing the review form, note list, and recent study context."
    />
  );
}
