import { env } from "@/env";
import { db } from "@/server/db";
import { BusinessUnitSchema, type BusinessUnitType } from "@/types/business_unit";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { type Platform, type PrismaClient } from "@prisma/client";
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";
import EmailProvider from "next-auth/providers/email";
// import GoogleProvider from "next-auth/providers/google";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: bigint;
      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"];
    platform: Platform;
    authentication_id: string;
  }

  interface User {
    activePlatformId: number;
    // ...other properties
    // role: UserRole;
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  callbacks: {
    session: async ({ session, user }) => {
      const platform = await db.platform.findUnique({
        where: {
          id: user.activePlatformId
        }
      });

      if (!platform) {
        throw new Error("Platform not found");
      }

      const res = await fetch(`${env.BU_SERVER_URL}/business_unit/${platform.platformId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${env.BU_SERVER_API_KEY}`,
        },
        cache: 'no-store'
      })

      const data = await res.json() as BusinessUnitType
      const result = BusinessUnitSchema.parse(data)

      // find first authentications which status is active
      const activeAuthentication = result.authentications.find(auth => auth.status === 'active');

      if (!activeAuthentication) {
        throw new Error('No active authentication found');
      }

      return {
        ...session,
        user: {
          ...session.user,
          id: user.id,
        },
        platform,
        authentication_id: activeAuthentication.id,
      };
    },
  },
  adapter: PrismaAdapter(db as PrismaClient),
  providers: [
    EmailProvider({
      server: env.EMAIL_SERVER,
      from: env.EMAIL_FROM,
    }),
    // GoogleProvider({
    //   clientId: env.GOOGLE_CLIENT_ID,
    //   clientSecret: env.GOOGLE_CLIENT_SECRET,
    // }),
  ],
  theme: {
    colorScheme: "light",
    logo: "/bxblogo.svg", // Absolute URL to image
    // buttonText: "" // Hex color code
  }
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = () => getServerSession(authOptions);

