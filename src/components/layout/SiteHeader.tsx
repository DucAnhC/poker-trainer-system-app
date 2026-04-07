"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { AuthStatus } from "@/components/auth/AuthStatus";
import { LanguageToggle } from "@/components/i18n/LanguageToggle";
import { useUiCopy } from "@/components/i18n/UiLanguageProvider";
import { siteNavigation } from "@/lib/navigation";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const copy = useUiCopy();
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 border-b border-slate-900/70 bg-[linear-gradient(180deg,rgba(7,16,28,0.96),rgba(8,23,32,0.94))] text-white backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-4 lg:px-8">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-3"
          >
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-[18px] bg-[linear-gradient(135deg,rgba(34,197,94,0.96),rgba(6,182,212,0.96))] text-sm font-black uppercase tracking-[0.18em] text-white shadow-[0_18px_36px_-18px_rgba(34,197,94,0.7)]">
              PT
            </span>
            <span className="space-y-1">
              <span className="block text-sm font-semibold uppercase tracking-[0.24em] text-cyan-100">
                {copy.appName}
              </span>
              <span className="block text-sm text-slate-300">{copy.header.tagline}</span>
            </span>
          </Link>

          <div className="flex flex-wrap items-center gap-3 xl:justify-end">
            <LanguageToggle />
            <AuthStatus />
          </div>
        </div>

        <nav
          aria-label="Primary"
          className="flex flex-wrap gap-2 rounded-[24px] border border-white/10 bg-black/[0.12] p-2"
        >
          {siteNavigation.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === item.href
                : pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-semibold transition",
                  isActive
                    ? "bg-[linear-gradient(135deg,rgba(34,197,94,0.96),rgba(6,182,212,0.96))] text-white shadow-[0_16px_34px_-18px_rgba(34,197,94,0.7)]"
                    : "border border-white/[0.08] bg-transparent text-slate-300 hover:border-white/[0.16] hover:bg-white/[0.06] hover:text-white",
                )}
              >
                {copy.nav[item.key]}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
