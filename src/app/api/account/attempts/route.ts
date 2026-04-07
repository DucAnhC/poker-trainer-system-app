import { NextResponse } from "next/server";

import type { QuizAttempt } from "@/types/training";
import { requireAuthenticatedUser } from "@/lib/auth/session";
import { upsertUserQuizAttempt } from "@/lib/server/user-data";

export async function POST(request: Request) {
  try {
    const user = await requireAuthenticatedUser();
    const body = (await request.json().catch(() => null)) as
      | {
          attempt?: Partial<QuizAttempt>;
        }
      | null;

    const attempt = await upsertUserQuizAttempt(user.id, body?.attempt);

    return NextResponse.json({
      attempt,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json(
        {
          message: "Sign in to save training attempts to your account.",
        },
        {
          status: 401,
        },
      );
    }

    if (error instanceof Error && error.message === "INVALID_ATTEMPT") {
      return NextResponse.json(
        {
          message: "The training attempt payload was invalid.",
        },
        {
          status: 400,
        },
      );
    }

    return NextResponse.json(
      {
        message: "Failed to save the training attempt.",
      },
      {
        status: 500,
      },
    );
  }
}
