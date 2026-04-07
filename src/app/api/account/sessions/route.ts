import { NextResponse } from "next/server";

import type { TrainingSession } from "@/types/training";
import { requireAuthenticatedUser } from "@/lib/auth/session";
import { upsertUserTrainingSession } from "@/lib/server/user-data";

export async function POST(request: Request) {
  try {
    const user = await requireAuthenticatedUser();
    const body = (await request.json().catch(() => null)) as
      | {
          session?: Partial<TrainingSession>;
        }
      | null;

    const session = await upsertUserTrainingSession(user.id, body?.session);

    return NextResponse.json({
      session,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json(
        {
          message: "Sign in to save training sessions to your account.",
        },
        {
          status: 401,
        },
      );
    }

    if (error instanceof Error && error.message === "INVALID_SESSION") {
      return NextResponse.json(
        {
          message: "The training session payload was invalid.",
        },
        {
          status: 400,
        },
      );
    }

    return NextResponse.json(
      {
        message: "Failed to save the training session.",
      },
      {
        status: 500,
      },
    );
  }
}
