import { PageLoadingState } from "@/components/ui/PageLoadingState";

export default function SettingsLoading() {
  return (
    <PageLoadingState
      eyebrow="Settings"
      title="Loading account and progress tools"
      description="Preparing account mode, recent history, and local/cloud data management."
    />
  );
}
