import { NextResponse } from "next/server";

import type { LocalAppSnapshot } from "@/lib/persistence/local-app-snapshot";
import { requireAuthenticatedUser } from "@/lib/auth/session";
import { mergeUserLocalSnapshotToCloud } from "@/lib/server/user-data";

export async function POST(request: Request) {
  try {
    const user = await requireAuthenticatedUser();
    const body = (await request.json().catch(() => null)) as
      | {
          snapshot?: LocalAppSnapshot;
        }
      | null;

    const snapshot = await mergeUserLocalSnapshotToCloud(
      user.id,
      body?.snapshot,
    );

    return NextResponse.json({
      message:
        "Local browser data was merged into the signed-in account without clearing the local copy.",
      snapshot,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json(
        {
          message: "Sign in before importing local data into an account.",
        },
        {
          status: 401,
        },
      );
    }

    return NextResponse.json(
      {
        message: "Failed to import local data into the account.",
      },
      {
        status: 500,
      },
    );
  }
}
