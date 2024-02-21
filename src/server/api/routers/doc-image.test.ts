import { withDocFile } from "@/test/integration/contexts/doc-files";
import { withDocImages } from "@/test/integration/contexts/doc-images";
import { withValidPlatformAndUser } from "@/test/integration/contexts/users";
import {
  testWithDb,
  type TestDbType,
} from "@/test/integration/fixtures/db-fixtures";
import { buildTestSession } from "@/test/integration/helpers/test-session";
import { useTestStorageService } from "@/test/integration/helpers/test-storage";
import { TRPCError } from "@trpc/server";
import { type Session } from "next-auth";
import { describe } from "vitest";
import { appRouter } from "../root";

const useCaller = ({
  db,
  session,
}: {
  db: TestDbType;
  session: Session | null;
}) => {
  const { storageService, watcher } = useTestStorageService();
  const caller = appRouter.createCaller({
    headers: new Headers(),
    session,
    db,
    storageService,
  });
  return { caller, session, db, storageService, storageWatch: watcher };
};

describe.concurrent("docImage API", () => {
  describe("without session", () => {
    const session = null;

    testWithDb("getUrl returns UNAUTHORIZED", async ({ expect, db }) => {
      const { caller } = useCaller({ db, session });
      await expect(
        caller.docImage.getUrl({ docFileId: 168n, page: 1 }),
      ).rejects.toThrow(new TRPCError({ code: "UNAUTHORIZED" }));
    });

    testWithDb("getUrls returns UNAUTHORIZED", async ({ expect, db }) => {
      const { caller } = useCaller({ db, session });
      await expect(
        caller.docImage.getUrls({ docFileId: 168n }),
      ).rejects.toThrow(new TRPCError({ code: "UNAUTHORIZED" }));
    });
  });

  describe("with valid session", async () => {
    const useSession = async (db: TestDbType) => {
      const { user, platform } = await withValidPlatformAndUser(db);
      return { session: buildTestSession({ platform, user }), user, platform };
    };

    describe("getUrl query", () => {
      testWithDb(
        "returns the image url by given docFileId and page",
        async ({ expect, db }) => {
          const { session, platform, user } = await useSession(db);
          const docFile = await withDocFile({ db, platform, user });
          await withDocImages({ db, docFile });
          const { caller } = useCaller({ db, session });
          const url = await caller.docImage.getUrl({
            docFileId: docFile.id,
            page: 1,
          });
          expect(url).toEqual("https://storage.com/mockimg-1");
        },
      );
    });

    describe("getUrls query", () => {
      testWithDb(
        "returns the images url for all pages by given docFileId",
        async ({ expect, db }) => {
          const { session, platform, user } = await useSession(db);
          const docFile = await withDocFile({ db, platform, user });
          await withDocImages({ db, docFile });
          const { caller } = useCaller({ db, session });
          const url = await caller.docImage.getUrls({ docFileId: docFile.id });
          expect(url).toEqual([
            {
              page: 1,
              imageUrl: "https://storage.com/mockimg-1",
              thumbnailUrl: "https://storage.com/mockthu-1",
            },
            {
              imageUrl: "https://storage.com/mockimg-2",
              page: 2,
              thumbnailUrl: "https://storage.com/mockthu-2",
            },
            {
              imageUrl: "https://storage.com/mockimg-3",
              page: 3,
              thumbnailUrl: "https://storage.com/mockthu-3",
            },
          ]);
        },
      );
    });
  });
});
