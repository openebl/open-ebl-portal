import { describe } from "vitest";

import { Platforms, Users } from "@/drizzle/schema";
import {
  type TestDbType,
  testWithDb,
} from "@/test/integration/fixtures/db-fixtures";
import { transferredEBlRecord } from "@/test/integration/fixtures/test-transferred-ebl";
import { useTestEmailService } from "@/test/integration/helpers/test-email";
import {
  countEBlNotifications,
  createPlatform,
  createTransferEBlStash,
} from "@/test/integration/helpers/test-helper";
import { transferEmailNotifier } from "./transfer-email-notifier";

describe.concurrent("Email notification", () => {
  describe("Send transferred notification", () => {
    const eBlId = "d571ec58-2a50-4708-9eeb-43e276f08065";
    const currentDid = "did:openebl:d2856f4e-e636-4cf0-9110-fbb45304e614";
    const anotherDid = "did:openebl:0158341d-5c6b-4121-bfe4-535c7606bbd5";

    const createPlatformAndUsers = async (db: TestDbType, did: string) => {
      const [platform] = await db
        .insert(Platforms)
        .values({
          name: "Test Company",
          platformId: did,
        })
        .returning();

      const users = await db
        .insert(Users)
        .values([
          {
            email: "a@example.com",
            name: "User A",
            activePlatformId: platform!.id,
          },
          {
            email: "b@example.com",
            name: "User B",
            activePlatformId: platform!.id,
          },
        ])
        .returning();
      return { platform: platform!, users: users };
    };

    testWithDb(
      "when eBL's current owner is the given platform, it should send transferred email to the platform users",
      async ({ expect, db }) => {
        const { emailService, watcher } = useTestEmailService();
        const { platform } = await createPlatformAndUsers(db, currentDid);
        const newStash = await createTransferEBlStash({
          db,
          platformId: platform.id,
          did: currentDid,
          eBlId: eBlId,
          status: "TRANSFER",
        });
        await transferEmailNotifier({
          db,
          service: emailService,
          platform,
          rec: transferredEBlRecord,
          newStash,
        });

        expect(watcher).toHaveLength(1);
        expect(watcher[0]?.subject).toEqual("BL-001 has been issued to you");
        expect(watcher[0]?.to).toEqual([
          {
            name: "User A",
            address: "a@example.com",
          },
          {
            name: "User B",
            address: "b@example.com",
          },
        ]);
        expect(watcher[0]?.html).toContain(
          "Issuer Agent A, LTD has transferred eBL <strong>BL-001</strong> to your company.",
        );
        expect(watcher[0]?.html).toContain(
          `<strong>transferred by XXX</strong>`,
        );

        expect(watcher[0]?.attachments).toEqual([
          {
            cid: "bxlogo",
            contentType: "image/png",
            path: "./public/bxwlogo.png",
          },
          {
            cid: "header",
            contentType: "image/png",
            path: "./public/email-transferred.png",
          },
        ]);
        expect(
          await countEBlNotifications(db, "transferred", newStash.id),
        ).toEqual(1);
      },
    );

    testWithDb(
      "when platform has no users, it should touch EBlNotification and skip sending email",
      async ({ expect, db }) => {
        const { emailService, watcher } = useTestEmailService();
        const platform = await createPlatform(db, currentDid);
        const newStash = await createTransferEBlStash({
          db,
          platformId: platform.id,
          did: currentDid,
          eBlId: eBlId,
          status: "TRANSFER",
        });

        await transferEmailNotifier({
          db,
          service: emailService,
          platform,
          rec: transferredEBlRecord,
          newStash,
        });

        expect(watcher).toHaveLength(0);
        expect(
          await countEBlNotifications(db, "transferred", newStash.id),
        ).toEqual(1);
      },
    );

    testWithDb(
      "when eBL's current owner is NOT the given platform, it should skip sending email",
      async ({ expect, db }) => {
        const { emailService, watcher } = useTestEmailService();
        const { platform } = await createPlatformAndUsers(db, anotherDid);
        const newStash = await createTransferEBlStash({
          db,
          platformId: platform.id,
          did: currentDid,
          eBlId: eBlId,
          status: "TRANSFER",
        });
        await transferEmailNotifier({
          db,
          service: emailService,
          platform,
          rec: transferredEBlRecord,
          newStash,
        });

        expect(watcher).toHaveLength(0);
      },
    );
  });
});
