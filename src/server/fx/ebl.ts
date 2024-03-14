import crypto from "crypto";
import { writeFile } from "fs/promises";
import { type Session } from "next-auth";
import { type NextRequest } from "next/server";
import path from "path";

import { getLogger } from "@/lib/logger";
import { pdf2Image } from "@/lib/pdf2image";
import { tempFolder } from "@/lib/server-utils";
import { type StorageServiceType } from "@/server/services/storage-service";
import { eBlIdGenerator } from "@/types/ebl";
import {
  DocAiTaskStatus,
} from "@prisma/client";
import { type DatabaseType, type TransactionType } from "../db";
import { readRequestBodyToBuffer } from "./req";
import { validateSession } from "./session";

type KeyPairType = { imageKey: string; thumbnailKey: string; page: number };

const saveContentToTempFile = async (content: Buffer) => {
  const folder = await tempFolder();
  const tmpFilename = path.join(folder, "content");
  await writeFile(tmpFilename, content);
  return tmpFilename;
};

const savePdfImagesToStorage = async (
  content: Buffer,
  storage: StorageServiceType,
) => {
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
}: {
  req: NextRequest;
  session: Session | null;
  db: DatabaseType;
  storage: StorageServiceType;
}) => {
  const storagekey = `/ebl/${crypto.randomUUID()}`;
  validateSession(session);

  // read content from request body
  const contentBuffer = await readRequestBodyToBuffer(req.body);

  // check content type of the file
  const contentType = req.headers.get('Content-Type') ?? 'application/pdf';

  // upload file to s3
  await storage.putObject({
    content: contentBuffer,
    key: storagekey,
    contentType,
  });

  let keyPairs: KeyPairType[] = [];
  if (contentType === 'application/pdf') {
    // if file is pdf, convert pdf to images and save images to storage
    keyPairs = await savePdfImagesToStorage(contentBuffer, storage);
  } else {
    keyPairs.push({
      imageKey: storagekey,
      thumbnailKey: storagekey,
      page: 1,
    });
  }

  return db.$transaction(async (tx) => {
    // insert fileDoc record
    const docFile = await tx.docFile.create({
      data: {
        filename: req.headers.get("X-Filename"),
        platformId: session!.platform.id,
        uploaderId: session!.user.id,
        storagekey,
      },
    });
    if (!docFile) throw new Error("Failed to create docFile record");

    // insert ebl record
    await Promise.all([
      tx.eBl.create({
        data: {
          id: eBlIdGenerator(),
          docFileId: docFile.id,
          blNumber: "",
          status: "UPLOADED",
        },
      }),

      // insert ebl record
      tx.docAiTask.create({
        data: {
          docFileId: docFile.id,
          externalId: "",
          status: DocAiTaskStatus.PROCESSING,
        },
      }),
      ...keyPairs.map((keyPair) => insertImageRecords(tx, docFile.id, keyPair)),
    ]);

    return docFile.id;
  });
};

const insertImageRecords = async (
  tx: TransactionType,
  docFileId: bigint,
  keyPair: KeyPairType,
) => {
  const imgs = await Promise.all([
    tx.docImage.create({
      data: {
        docFileId,
        page: keyPair.page,
        storagekey: keyPair.imageKey,
      },
    }),
    tx.docImage.create({
      data: {
        docFileId,
        page: keyPair.page,
        thumbnail: true,
        storagekey: keyPair.thumbnailKey,
      },
    }),
  ]);

  getLogger().debug(`Page images inserted: ${imgs[0].id}, ${imgs[1].id}`);
  return true;
};
