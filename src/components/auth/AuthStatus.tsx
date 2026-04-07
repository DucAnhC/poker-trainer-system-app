"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

import { useUiCopy } from "@/components/i18n/UiLanguageProvider";
import { StatusPill } from "@/components/ui/StatusPill";

export function AuthStatus() {
  const copy = useUiCopy();
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="flex flex-wrap items-center gap-2">
        <StatusPill>{copy.authStatus.checking}</StatusPill>
      </div>
    );
  }

  if (status === "authenticated" && session.user) {
    return (
      <div className="flex flex-wrap items-center gap-2">
        <StatusPill tone="success">{copy.authStatus.accountSyncOn}</StatusPill>
        <span className="text-sm text-muted-foreground">
          {session.user.email ?? session.user.name ?? copy.authStatus.signedInFallback}
        </span>
        <span className="text-sm text-muted-foreground">
          {copy.authStatus.accountModeDescription}
        </span>
        <Link
          href="/settings"
          className="rounded-full border border-border bg-white px-4 py-2 text-sm font-semibold text-foreground transition hover:border-accent/40 hover:text-accent-strong"
        >
          {copy.authStatus.settings}
        </Link>
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/dashboard" })}
          className="rounded-full border border-border bg-white px-4 py-2 text-sm font-semibold text-foreground transition hover:border-accent/40 hover:text-accent-strong"
        >
          {copy.authStatus.signOut}
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <StatusPill>{copy.authStatus.localMode}</StatusPill>
      <span className="text-sm text-muted-foreground">
        {copy.authStatus.localModeDescription}
      </span>
      <Link
        href="/settings"
        className="rounded-full border border-border bg-white px-4 py-2 text-sm font-semibold text-foreground transition hover:border-accent/40 hover:text-accent-strong"
      >
        {copy.authStatus.settings}
      </Link>
      <Link
        href="/auth"
        className="rounded-full bg-accent-strong px-4 py-2 text-sm font-semibold text-white transition hover:bg-accent"
      >
        {copy.authStatus.signIn}
      </Link>
    </div>
  );
}
