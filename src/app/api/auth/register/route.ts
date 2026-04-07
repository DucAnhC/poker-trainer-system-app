import { NextResponse } from "next/server";

import { hashPassword } from "@/lib/auth/passwords";
import { prisma } from "@/lib/server/prisma";

function normalizeEmail(value: unknown) {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}

function normalizeName(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizePassword(value: unknown) {
  return typeof value === "string" ? value : "";
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as
    | {
        email?: unknown;
        password?: unknown;
        name?: unknown;
      }
    | null;

  const email = normalizeEmail(body?.email);
  const password = normalizePassword(body?.password);
  const name = normalizeName(body?.name);

  if (!email || !password) {
    return NextResponse.json(
      {
        message: "Email and password are required.",
      },
      {
        status: 400,
      },
    );
  }

  if (password.length < 8) {
    return NextResponse.json(
      {
        message: "Use at least 8 characters for the password.",
      },
      {
        status: 400,
      },
    );
  }

  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (existingUser) {
    return NextResponse.json(
      {
        message: "An account with that email already exists.",
      },
      {
        status: 409,
      },
    );
  }

  const user = await prisma.user.create({
    data: {
      email,
      name: name || null,
      passwordHash: hashPassword(password),
    },
    select: {
      id: true,
      email: true,
      name: true,
      createdAt: true,
    },
  });

  return NextResponse.json({
    message: "Account created successfully.",
    user,
  });
}
