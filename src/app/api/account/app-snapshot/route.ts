import { NextResponse } from "next/server";

import { requireAuthenticatedUser } from "@/lib/auth/session";
import { getUserAppSnapshot } from "@/lib/server/user-data";

export async function GET() {
  try {
    const user = await requireAuthenticatedUser();
    const snapshot = await getUserAppSnapshot(user.id);

    return NextResponse.json(snapshot);
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json(
        {
          message: "Sign in to access account-backed progress.",
        },
        {
          status: 401,
        },
      );
    }

    return NextResponse.json(
      {
        message: "Failed to load account-backed data.",
      },
      {
        status: 500,
      },
    );
  }
}
