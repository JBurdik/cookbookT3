import NextAuth, { type NextAuthOptions } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

// Prisma adapter for NextAuth, optional and can be removed
import { PrismaAdapter } from "@next-auth/prisma-adapter";

import { env } from "../../../env/server.mjs";
import { prisma } from "../../../server/db";

interface DiscordUser {
  id: string;
  username: string;
  avatar: string;
}

export const authOptions: NextAuthOptions = {
  // Include user.id on session
  callbacks: {
    async signIn({ user, account }) {
      if (account && account.provider === "discord") {
        const userFetch = await fetch(`https://discord.com/api/users/@me `, {
          headers: {
            Authorization: `Bearer ${account.access_token as string}`,
          },
        });
        const dcUser = (await userFetch.json()) as DiscordUser;
        const dcUserAvatar = `https://cdn.discordapp.com/avatars/${dcUser.id}/${dcUser.avatar}.webp`;
        if (user.image !== dcUserAvatar) {
          await prisma.user.update({
            where: {
              id: user.id,
            },
            data: {
              image: dcUserAvatar,
            },
          });
        }
      }
      return true;
    },
    async session({ session, user }) {
      if (session.user) {
        const data = await prisma.user.findUnique({
          where: {
            id: user.id,
          },
          select: {
            role: true,
          },
        });
        session.user.id = user.id;
        session.user.role = data?.role;
      }
      return session;
    },
  },
  // Configure one or more authentication providers
  adapter: PrismaAdapter(prisma),
  providers: [
    DiscordProvider({
      clientId: env.DISCORD_CLIENT_ID,
      clientSecret: env.DISCORD_CLIENT_SECRET,
    }),
    GitHubProvider({
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
    }),
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
    /**
     * ...add more providers here
     *
     * Most other providers require a bit more work than the Discord provider.
     * For example, the GitHub provider requires you to add the
     * `refresh_token_expires_in` field to the Account model. Refer to the
     * NextAuth.js docs for the provider you want to use. Example:
     * @see https://next-auth.js.org/providers/github
     */
  ],
};

export default NextAuth(authOptions);
