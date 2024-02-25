import crypto from "crypto";
import { writeFile } from "fs/promises";
import { type Session } from "next-auth";
import { type NextRequest } from "next/server";
import path from "path";

import { getLogger } from "@/lib/logger";
import { pdf2Image } from "@/lib/pdf2image";
import { tempFolder } from "@/lib/server-utils";
import { type StorageServiceType } from "@/server/services/storage-service";
import { EBlAllowAction, eBlIdGenerator } from "@/types/ebl";
import {
  DocAiTaskStatus,
  EBlStatus,
  type EBl,
  type Prisma,
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

  // read pdf content from request body
  const pdfBuffer = await readRequestBodyToBuffer(req.body);

  // upload file to s3
  await storage.putObject({
    content: pdfBuffer,
    key: storagekey,
    contentType: "application/pdf",
  });

  const keyPairs = await savePdfImagesToStorage(pdfBuffer, storage);

  return db.$transaction(async (tx) => {
    // insert fileDoc record
    const docFile = await tx.docFile.create({
      data: {
        filename: req.headers.get("X-Filename"),
        platformId: session!.platformId,
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

const allowActionsMapping = new Map<
  EBlStatus,
  Record<string, EBlAllowAction[]>
>([
  [
    EBlStatus.UPLOADED,
    {
      0: [EBlAllowAction.Issue],
    },
  ],
  [
    EBlStatus.DRAFT,
    {
      0: [EBlAllowAction.Issue],
    },
  ],
  [
    EBlStatus.PROCESSING,
    {
      1: [
        EBlAllowAction.Transfer,
        EBlAllowAction.Amend,
        EBlAllowAction.Return,
        EBlAllowAction.Print,
      ],
      2: [
        EBlAllowAction.Transfer,
        EBlAllowAction.Amend,
        EBlAllowAction.Return,
        EBlAllowAction.Print,
      ],
      3: [
        EBlAllowAction.Accomplish,
        EBlAllowAction.Amend,
        EBlAllowAction.Return,
        EBlAllowAction.Print,
      ],
    },
  ],
]);

export const eBLAllowActions = (
  ebl: EBl,
  currentPlatformId: bigint,
): EBlAllowAction[] => {
  if (ebl.ownerPlatformId !== currentPlatformId) {
    return [];
  }

  const sequence = [
    ebl.issuerId,
    ebl.shipperId,
    ebl.consigneeId,
    ebl.releaseAgentId,
  ];
  const current = sequence.indexOf(ebl.ownerPlatformId).toString();
  const actions = allowActionsMapping.get(ebl.status);
  return actions?.[current] ?? [];
};

const eBlQueryConditions: Record<
  string,
  (platformId: bigint) => Prisma.EBlWhereInput
> = {
  actionRequired: (platformId) => {
    return {
      status: { in: ["PROCESSING", "DRAFT"] },
      ownerPlatformId: platformId,
    };
  },
  upcoming: (platformId) => {
    return {
      status: "PROCESSING",
      nextPlatformId: platformId,
    };
  },
  sent: (platformId) => {
    return {
      status: { not: "COMPLETED" },
      journey: {
        some: {
          sourcePlatformId: platformId,
          action: { in: ["ISSUE", "TRANSFER"] },
        },
      },
    };
  },
  archive: (platformId) => {
    return {
      status: { in: ["COMPLETED", "PRINTED"] },
      journey: {
        some: { targetPlatformId: platformId },
      },
    };
  },
};

export const eBlQueryCondition = (
  filter: string | undefined,
  currentPlatformId: bigint,
): Prisma.EBlWhereInput => {
  const condition =
    eBlQueryConditions[filter ?? "actionRequired"] ??
    eBlQueryConditions.actionRequired!;
  return condition(currentPlatformId);
};
