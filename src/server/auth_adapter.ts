import { Accounts, Sessions, Users, VerificationTokens } from "@/drizzle/schema";
import { db } from "@/server/db";
import { randomBytes } from "crypto";
import { and, eq } from "drizzle-orm";
import {
  AdapterAccount,
  AdapterSession,
  AdapterUser,
  VerificationToken as AdapterVerificationToken,
} from "next-auth/adapters";

export const DrizzleAuthAdapter = {
  async createUser(data: Omit<AdapterUser, "id">) {
    const users = await db.insert(Users).values(data).returning().execute();
    const user = users[0]!;
    return { ...user, id: user.id.toString() } as AdapterUser;
  },

  async getUser(id: string): Promise<AdapterUser | null> {
    const users = await db
      .select()
      .from(Users)
      .where(eq(Users.id, BigInt(id)))
      .execute();
    const user = users[0];
    return user ? { ...user, id: user.id.toString(), email: user.email ?? '' } : null;
  },

  async getUserByEmail(email: string): Promise<AdapterUser | null> {
    const users = await db
      .select()
      .from(Users)
      .where(eq(Users.email, email))
      .execute();

    const user = users[0];
    return user ? { ...user, id: user.id.toString(), email: user.email ?? '' } : null;
  },

  async createSession(data: {
    sessionToken: string;
    userId: string;
    expires: Date;
  }): Promise<AdapterSession> {
    const id = randomBytes(32).toString("hex");
    const userId = BigInt(data.userId);
    return db
      .insert(Sessions)
      .values({ ...data, id, userId })
      .returning()
      .then((sessions) => {
        const session = sessions[0]!
        return { ...session, userId: session.userId.toString() ?? '' }
      });
  },

  async getSessionAndUser(sessionToken: string) {
    return db
      .select({
        session: Sessions,
        user: Users,
      })
      .from(Sessions)
      .where(eq(Sessions.sessionToken, sessionToken))
      .innerJoin(Users, eq(Users.id, Sessions.userId))
      .then((res) => (res.length > 0 ? res[0] : null)) as Promise<{
      session: AdapterSession;
      user: AdapterUser;
    } | null>;
  },

  async updateUser(data: Partial<AdapterUser> & Pick<AdapterUser, "id">) {
    if (!data.id) {
      throw new Error("No user id.");
    }

    const { id, ...toUpdate } = data;
    const [result] = await db
      .update(Users)
      .set(toUpdate)
      .where(eq(Users.id, BigInt(data.id)))
      .returning();

    if (!result) {
      throw new Error("No user found.");
    }

    return { ...result, id } as AdapterUser;
  },

  async updateSession(
    data: Partial<AdapterSession> & Pick<AdapterSession, "sessionToken">,
  ) {
    return db
      .update(Sessions)
      .set({ ...data, userId: data.userId ? BigInt(data.userId) : undefined })
      .where(eq(Sessions.sessionToken, data.sessionToken))
      .returning()
      .then((sessions) => {
        const session = sessions[0]!
        return { ...session, userId: session.userId.toString() ?? '' }
      });
  },

  async linkAccount(data: AdapterAccount) {
    await db.insert(Accounts).values({ ...data, userId: BigInt(data.userId) });
  },

  async getUserByAccount(
    account: Pick<AdapterAccount, "provider" | "providerAccountId">,
  ) {
    const result = await db
      .select({
        account: Accounts,
        user: Users,
      })
      .from(Accounts)
      .innerJoin(Users, eq(Accounts.userId, Users.id))
      .where(
        and(
          eq(Accounts.provider, account.provider),
          eq(Accounts.providerAccountId, account.providerAccountId),
        ),
      )
      .then((res) => res[0]);

    const user = result?.user ?? null;
    return user as AdapterUser | null;
  },
  async deleteSession(sessionToken: string) {
    await db.delete(Sessions).where(eq(Sessions.sessionToken, sessionToken));
  },
  async createVerificationToken(data: AdapterVerificationToken) {
    return db
      .insert(VerificationTokens)
      .values(data)
      .returning()
      .then((res) => res[0]);
  },
  async useVerificationToken(params: { identifier: string; token: string }): Promise<AdapterVerificationToken | null> {
    return db
      .delete(VerificationTokens)
      .where(
        and(
          eq(VerificationTokens.identifier, params.identifier),
          eq(VerificationTokens.token, params.token),
        ),
      )
      .returning()
      .then((res) => (res.length > 0 ? res[0]! : null));
  },
  async deleteUser(id: string) {
    await db.delete(Users).where(eq(Users.id, BigInt(id)));
  },
  async unlinkAccount(
    params: Pick<AdapterAccount, "provider" | "providerAccountId">,
  ) {
    await db
      .delete(Accounts)
      .where(
        and(
          eq(Accounts.provider, params.provider),
          eq(Accounts.providerAccountId, params.providerAccountId),
        ),
      );
  },
  async getAccount(providerAccountId: string, provider: string) {
    return db
      .select()
      .from(Accounts)
      .where(
        and(
          eq(Accounts.provider, provider),
          eq(Accounts.providerAccountId, providerAccountId),
        ),
      )
      .then((res) => res[0] ?? null) as Promise<AdapterAccount | null>;
  },

  async createAuthenticator(data: unknown) {
    throw new Error("Method not implemented.");
  },

  async getAuthenticator(credentialID: string) {
    throw new Error("Method not implemented.");
  },

  async listAuthenticatorsByUserId(userId: string) {
    throw new Error("Method not implemented.");
  },

  async updateAuthenticatorCounter(credentialID: string, newCounter: number) {
    throw new Error("Method not implemented.");
  },
};
