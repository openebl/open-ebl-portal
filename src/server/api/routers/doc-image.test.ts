import { describe } from "vitest";
import { testWithDb } from "@/test/integration/fixtures/db-fixtures";
import { appRouter } from "../root";
import { TRPCError } from "@trpc/server";
import { type Session } from "next-auth";
import { useTestStorageService } from "@/test/integration/helpers/test-storage";
import { buildTestSession } from "@/test/integration/helpers/test-session";
import { withValidPlatformAndUser } from "@/test/integration/contexts/users";
import { withDocImage } from "@/test/integration/contexts/doc-images";
import { withDocFile } from "@/test/integration/contexts/doc-files";

describe.concurrent("docImage API", () => {
  describe("without session", () => {
    const session = null;

    testWithDb("get docImage returns UNAUTHORIZED", async ({ expect, db }) => {
      const { storageService } = useTestStorageService();
      const caller = appRouter.createCaller({
        headers: new Headers(),
        session,
        db,
        storageService,
      });
      await expect(
        caller.docImage.getUrl({ docFileId: 168n, page: 1 }),
      ).rejects.toThrow(new TRPCError({ code: "UNAUTHORIZED" }));
    });
  });

  describe("with valid session", async () => {
    describe("get docImage", () => {
      testWithDb(
        "getUrl returns the image url by given docFileId and page",
        async ({ expect, db }) => {
          const { storageService } = useTestStorageService();
          const { user, platform } = await withValidPlatformAndUser(db);
          const testDocImage = await withDocImage({
            db,
            docFile: await withDocFile({ db, platform, user }),
          });
          const caller = appRouter.createCaller({
            headers: new Headers(),
            session: buildTestSession({ platform, user }),
            db,
            storageService,
          });
          const url = await caller.docImage.getUrl({
            docFileId: testDocImage.docFileId,
            page: 1,
          });
          expect(url).toEqual(`https://storage.com/${testDocImage.storagekey}`);
        },
      );
    });
  });
});
