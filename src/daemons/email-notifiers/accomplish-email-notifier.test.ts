import { describe } from "vitest";

import { testWithDb } from "@/test/integration/fixtures/db-fixtures";
import { accomplishedEBlRecord } from "@/test/integration/fixtures/test-accomplished-ebl";
import { useTestEmailService } from "@/test/integration/helpers/test-email";
import {
  countEBlNotifications,
  createPlatform,
  createPlatformAndUsers,
  createTransferEBlStash,
} from "@/test/integration/helpers/test-helper";
import { accomplishEmailNotifier } from "./accomplish-email-notifier";

describe.concurrent("Email notification", () => {
  describe("Send accomplished notification", () => {
    const eBlId = "d571ec58-2a50-4708-9eeb-43e276f08065";
    const currentDid = "did:openebl:d2856f4e-e636-4cf0-9110-fbb45304e614";

    testWithDb(
      "when given platform participates the eBL, it should send accomplished notification to the platform users",
      async ({ expect, db }) => {
        const { emailService, watcher } = useTestEmailService();
        const { platform } = await createPlatformAndUsers(db, currentDid);
        const newStash = await createTransferEBlStash({
          db,
          platformId: platform.id,
          did: currentDid,
          eBlId: eBlId,
          status: "ACCOMPLISH",
        });
        await accomplishEmailNotifier({
          db,
          service: emailService,
          platform,
          rec: accomplishedEBlRecord,
          newStash,
        });

        expect(watcher).toHaveLength(1);
        expect(watcher[0]?.subject).toEqual("BL-001 has been accomplished");
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
          "A Factory Co., Ltd has accomplished eBL No. <strong>BL-001</strong>",
        );
        expect(watcher[0]?.html).toContain(
          `<strong>accomplished by XXX</strong>`,
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
            path: "./public/email-accomplished.png",
          },
        ]);

        expect(
          await countEBlNotifications(db, "accomplished", newStash.id),
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
          status: "ACCOMPLISH",
        });
        await accomplishEmailNotifier({
          db,
          service: emailService,
          platform,
          rec: accomplishedEBlRecord,
          newStash,
        });

        expect(watcher).toHaveLength(0);
        expect(
          await countEBlNotifications(db, "accomplished", newStash.id),
        ).toEqual(1);
      },
    );

    [
      "did:openebl:3993ace7-eb6c-4a1f-bed8-121643a278c9",
      "did:openebl:0158341d-5c6b-4121-bfe4-535c7606bbd5",
      "did:openebl:66c71465-3d0b-43d8-9e1b-c88c7a7634ca",
    ].forEach((did) => {
      testWithDb(
        "when eBL's issuer, shipper, consignee, or releaser is the given platform, it should sending email",
        async ({ expect, db }) => {
          const { emailService, watcher } = useTestEmailService();
          const { platform } = await createPlatformAndUsers(db, did);
          const newStash = await createTransferEBlStash({
            db,
            platformId: platform.id,
            did: currentDid,
            eBlId: eBlId,
            status: "ACCOMPLISH",
          });

          await accomplishEmailNotifier({
            db,
            service: emailService,
            platform,
            rec: accomplishedEBlRecord,
            newStash,
          });

          expect(watcher).toHaveLength(1);
          expect(
            await countEBlNotifications(db, "accomplished", newStash.id),
          ).toEqual(1);
          expect(watcher[0]?.subject).toEqual("BL-001 has been accomplished");
          expect(watcher[0]?.html).toContain("Hi Test Company,");
        },
      );
    });

    testWithDb(
      "when given platform is not the participants of the eBL, it should skip sending email",
      async ({ expect, db }) => {
        const anotherDid = "did:openebl:66c71465-3d0b-43d8-9e1b-xxxxxxxx";
        const { emailService, watcher } = useTestEmailService();
        const { platform } = await createPlatformAndUsers(db, anotherDid);
        const newStash = await createTransferEBlStash({
          db,
          platformId: platform.id,
          did: currentDid,
          eBlId: eBlId,
          status: "ACCOMPLISH",
        });
        await accomplishEmailNotifier({
          db,
          service: emailService,
          platform,
          rec: accomplishedEBlRecord,
          newStash,
        });

        expect(watcher).toHaveLength(0);
        expect(
          await countEBlNotifications(db, "accomplished", newStash.id),
        ).toEqual(0);
      },
    );
  });
});
