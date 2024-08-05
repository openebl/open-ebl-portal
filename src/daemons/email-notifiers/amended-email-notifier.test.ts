import { describe } from "vitest";

import {
  testWithDb,
  type TestDbType,
} from "@/test/integration/fixtures/db-fixtures";
import { amendedEBlRecord } from "@/test/integration/fixtures/test-amended-ebl";
import { useTestEmailService } from "@/test/integration/helpers/test-email";
import { amendedEmailNotifier } from "./amended-email-notifier";
import { countEBlNotifications, createPlatform, createPlatformAndUsers, createTransferEBlStash } from "@/test/integration/helpers/test-helper";

describe.concurrent("Email notification", () => {
  describe("Send amended notification", () => {
    const eBlId = "d571ec58-2a50-4708-9eeb-43e276f08065";
    const currentDid = "did:openebl:d2856f4e-e636-4cf0-9110-fbb45304e614";
    const anotherDid = "did:openebl:0158341d-5c6b-4121-bfe4-535c7606bbd5";

    testWithDb(
      "when eBL's current owner is the given platform, it should send amended email to the platform users",
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
        await amendedEmailNotifier({
          db,
          service: emailService,
          platform,
          rec: amendedEBlRecord,
          newStash,
        });

        expect(watcher).toHaveLength(1);
        expect(watcher[0]?.subject).toEqual(
          "BL-001-1 has been amended",
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
          "Issuer Agent A, LTD has amended and issued eBL <strong>BL-001-1</strong> to you.",
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

        expect(await countEBlNotifications(db, "amended", newStash.id)).toEqual(1);
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
        await amendedEmailNotifier({
          db,
          service: emailService,
          platform,
          rec: amendedEBlRecord,
          newStash,
        });

        expect(watcher).toHaveLength(0);
        expect(await countEBlNotifications(db, "amended", newStash.id)).toEqual(1);
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
        await amendedEmailNotifier({
          db,
          service: emailService,
          platform,
          rec: amendedEBlRecord,
          newStash,
        });

        expect(watcher).toHaveLength(0);
      },
    );
  });
});
