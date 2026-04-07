import type { NextAuthOptions } from "next-auth";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { verifyPassword } from "@/lib/auth/passwords";
import { getRequiredServerEnv } from "@/lib/config/server-env";
import { prisma } from "@/lib/server/prisma";

const authSecret = getRequiredServerEnv("NEXTAUTH_SECRET", {
  developmentFallback: "development-only-secret-change-before-production",
});
void getRequiredServerEnv("NEXTAUTH_URL", {
  developmentFallback: "http://localhost:3000",
});

export const authOptions: NextAuthOptions = {
  secret: authSecret,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth",
  },
  providers: [
    CredentialsProvider({
      name: "Email and password",
      credentials: {
        email: {
          label: "Email",
          type: "email",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },
      async authorize(credentials) {
        const email =
          typeof credentials?.email === "string"
            ? credentials.email.trim().toLowerCase()
            : "";
        const password =
          typeof credentials?.password === "string"
            ? credentials.password
            : "";

        if (!email || !password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: {
            email,
          },
        });

        if (!user) {
          return null;
        }

        if (!verifyPassword(password, user.passwordHash)) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name ?? user.email,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user?.id) {
        token.sub = user.id;
      }

      if (user?.email) {
        token.email = user.email;
      }

      if (user?.name) {
        token.name = user.name;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }

      if (session.user && typeof token.email === "string") {
        session.user.email = token.email;
      }

      if (session.user && typeof token.name === "string") {
        session.user.name = token.name;
      }

      return session;
    },
  },
};

export default NextAuth(authOptions);
