import type { ReactNode } from "react";

import { SiteHeader } from "@/components/layout/SiteHeader";

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[linear-gradient(180deg,rgba(5,18,25,0.98),rgba(6,20,31,0.98)_38%,rgba(2,7,14,1))]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.16),transparent_28%),radial-gradient(circle_at_top_right,rgba(6,182,212,0.12),transparent_24%),radial-gradient(circle_at_bottom_left,rgba(15,118,110,0.12),transparent_26%)]" />
      <div className="relative">
        <SiteHeader />
        <main className="mx-auto flex w-full max-w-[1540px] flex-col gap-8 px-5 py-8 lg:px-8 lg:py-10">
          {children}
        </main>
      </div>
    </div>
  );
}
