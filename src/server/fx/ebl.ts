import crypto from "crypto";
import { writeFile } from "fs/promises";
import { type Session } from "next-auth";
import { type NextRequest } from "next/server";
import path from "path";

import { type DocExtractionType } from "@/add-ons/doc-reader/types";
import { getLogger } from "@/lib/logger";
import { pdf2Image } from "@/lib/pdf2image";
import { tempFolder } from "@/lib/server-utils";
import { randomId } from "@/lib/utils";
import { type StorageServiceType } from "@/server/services/storage-service";
import { type DatabaseType } from "../db";
import { readRequestBodyToBuffer } from "./streram";
import type { EBlFileProcessResultType } from "@/types/ebl";
import { DocFiles, DocImages } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

type KeyPairType = { imageKey: string; thumbnailKey: string; page: number };

const saveContentToTempFile = async (content: Buffer) => {
  const folder = await tempFolder();
  const tmpFilename = path.join(folder, "content");
  await writeFile(tmpFilename, content);
  return tmpFilename;
};

const saveImagesToStorage = async (content: Buffer, storage: StorageServiceType) => {
  const filename = await saveContentToTempFile(content);
  const imageKeys: KeyPairType[] = [];
  await pdf2Image({
    filename,
    async onPage(image, thumbnail, page) {
      const imageKey = `/ebl-image/${crypto.randomUUID()}`;
      const thumbnailKey = `/ebl-thumbnail/${crypto.randomUUID()}`;
      await Promise.all([
        storage.putObject({
          content: image,
          key: imageKey,
          contentType: "image/webp",
        }),
        storage.putObject({
          content: thumbnail,
          key: thumbnailKey,
          contentType: "image/webp",
        }),
      ]);
      imageKeys.push({ imageKey, thumbnailKey, page });
    },
  });
  return imageKeys;
};

export const processFileDocUploadReq = async ({
  req,
  session,
  db,
  storage,
  docExtraction,
}: {
  req: NextRequest;
  session: Session | null;
  db: DatabaseType;
  storage: StorageServiceType;
  docExtraction: DocExtractionType;
}): Promise<EBlFileProcessResultType> => {
  const storagekey = `/ebl/${crypto.randomUUID()}`;
  const filename = req.headers.get("X-Filename") ?? "(unknown)";
  const contentType = req.headers.get("Content-Type") ?? "application/octet-stream";

  try {
    // read content from request body
    const content = await readRequestBodyToBuffer(req.body);
    const hash = crypto.createHash("md5").update(content).digest("hex");
    const uuid = `${hash}-${randomId(8)}`;

    const findOrCreateDocFile = async () => {
      // find docFile with the hash
      const existingDocFile = await db.query.DocFiles.findFirst({
        where: eq(DocFiles.uuid, hash),
      });

      if (existingDocFile) return existingDocFile;

      // upload file to storage
      await storage.putObject({
        content,
        key: storagekey,
        contentType,
      });

      // create docfile
      const [docFile] = await db
        .insert(DocFiles)
        .values({
          // use hash as uuid so same content will have same uuid
          uuid: hash,
          filename,
          platformId: session!.platform.id,
          uploaderId: session!.user.id,
          storagekey,
        })
        .returning()
        .execute();

      if (!docFile) throw new Error("Failed to create docFile record");

      if (contentType === "application/pdf") {
        const keyPairs = await saveImagesToStorage(content, storage);
        await Promise.all(keyPairs.map((keyPair) => insertImageRecords(db, docFile.id, keyPair)));
      } else {
        await insertImageRecords(db, docFile.id, {
          imageKey: storagekey,
          thumbnailKey: "",
          page: 1,
        });
      }
      return docFile;
    };

    await Promise.all([docExtraction.createExtraction({ uuid, filename, content }), findOrCreateDocFile()]);

    return { uuid, fileContentBase64: content.toString("base64") };
  } catch (err) {
    getLogger().error(err);
    throw err;
  }
};

const insertImageRecords = async (tx: DatabaseType, docFileId: bigint, keyPair: KeyPairType) => {
  const [[img1], [img2]] = await Promise.all([
    !keyPair.imageKey
      ? []
      : tx
          .insert(DocImages)
          .values({
            docFileId,
            page: keyPair.page,
            storagekey: keyPair.imageKey,
          })
          .returning()
          .execute(),
    !keyPair.thumbnailKey
      ? []
      : tx
          .insert(DocImages)
          .values({
            docFileId,
            page: keyPair.page,
            thumbnail: true,
            storagekey: keyPair.thumbnailKey,
          })
          .returning()
          .execute(),
  ]);

  getLogger().debug(`Page images inserted: ${img1?.id}, ${img2?.id}`);
  return true;
};
