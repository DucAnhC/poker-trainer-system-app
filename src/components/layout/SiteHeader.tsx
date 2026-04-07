import Link from "next/link";

import { AuthStatus } from "@/components/auth/AuthStatus";
import { siteNavigation } from "@/lib/navigation";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  return (
    <header className="border-b border-border/70 bg-white/70 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-5 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div className="space-y-2">
          <Link
            href="/"
            className="inline-flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.32em] text-accent-strong"
          >
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-accent-strong text-white">
              PT
            </span>
            Poker Trainer System
          </Link>
          <p className="max-w-2xl text-sm text-muted-foreground">
            Phase 10 keeps the training product stable while clarifying how to
            deploy it, validate auth and persistence, and run post-release
            smoke checks.
          </p>
        </div>

        <div className="space-y-3 lg:text-right">
          <AuthStatus />
          <nav aria-label="Primary" className="flex flex-wrap gap-2 lg:justify-end">
            {siteNavigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-full border border-border bg-white/80 px-4 py-2 text-sm font-medium text-foreground transition hover:border-accent/40 hover:text-accent-strong",
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
