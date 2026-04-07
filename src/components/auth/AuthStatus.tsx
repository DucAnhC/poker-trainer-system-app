"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

import { StatusPill } from "@/components/ui/StatusPill";

export function AuthStatus() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="flex flex-wrap items-center gap-2">
        <StatusPill>Checking account</StatusPill>
      </div>
    );
  }

  if (status === "authenticated" && session.user) {
    return (
      <div className="flex flex-wrap items-center gap-2">
        <StatusPill tone="success">Account sync on</StatusPill>
        <span className="text-sm text-muted-foreground">
          {session.user.email ?? session.user.name ?? "Signed in"}
        </span>
        <span className="text-sm text-muted-foreground">
          Progress, sessions, and review notes are account-backed.
        </span>
        <Link
          href="/settings"
          className="rounded-full border border-border bg-white px-4 py-2 text-sm font-semibold text-foreground transition hover:border-accent/40 hover:text-accent-strong"
        >
          Settings
        </Link>
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/dashboard" })}
          className="rounded-full border border-border bg-white px-4 py-2 text-sm font-semibold text-foreground transition hover:border-accent/40 hover:text-accent-strong"
        >
          Sign out
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <StatusPill>Local mode</StatusPill>
      <span className="text-sm text-muted-foreground">
        Progress stays in this browser until you sign in.
      </span>
      <Link
        href="/settings"
        className="rounded-full border border-border bg-white px-4 py-2 text-sm font-semibold text-foreground transition hover:border-accent/40 hover:text-accent-strong"
      >
        Settings
      </Link>
      <Link
        href="/auth"
        className="rounded-full bg-accent-strong px-4 py-2 text-sm font-semibold text-white transition hover:bg-accent"
      >
        Sign in
      </Link>
    </div>
  );
}
