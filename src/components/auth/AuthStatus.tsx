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
        <StatusPill className="border-white/10 bg-black/[0.12] text-slate-200">
          {copy.authStatus.checking}
        </StatusPill>
      </div>
    );
  }

  if (status === "authenticated" && session.user) {
    return (
      <div className="flex flex-wrap items-center gap-2">
        <StatusPill className="border-emerald-200/25 bg-emerald-300/10 text-emerald-100">
          {copy.authStatus.accountSyncOn}
        </StatusPill>
        <span className="rounded-full border border-white/10 bg-black/[0.12] px-3 py-2 text-sm text-slate-200">
          {session.user.email ?? session.user.name ?? copy.authStatus.signedInFallback}
        </span>
        <Link
          href="/settings"
          className="rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-sm font-semibold text-slate-100 transition hover:border-white/20 hover:bg-white/[0.1]"
        >
          {copy.authStatus.settings}
        </Link>
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/dashboard" })}
          className="rounded-full border border-white/10 bg-transparent px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-white/20 hover:bg-white/[0.06]"
        >
          {copy.authStatus.signOut}
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <StatusPill className="border-white/10 bg-black/[0.12] text-slate-200">
        {copy.authStatus.localMode}
      </StatusPill>
      <Link
        href="/settings"
        className="rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-sm font-semibold text-slate-100 transition hover:border-white/20 hover:bg-white/[0.1]"
      >
        {copy.authStatus.settings}
      </Link>
      <Link
        href="/auth"
        className="rounded-full bg-[linear-gradient(135deg,rgba(34,197,94,0.96),rgba(6,182,212,0.96))] px-4 py-2 text-sm font-semibold text-white transition hover:brightness-105"
      >
        {copy.authStatus.signIn}
      </Link>
    </div>
  );
}
