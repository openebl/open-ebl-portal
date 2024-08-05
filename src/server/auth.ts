import { Platforms, UserRoles } from "@/drizzle/schema";
import { sendUserSignin } from "@/emails/send-user-signin";
import { env } from "@/env";
import { getLogger } from "@/lib/logger";
import { sleep } from "@/lib/utils";
import { db } from "@/server/db";
import { UserRoleSchema, type UserRoleType } from "@/types/user";
import { eq } from "drizzle-orm";
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
  type Session,
} from "next-auth";
import EmailProvider from "next-auth/providers/email";
import { DrizzleAuthAdapter } from "./auth_adapter";
import { authenticationId } from "./fx/auth-id";
import { permissions, type PermissionType } from "./permissions";
import { SmtpEmailService } from "./services/email-service";

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
    platform: {
      id: bigint;
      name: string;
      admin: boolean
      businessInfo?: Record<string, unknown> | null;
    };
    businessUnitId: string;
    platformRoles: {
      platform: { id: bigint; name: string };
      role: UserRoleType;
    }[];
    authenticationId: string;
    permissions: PermissionType[];
  }

  interface User {
    activePlatformId: bigint;
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
      const userPlatformRoles = await db
        .select({
          userRole: UserRoles,
          platform: Platforms,
        })
        .from(UserRoles)
        .innerJoin(Platforms, eq(Platforms.id, UserRoles.platformId))
        .where(eq(UserRoles.userId, BigInt(user.id)))
        .execute();

      const activePlatformId = BigInt(user.activePlatformId);
      const platform = userPlatformRoles.find(
        (n) => n.platform.id === activePlatformId,
      )?.platform;
      if (!platform) {
        throw new Error("Platform not found");
      }

      const platformRoles = userPlatformRoles.map((n) => ({
        platform: n.platform,
        role: n.userRole.role,
      }));
      const roles = platformRoles
        .filter((n) => n.platform.id === activePlatformId)
        .map((n) => UserRoleSchema.parse(n.role));

      return {
        ...session,
        user: {
          ...session.user,
          id: BigInt(user.id),
        },
        platform: platformRoles.find((n) => n.platform.id === activePlatformId)
          ?.platform,
        businessUnitId: platform.platformId,
        platformRoles,
        authenticationId: await authenticationId(platform),
        permissions: permissions({ roles, platform }),
      } as Session;
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
  adapter: DrizzleAuthAdapter,
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
