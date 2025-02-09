import { describe } from "vitest";

import { testWithDb } from "@/test/integration/fixtures/db-fixtures";
import { returnedEBlRecord } from "@/test/integration/fixtures/test-returned-ebl";
import { useTestEmailService } from "@/test/integration/helpers/test-email";
import {
  countEBlNotifications,
  createPlatform,
  createPlatformAndUsers,
  createTransferEBlStash,
} from "@/test/integration/helpers/test-helper";
import { returnEmailNotifier } from "./return-email-notifier";

describe.concurrent("Email notification", () => {
  describe("Send returned notification", () => {
    const eBlId = "d571ec58-2a50-4708-9eeb-43e276f08065";
    const currentDid = "did:openebl:3993ace7-eb6c-4a1f-bed8-121643a278c9";
    const anotherDid = "did:openebl:0158341d-5c6b-4121-bfe4-535c7606bbd5";

    testWithDb(
      "when eBL's current owner is the given platform, it should send returned email to the platform users",
      async ({ expect, db }) => {
        const { emailService, watcher } = useTestEmailService();
        const { platform } = await createPlatformAndUsers(db, currentDid);
        const newStash = await createTransferEBlStash({
          db,
          platformId: platform.id,
          did: currentDid,
          eBlId: eBlId,
          status: "RETURN",
        });

        await returnEmailNotifier({
          db,
          service: emailService,
          platform,
          rec: returnedEBlRecord,
          newStash,
        });

        expect(watcher).toHaveLength(1);
        expect(watcher[0]?.subject).toEqual("BL-001 has been returned to you");
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
          "A Factory Co., Ltd has returned eBL <strong>BL-001</strong> to you.",
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
            path: "./public/email-returned.png",
          },
        ]);

        expect(
          await countEBlNotifications(db, "returned", newStash.id),
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
          status: "RETURN",
        });

        await returnEmailNotifier({
          db,
          service: emailService,
          platform,
          rec: returnedEBlRecord,
          newStash,
        });

        expect(watcher).toHaveLength(0);
        expect(
          await countEBlNotifications(db, "returned", newStash.id),
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
          status: "RETURN",
        });
        await returnEmailNotifier({
          db,
          service: emailService,
          platform,
          rec: returnedEBlRecord,
          newStash,
        });

        expect(watcher).toHaveLength(0);
      },
    );
  });
});
