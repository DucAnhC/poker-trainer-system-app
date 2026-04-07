import { getServerSession } from "next-auth";

import { authOptions } from "@/auth";

export async function getAuthSession() {
  return getServerSession(authOptions);
}

export async function requireAuthenticatedUser() {
  const session = await getAuthSession();
  const userId = session?.user?.id;

  if (!userId) {
    throw new Error("UNAUTHORIZED");
  }

  return {
    id: userId,
    email: session.user.email ?? null,
    name: session.user.name ?? null,
  };
}
