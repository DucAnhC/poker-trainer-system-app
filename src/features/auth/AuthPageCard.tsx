"use client";

import { useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import { useUiCopy } from "@/components/i18n/UiLanguageProvider";
import { SurfaceCard } from "@/components/ui/SurfaceCard";
import { StatusPill } from "@/components/ui/StatusPill";

type AuthMode = "sign-in" | "create-account";

type AuthMessage = {
  tone: "neutral" | "success" | "danger";
  text: string;
};

const inputClassName =
  "w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm text-foreground shadow-sm outline-none transition placeholder:text-muted-foreground focus:border-accent/40 focus:ring-2 focus:ring-accent/10";

export function AuthPageCard() {
  const copy = useUiCopy();
  const router = useRouter();
  const { status } = useSession();
  const [mode, setMode] = useState<AuthMode>("sign-in");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<AuthMessage | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail || !password) {
      setMessage({
        tone: "danger",
        text: copy.authPage.missingCredentials,
      });
      return;
    }

    setIsSubmitting(true);
    setMessage(null);

    try {
      if (mode === "create-account") {
        const registerResponse = await fetch("/api/auth/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: normalizedEmail,
            password,
            name: name.trim(),
          }),
        });
        const registerPayload = (await registerResponse.json().catch(() => null)) as
          | {
              message?: string;
            }
          | null;

        if (!registerResponse.ok) {
          throw new Error(
            registerPayload?.message ?? copy.authPage.createAccountFailed,
          );
        }
      }

      const signInResult = await signIn("credentials", {
        email: normalizedEmail,
        password,
        redirect: false,
      });

      if (!signInResult || signInResult.error) {
        throw new Error(copy.authPage.signInFailed);
      }

      setMessage({
        tone: "success",
        text:
          mode === "create-account"
            ? copy.authPage.accountCreated
            : copy.authPage.signedInSuccess,
      });
      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      setMessage({
        tone: "danger",
        text:
          error instanceof Error
            ? error.message
            : copy.authPage.authenticationFailed,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  if (status === "authenticated") {
    return (
      <SurfaceCard className="space-y-4">
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent-strong">
            {copy.authPage.accountModeEyebrow}
          </p>
          <h2 className="text-2xl font-semibold text-foreground">
            {copy.authPage.alreadySignedInTitle}
          </h2>
          <p className="text-sm leading-6 text-muted-foreground">
            {copy.authPage.alreadySignedInDescription}
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => router.push("/dashboard")}
            className="rounded-full bg-accent-strong px-4 py-2 text-sm font-semibold text-white transition hover:bg-accent"
          >
            {copy.authPage.backToDashboard}
          </button>
          <button
            type="button"
            onClick={() => router.push("/settings")}
            className="rounded-full border border-border bg-white px-4 py-2 text-sm font-semibold text-foreground transition hover:border-accent/40 hover:text-accent-strong"
          >
            {copy.authPage.openSettings}
          </button>
        </div>
      </SurfaceCard>
    );
  }

  return (
    <SurfaceCard className="space-y-5">
      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent-strong">
          {copy.authPage.accessEyebrow}
        </p>
        <h2 className="text-2xl font-semibold text-foreground">
          {mode === "sign-in"
            ? copy.authPage.signInTitle
            : copy.authPage.createAccountTitle}
        </h2>
        <p className="text-sm leading-6 text-muted-foreground">
          {copy.authPage.intro}
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => setMode("sign-in")}
          className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
            mode === "sign-in"
              ? "border-accent/30 bg-accent/10 text-accent-strong"
              : "border-border bg-white text-foreground hover:border-accent/40 hover:text-accent-strong"
          }`}
        >
          {copy.authPage.signInTab}
        </button>
        <button
          type="button"
          onClick={() => setMode("create-account")}
          className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
            mode === "create-account"
              ? "border-accent/30 bg-accent/10 text-accent-strong"
              : "border-border bg-white text-foreground hover:border-accent/40 hover:text-accent-strong"
          }`}
        >
          {copy.authPage.createAccountTab}
        </button>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        {mode === "create-account" ? (
          <label className="block space-y-2">
            <span className="text-sm font-semibold text-foreground">
              {copy.authPage.displayName}
            </span>
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className={inputClassName}
              placeholder={copy.authPage.optional}
              autoComplete="name"
            />
          </label>
        ) : null}

        <label className="block space-y-2">
          <span className="text-sm font-semibold text-foreground">
            {copy.authPage.email}
          </span>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className={inputClassName}
            placeholder="you@example.com"
            autoComplete="email"
          />
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-semibold text-foreground">
            {copy.authPage.password}
          </span>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className={inputClassName}
            placeholder={copy.authPage.passwordHint}
            autoComplete={
              mode === "create-account" ? "new-password" : "current-password"
            }
          />
        </label>

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-full bg-accent-strong px-4 py-2 text-sm font-semibold text-white transition hover:bg-accent disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting
            ? copy.authPage.submitWorking
            : mode === "sign-in"
              ? copy.authPage.signInTitle
              : copy.authPage.createAccountTitle}
        </button>
      </form>

      <div className="flex flex-wrap gap-2">
        <StatusPill tone="success">{copy.authPage.syncAvailable}</StatusPill>
        <StatusPill>{copy.authPage.localModeSupported}</StatusPill>
        <StatusPill tone="gold">{copy.authPage.manualMerge}</StatusPill>
      </div>

      {message ? (
        <div className="rounded-2xl border border-border/70 bg-muted/20 p-4">
          <StatusPill tone={message.tone}>
            {message.tone === "success"
              ? copy.locale === "vi-VN"
                ? "Ổn"
                : "OK"
              : copy.locale === "vi-VN"
                ? "Lỗi"
                : "Error"}
          </StatusPill>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            {message.text}
          </p>
        </div>
      ) : null}
    </SurfaceCard>
  );
}
