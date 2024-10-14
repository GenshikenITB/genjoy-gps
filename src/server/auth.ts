import { PrismaAdapter } from "@auth/prisma-adapter";
import {
  type DefaultUser,
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";
import { type Adapter } from "next-auth/adapters";
import DiscordProvider from "next-auth/providers/discord";

import { env } from "@/env";
import { db } from "@/server/db";
import type { Role } from "@prisma/client";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      role: Role;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    role: Role;
  }
}

interface DiscordMemberData {
  message?: string;
  roles?: string[];
}


/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "database"
  },
  callbacks: {
    signIn: async ({ account }) => {
      const discordGuildId = "1279807678666772610";
      const requiredRoles = [
        "1279817638708772986",
        "1279817589878689856"
      ];
      const discordApiUrl = `https://discord.com/api/v10/guilds/${discordGuildId}/members/${account?.providerAccountId}`;
      const headers = {
        Authorization: `Bot ${env.DISCORD_BOT_TOKEN}`,
      };

      try {
        const response = await fetch(discordApiUrl, { headers });

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error('Unauthorized: Invalid token or permissions');
          } else if (response.status === 403) {
            throw new Error('Forbidden: Access denied to the guild');
          } else if (response.status === 404) {
            throw new Error('Not Found: You are not in the required server');
          } else {
            throw new Error(`Discord API request failed: ${response.status} ${response.statusText}`);
          }
        }

        const memberData = await response.json() as DiscordMemberData;

        // Check if the user has the required role
        const hasRequiredRole = requiredRoles.some((role) =>
          memberData.roles?.includes(role.trim()) ?? false
        );

        if (!hasRequiredRole) {
          throw new Error('Forbidden: User does not have the required roles');
        }

        return true;
      } catch (error) {
        console.error(error);
        if (error instanceof Error) {
          throw new Error(error.message);
        } else {
          throw new Error('Error while checking user roles: Unknown error');
        }
      }
    },
    session: ({ session, user }) => ({
      ...session,
      user: {
        ...session.user,
        id: user.id,
        role: user.role,
      },
    }),
  },
  adapter: PrismaAdapter(db) as Adapter,
  providers: [
    DiscordProvider({
      clientId: env.DISCORD_CLIENT_ID,
      clientSecret: env.DISCORD_CLIENT_SECRET,
      authorization: {
        params: {
          scope: 'identify email',
        },
      },
    }),
    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Discord provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
  ],
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = () => getServerSession(authOptions);
