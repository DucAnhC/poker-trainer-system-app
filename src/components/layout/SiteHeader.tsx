"use client";

import Link from "next/link";

import { AuthStatus } from "@/components/auth/AuthStatus";
import { LanguageToggle } from "@/components/i18n/LanguageToggle";
import { useUiCopy } from "@/components/i18n/UiLanguageProvider";
import { siteNavigation } from "@/lib/navigation";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const copy = useUiCopy();

  return (
    <header className="border-b border-border/70 bg-white/78 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-5 lg:flex-row lg:items-start lg:justify-between lg:px-8">
        <div className="space-y-2">
          <Link
            href="/"
            className="inline-flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.24em] text-accent-strong"
          >
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-accent-strong text-white shadow-sm">
              PT
            </span>
            {copy.appName}
          </Link>
          <p className="max-w-xl text-sm leading-6 text-muted-foreground">
            {copy.header.tagline}
          </p>
        </div>

        <div className="space-y-4 lg:max-w-3xl lg:text-right">
          <div className="flex flex-wrap items-center gap-3 lg:justify-end">
            <LanguageToggle />
            <AuthStatus />
          </div>
          <nav aria-label="Primary" className="flex flex-wrap gap-2 lg:justify-end">
            {siteNavigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-full border border-border bg-white/85 px-4 py-2 text-sm font-medium text-foreground transition hover:border-accent/40 hover:text-accent-strong",
                )}
              >
                {copy.nav[item.key]}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
