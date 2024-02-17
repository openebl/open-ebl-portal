import {
  DatabaseService,
  liveDatabaseService,
} from "@/server/services/database-service";
import { StorageService } from "@/server/services/storage-service";
import { testWithDb } from "@/test/integration/fixtures/db-fixtures";
import { createNextRequest } from "@/test/integration/helpers/req";
import { useTestStorageService } from "@/test/integration/helpers/test-storage";
import { Effect, pipe } from "effect";
import { readFileSync } from "fs";
import { type Session } from "next-auth";
import { describe } from "vitest";
import { processFileDocUploadReq } from "./ebl";

describe.concurrent("EBl Fx", () => {
  describe("processFileDocUploadReq", () => {
    const session: Session = {
      user: {
        id: 123,
        name: "John Doe",
        email: "jogn.doe@example.com",
      },
      platformId: 168,
      expires: "1",
    };
    const pdfFile = readFileSync('./src/test/integration/fixtures/ebl.pdf');

    testWithDb(
      "upload a valid PDF file, it converts PDF to images and store to storage and database",
      async ({ expect, db }) => {
        const req = createNextRequest(pdfFile, {'X-Filename': 'ebl.pdf'});
        const { storageService, watcher } = useTestStorageService();
        const runnable = pipe(
          processFileDocUploadReq(req, session),

          // Effect.map((result) => new NextResponse(result)),
          Effect.catchAll((error) => {
            console.error("!!!", error);
            return Effect.succeed(error);
          }),

          Effect.provideService(DatabaseService, liveDatabaseService(db)),
          Effect.provideService(StorageService, storageService),
        );

        const fileDocId = await Effect.runPromise(runnable);
        expect(fileDocId).toBeTypeOf('bigint');

        const fileDocOrNull = await db.docFile.findUnique({where:{id: fileDocId as bigint}});
        expect(fileDocOrNull).not.toBeNull();
        const fileDoc = fileDocOrNull!;
        expect(fileDoc.filename).toBe('ebl.pdf');
        expect(fileDoc.storagekey).not.toBeNull();
        expect(fileDoc.storagekey).not.toBeUndefined();
        expect(watcher[fileDoc.storagekey!]).not.toBeUndefined();

        const fileDocStore = watcher[fileDoc.storagekey!]!;
        expect(fileDocStore.content.byteLength).toEqual(pdfFile.byteLength)
        expect(Buffer.compare(fileDocStore.content, pdfFile)).toEqual(0)
      },
    );
  });
});
