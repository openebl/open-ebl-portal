import { readFileSync } from "fs";
import { type Session } from "next-auth";
import sharp from "sharp";
import { describe } from "vitest";

import { testWithDb } from "@/test/integration/fixtures/db-fixtures";
import { createNextRequest } from "@/test/integration/helpers/req";
import { useTestStorageService } from "@/test/integration/helpers/test-storage";
import { processFileDocUploadReq } from "./ebl";
import { useTestDocExtraction } from "@/test/integration/helpers/test-doc-extraction";
import { and, eq } from "drizzle-orm";
import { DocFiles, DocImages } from "@/drizzle/schema";

describe.concurrent("EBl Fx", () => {
  describe("processFileDocUploadReq", () => {
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
      platformRoles: [],
      permissions: [],
      authenticationId: "",
      expires: "1",
    };
    const pdfFile = readFileSync("./src/test/integration/fixtures/ebl.pdf");

    testWithDb(
      "upload a valid PDF file, it converts PDF to images and store to storage and database",
      async ({ expect, db }) => {
        const req = createNextRequest(pdfFile, {
          "X-Filename": "ebl.pdf",
          "Content-Type": "application/pdf",
        });
        const { storageService, watcher } = useTestStorageService();
        const { docExtraction } = useTestDocExtraction();
        const { uuid: docFileUuid } = await processFileDocUploadReq({
          req,
          session,
          db,
          storage: storageService,
          docExtraction,
        });

        expect(docFileUuid).toBeTypeOf("string");
        const hash = docFileUuid.split("-")[0];

        // validate if docFile is properly stored in database
        const fileDocOrNull = await db.query.DocFiles.findFirst({
          where: eq(DocFiles.uuid, hash!),
        });
        expect(fileDocOrNull).not.toBeNull();
        const fileDoc = fileDocOrNull!;
        expect(fileDoc.filename).toBe("ebl.pdf");
        expect(fileDoc.storagekey).toBeTruthy();
        expect(watcher[fileDoc.storagekey!]).not.toBeUndefined();

        // validate if the content of the file is properly stored in storage
        const fileDocStore = watcher[fileDoc.storagekey!]!;
        expect(Buffer.compare(fileDocStore.content, pdfFile)).toEqual(0);

        // validate if the images are properly stored in database
        const imagesMeta = [
          [1, false],
          [1, true],
          [2, false],
          [2, true],
        ] as Array<[number, boolean]>;
        for (const item of imagesMeta) {
          const [page, thumbnail] = item;
          const imageRec = await db.query.DocImages.findMany({
            where: and(
              eq(DocImages.docFileId, fileDoc.id),
              eq(DocImages.page, page),
              eq(DocImages.thumbnail, thumbnail),
            ),
          });
          expect(imageRec?.length).toBe(1);
          const image = sharp(watcher[imageRec[0]?.storagekey ?? ""]?.content);
          expect(async () => await image.metadata()).not.toThrow();
          const metadata = await image.metadata();
          expect(metadata.format).toBe("webp");
        }
      },
    );
  });
});
