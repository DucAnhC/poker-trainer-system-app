import type { Metadata } from "next";
import type { ReactNode } from "react";

import "@/app/globals.css";
import { getServerSession } from "next-auth";
import { AppShell } from "@/components/layout/AppShell";
import { AuthSessionProvider } from "@/components/auth/AuthSessionProvider";
import { authOptions } from "@/auth";

export const metadata: Metadata = {
  title: "Poker Trainer System",
  description:
    "Phase 10 build for a No-Limit Texas Hold'em decision-training platform with account-backed persistence, production deployment notes, and smoke-test readiness.",
};

type RootLayoutProps = {
  children: ReactNode;
};

export default async function RootLayout({ children }: RootLayoutProps) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <body>
        <AuthSessionProvider session={session}>
          <AppShell>{children}</AppShell>
        </AuthSessionProvider>
      </body>
    </html>
  );
}
