import { testWithDb } from "@/test/integration/fixtures/db-fixtures";
import { useCaller } from "@/test/integration/helpers/test-caller";
import { TRPCError } from "@trpc/server";
import { type Session } from "next-auth";
import { describe } from "vitest";

describe.concurrent("ports API", () => {
  describe("without session", () => {
    const session = null;

    testWithDb("list ports returns UNAUTHORIZED", async ({ expect, db }) => {
      const { caller } = useCaller({ db, session });
      await expect(caller.port.list({ keyword: "key" })).rejects.toThrow(
        new TRPCError({ code: "UNAUTHORIZED" }),
      );
    });

    testWithDb("get ports returns UNAUTHORIZED", async ({ expect, db }) => {
      const { caller } = useCaller({ db, session });
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
      platform: {
        id: 168n,
        name: "",
      },
      businessUnitId: "",
      authenticationId: "",
      expires: "1",
      platformRoles: [],
      permissions: [],
    };

    describe("list ports query", () => {
      testWithDb(
        "lists all ports returns ports filter by keyword",
        async ({ expect, db }) => {
          const { caller } = useCaller({ db, session });
          const list = await caller.port.list({ keyword: "cnytn" });
          expect(list).toMatchObject([
            {
              label: "Yantian, CN, CNYTN",
              value: "CNYTN",
            },
          ]);
        },
      );
    });

    describe("get port by value", () => {
      testWithDb("lists all portss returns nothing", async ({ expect, db }) => {
        const { caller } = useCaller({ db, session });
        const list = await caller.port.get({ id: "USNYC" });
        expect(list).toMatchObject({
          label: "New York, NY, US, USNYC",
          value: "USNYC",
        });
      });
    });
  });
});
