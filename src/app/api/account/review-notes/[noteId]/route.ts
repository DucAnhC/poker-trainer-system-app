import { NextResponse } from "next/server";

import { requireAuthenticatedUser } from "@/lib/auth/session";
import { deleteUserHandReviewNote } from "@/lib/server/user-data";

type RouteContext = {
  params: Promise<{
    noteId: string;
  }>;
};

export async function DELETE(
  _request: Request,
  context: RouteContext,
) {
  try {
    const user = await requireAuthenticatedUser();
    const { noteId } = await context.params;

    await deleteUserHandReviewNote(user.id, noteId);

    return NextResponse.json({
      ok: true,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json(
        {
          message: "Sign in to delete review notes from your account.",
        },
        {
          status: 401,
        },
      );
    }

    return NextResponse.json(
      {
        message: "Failed to delete the review note.",
      },
      {
        status: 500,
      },
    );
  }
}
