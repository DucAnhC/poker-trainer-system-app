import type { ReactNode } from "react";

import { SiteHeader } from "@/components/layout/SiteHeader";

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[linear-gradient(180deg,rgba(248,252,251,0.98),rgba(232,243,241,0.96))]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[26rem] bg-[radial-gradient(circle_at_top,rgba(8,145,178,0.12),transparent_34%),radial-gradient(circle_at_top_right,rgba(16,185,129,0.18),transparent_32%),linear-gradient(180deg,rgba(3,7,18,0.06),transparent)]" />
      <div className="relative">
        <SiteHeader />
        <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-5 py-8 lg:px-8 lg:py-10">
          {children}
        </main>
      </div>
    </div>
  );
}
