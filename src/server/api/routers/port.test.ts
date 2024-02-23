import { describe } from "vitest";
import { testWithDb } from "@/test/integration/fixtures/db-fixtures";
import { appRouter } from "../root";
import { TRPCError } from "@trpc/server";
import { type Session } from "next-auth";
import { useTestStorageService } from "@/test/integration/helpers/test-storage";

describe.concurrent("ports API", () => {
  describe("without session", () => {
    const session = null;

    testWithDb("list ports returns UNAUTHORIZED", async ({ expect, db }) => {
      const {storageService} = useTestStorageService();
      const caller = appRouter.createCaller({
        headers: new Headers(),
        session,
        db,
        storageService,
      });
      await expect(caller.port.list({ keyword: "key" })).rejects.toThrow(
        new TRPCError({ code: "UNAUTHORIZED" }),
      );
    });

    testWithDb("get ports returns UNAUTHORIZED", async ({ expect, db }) => {
      const {storageService} = useTestStorageService();
      const caller = appRouter.createCaller({
        headers: new Headers(),
        session,
        db,
        storageService,
      });
      await expect(caller.port.get({ id: "test" })).rejects.toThrow(
        new TRPCError({ code: "UNAUTHORIZED" }),
      );
    });
  });

  describe("with valid session", () => {
    const session: Session = {
      user: {
        id: 123n,
        name: "John Doe",
        email: "jogn.doe@example.com",
      },
      platformId: 168n,
      expires: "1",
    };

    describe("list ports query", () => {
      testWithDb(
        "lists all ports returns ports filter by keyword",
        async ({ expect, db }) => {
          const {storageService} = useTestStorageService();
          const caller = appRouter.createCaller({
            headers: new Headers(),
            session,
            db,
            storageService,
          });
          const list = await caller.port.list({ keyword: "cnytn" });
          expect(list).toMatchObject([
            {
              id: "CNYTN",
              label: "Yantian, CN, CNYTN",
            },
          ]);
        },
      );
    });

    describe("get port by value", () => {
      testWithDb("lists all portss returns nothing", async ({ expect, db }) => {
        const {storageService} = useTestStorageService();
        const caller = appRouter.createCaller({
          headers: new Headers(),
          session,
          db,
          storageService,
        });
        const list = await caller.port.get({ id: "USNYC" });
        expect(list).toMatchObject({
          id: "USNYC",
          label: "New York, NY, US, USNYC",
        });
      });
    });
  });
});
