import { UserAgreements } from "@/drizzle/schema";
import { withValidPlatformAndUser } from "@/test/integration/contexts/users";
import {
  type TestDbType,
  testWithDb,
} from "@/test/integration/fixtures/db-fixtures";
import { useCaller } from "@/test/integration/helpers/test-caller";
import { buildTestSession } from "@/test/integration/helpers/test-session";
import { TRPCError } from "@trpc/server";
import { describe } from "vitest";

describe.concurrent("user API", () => {
  describe("without session", () => {
    const session = null;

    testWithDb("list ports returns UNAUTHORIZED", async ({ expect, db }) => {
      const { caller } = useCaller({ db, session });
      await expect(caller.user.pendingAgreements()).rejects.toThrow(
        new TRPCError({ code: "UNAUTHORIZED" }),
      );
    });
  });

  describe("with valid session", () => {
    const useSession = async (db: TestDbType) => {
      const { user, platform } = await withValidPlatformAndUser(db);
      return { session: buildTestSession({ platform, user }), user, platform };
    };

    describe("pendingAgreements query", () => {
      testWithDb(
        "returns all agreements given there is no accepted agreements",
        async ({ expect, db }) => {
          const { session } = await useSession(db);
          const { caller } = useCaller({ db, session });
          const list = await caller.user.pendingAgreements();
          expect(list).toEqual([
            {
              service: "bluex_ebl",
              name: "tos",
              version: 20240721,
              url: "/tos",
            },
            {
              service: "bluex_ebl",
              name: "privacy",
              version: 20240722,
              url: "/privacy",
            },
          ]);
        },
      );

      testWithDb(
        "it returns no agreements given these are all accepted",
        async ({ expect, db }) => {
          const { session, user } = await useSession(db);
          const { caller } = useCaller({ db, session });
          await db.insert(UserAgreements).values([
            {
              userId: user.id,
              service: "bluex_ebl",
              name: "tos",
              version: 20240721,
              requesterId: "test",
              acceptedAt: new Date(),
            },
            {
              userId: user.id,
              service: "bluex_ebl",
              name: "privacy",
              version: 20240722,
              requesterId: "test",
              acceptedAt: new Date(),
            },
          ]);

          const list = await caller.user.pendingAgreements();
          expect(list).toEqual([]);
        },
      );

      testWithDb(
        "it returns partial agreements given some are accepted",
        async ({ expect, db }) => {
          const { session, user } = await useSession(db);
          const { caller } = useCaller({ db, session });
          await db.insert(UserAgreements).values([
            {
              userId: user.id,
              service: "bluex_ebl",
              name: "tos",
              version: 20240721,
              requesterId: "test",
              acceptedAt: new Date(),
            },
          ]);

          const list = await caller.user.pendingAgreements();
          expect(list).toEqual([
            {
              service: "bluex_ebl",
              name: "privacy",
              version: 20240722,
              url: "/privacy",
            },
          ]);
        },
      );

      testWithDb(
        "it returns partial agreements given some accepted are outdated",
        async ({ expect, db }) => {
          const { session, user } = await useSession(db);
          const { caller } = useCaller({ db, session });
          await db.insert(UserAgreements).values([
            {
              userId: user.id,
              service: "bluex_ebl",
              name: "tos",
              version: 20240721,
              requesterId: "test",
              acceptedAt: new Date(),
            },
            {
              userId: user.id,
              service: "bluex_ebl",
              name: "privacy",
              version: 20240622,
              requesterId: "test",
              acceptedAt: new Date(),
            },
          ]);

          const list = await caller.user.pendingAgreements();
          expect(list).toEqual([
            {
              service: "bluex_ebl",
              name: "privacy",
              version: 20240722,
              url: "/privacy",
            },
          ]);
        },
      );
    });
  });
});
