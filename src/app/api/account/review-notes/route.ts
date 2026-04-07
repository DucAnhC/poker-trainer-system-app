import { NextResponse } from "next/server";

import type { HandReviewNote } from "@/types/training";
import { requireAuthenticatedUser } from "@/lib/auth/session";
import { upsertUserHandReviewNote } from "@/lib/server/user-data";

export async function POST(request: Request) {
  try {
    const user = await requireAuthenticatedUser();
    const body = (await request.json().catch(() => null)) as
      | {
          note?: Partial<HandReviewNote>;
        }
      | null;

    const note = await upsertUserHandReviewNote(user.id, body?.note);

    return NextResponse.json({
      note,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json(
        {
          message: "Sign in to save review notes to your account.",
        },
        {
          status: 401,
        },
      );
    }

    return NextResponse.json(
      {
        message: "Failed to save the review note.",
      },
      {
        status: 500,
      },
    );
  }
}
