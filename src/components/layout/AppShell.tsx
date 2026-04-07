import type { ReactNode } from "react";

import { SiteHeader } from "@/components/layout/SiteHeader";

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-felt">
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-5 py-8 lg:px-8 lg:py-10">
        {children}
      </main>
    </div>
  );
}
