import { describe } from "vitest";

import {
  type TestDbType,
  testWithDb,
} from "@/test/integration/fixtures/db-fixtures";
import { amendRequestedEBlRecord } from "@/test/integration/fixtures/test-amend-requested-ebl";
import { useTestEmailService } from "@/test/integration/helpers/test-email";
import { amendRequestEmailNotifier } from "./amend-request-email-notifier";

describe.concurrent("Email notification", () => {
  describe("Send amendRequested notification", () => {
    const eBlId = "d571ec58-2a50-4708-9eeb-43e276f08065";
    const currentDid = "did:openebl:3993ace7-eb6c-4a1f-bed8-121643a278c9";
    const anotherDid = "did:openebl:0158341d-5c6b-4121-bfe4-535c7606bbd5";

    const createPlatformAndUsers = async (db: TestDbType, did: string) => {
      const platform = await db.platform.create({
        data: { name: "Test Company", platformId: did },
      });
      const users = await db.user.createMany({
        data: [
          {
            email: "a@example.com",
            name: "User A",
            activePlatformId: platform.id,
          },
          {
            email: "b@example.com",
            name: "User B",
            activePlatformId: platform.id,
          },
        ],
      });
      return { platform, users };
    };

    const createEBlStash = async (
      db: TestDbType,
      platformId: bigint,
      did: string,
    ) =>
      db.eBlStash.create({
        data: {
          eBlId: eBlId,
          platformId,
          status: "REQUEST_AMEND",
          version: 6,
          currentOwner: did,
        },
      });

    testWithDb(
      "when eBL's current owner is the given platform, it should send amendRequested email to the platform users",
      async ({ expect, db }) => {
        const { emailService, watcher } = useTestEmailService();
        const { platform } = await createPlatformAndUsers(db, currentDid);
        const newStash = await createEBlStash(
          db,
          platform.id,
          currentDid,
        );
        await amendRequestEmailNotifier({
          db,
          service: emailService,
          platform,
          rec: amendRequestedEBlRecord,
          newStash,
        });

        expect(watcher).toHaveLength(1);
        expect(watcher[0]?.subject).toEqual(
          "BL-001 Amendment request",
        );
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
          "A Factory Co., Ltd has requested an amendment for eBL <strong>BL-001</strong>.",
        );
        expect(watcher[0]?.html).toContain(
          `<strong>requested by XXX</strong>`,
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
            path: "./public/email-amend.png",
          },
        ]);

        expect(
          await db.eBlNotification.count({
            where: { name: "amend_requested", eBlStashId: newStash.id },
          }),
        ).toEqual(1);
      },
    );

    testWithDb(
      "when platform has no users, it should touch EBlNotification and skip sending email",
      async ({ expect, db }) => {
        const { emailService, watcher } = useTestEmailService();
        const platform = await db.platform.create({
          data: { name: "Test Company", platformId: currentDid },
        });
        const newStash = await createEBlStash(
          db,
          platform.id,
          currentDid,
        );
        await amendRequestEmailNotifier({
          db,
          service: emailService,
          platform,
          rec: amendRequestedEBlRecord,
          newStash,
        });

        expect(watcher).toHaveLength(0);
        expect(
          await db.eBlNotification.count({
            where: { name: "amend_requested", eBlStashId: newStash.id },
          }),
        ).toEqual(1);
      },
    );

    testWithDb(
      "when eBL's current owner is NOT the given platform, it should skip sending email",
      async ({ expect, db }) => {
        const { emailService, watcher } = useTestEmailService();
        const { platform } = await createPlatformAndUsers(db, anotherDid);
        const newStash = await createEBlStash(
          db,
          platform.id,
          currentDid,
        );
        await amendRequestEmailNotifier({
          db,
          service: emailService,
          platform,
          rec: amendRequestedEBlRecord,
          newStash,
        });

        expect(watcher).toHaveLength(0);
      },
    );
  });
});
