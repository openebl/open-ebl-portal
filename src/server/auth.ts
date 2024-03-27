import { sendUserSignin } from "@/emails/send-user-signin";
import { env } from "@/env";
import { getLogger } from "@/lib/logger";
import { sleep } from "@/lib/utils";
import { db } from "@/server/db";
import { type paths } from "@/types/bu-scheme";
import { UserRoleSchema, type UserRoleType } from "@/types/user";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { type Platform, type PrismaClient } from "@prisma/client";
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";
import EmailProvider from "next-auth/providers/email";
import createClient from "openapi-fetch";
import { permissions, type PermissionType } from "./permissions";
import { SmtpEmailService } from "./services/email-service";
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
    platformRoles: { platform: Platform; role: UserRoleType }[];
    authenticationId: string;
    permissions: PermissionType[];
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
      const [platform, userRoles] = await Promise.all([
        db.platform.findUnique({
          where: {
            id: user.activePlatformId,
          },
        }),
        db.userRole.findMany({
          where: {
            userId: BigInt(user.id),
          },
          include: {
            platform: true,
          },
        }),
      ]);

      if (!platform) {
        throw new Error("Platform not found");
      }

      const platformRoles = userRoles.map((n) => ({
        platform: n.platform,
        role: n.role,
      }));
      const activePlatformId = BigInt(user.activePlatformId);
      const roles = platformRoles
        .filter((n) => n.platform.id === activePlatformId)
        .map((n) => UserRoleSchema.parse(n.role));

      // TODO: it should not fetch active authentication every time
      const authenticationId =
        platform.platformId && platform.platformId.length > 0
          ? await (async () => {
              const client = createClient<paths>({
                baseUrl: env.BU_SERVER_URL,
              });
              getLogger().info(`Fetching active authentication for platform ${platform.id}`);

              const { data, error } = await client.GET("/business_unit/{id}", {
                headers: {
                  accept: "application/json",
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${env.BU_SERVER_API_KEY}`,
                },
                params: { path: { id: platform.platformId! } },
              });
              if (error) throw error;
              if (!data) throw new Error("No data found");

              // find first authentications which status is active
              const activeAuthentication = data.authentications?.find(
                (auth) => auth.status === "active",
              );
              getLogger().info(`Got active authentication for platform ${platform.id}`);

              if (!activeAuthentication) {
                throw new Error("No active authentication found");
              }
              return activeAuthentication.id;
            })().catch((err) => {
              getLogger().error("cannot fetch active authentication: ", err);
              return null;
            })
          : "";

      return {
        ...session,
        user: {
          ...session.user,
          id: user.id,
        },
        platform,
        platformRoles,
        authenticationId,
        permissions: permissions({ roles, platform }),
      };
    },
    async signIn({ user }) {
      if (user.name && user.activePlatformId) {
        return true;
      } else {
        // not a valid user
        // sleep 2 seconds and redirect to verify-request page
        // so others cannot brute force the email
        await sleep(2000);
        return "/auth/verify-request";
      }
    },
  },
  adapter: PrismaAdapter(db as PrismaClient),
  providers: [
    EmailProvider({
      server: env.EMAIL_SERVER,
      from: env.EMAIL_FROM,
      maxAge: env.SIGNIN_EMAIL_MAXAGE_IN_SEC,
      async sendVerificationRequest(params) {
        const { identifier, url } = params;
        sendUserSignin({
          service: SmtpEmailService,
          receiver: identifier,
          url,
        }).catch((err) =>
          getLogger().error(`Failed to send signin email: ${err}`),
        );
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
    // error: "/auth/error",
    verifyRequest: "/auth/verify-request",
  },
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = () => getServerSession(authOptions);
