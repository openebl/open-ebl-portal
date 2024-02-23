import crypto from "crypto";
import {
  Chunk,
  Console,
  Effect,
  Option,
  Stream,
  type StreamEmit,
} from "effect";
import { writeFile } from "fs/promises";
import { type Session } from "next-auth";
import { type NextRequest } from "next/server";
import path from "path";

import { pdf2Image } from "@/lib/pdf2image";
import { internalServerError } from "@/server/server-errors";
import {
  DatabaseService,
  type FlatTransaction,
} from "@/server/services/database-service";
import { StorageService } from "@/server/services/storage-service";
import { EBlAllowAction, eBlIdGenerator } from "@/types/ebl";
import { DocAiTaskStatus, type EBl, EBlStatus } from "@prisma/client";
import { asyncFnToEffect } from "./helper";
import { bodyToBuffer } from "./req";
import { validateSession } from "./session";
import { tempFolder } from "@/lib/server-utils";
import { getLogger } from "@/lib/logger";

type ImagePairType = { image: Buffer; thumbnail: Buffer; page: number };
type KeyPairType = { imageKey: string; thumbnailKey: string; page: number };
type ImageStreamEmitter = StreamEmit.Emit<never, never, ImagePairType, void>;

const saveContentToTempFile = (content: Buffer) =>
  Effect.tryPromise({
    try: async () => {
      const folder = await tempFolder();
      const tmpFilename = path.join(folder, "content");
      await writeFile(tmpFilename, content);
      return tmpFilename;
    },
    catch: (error) => internalServerError(error),
  });

const pdfFileToImageStream = (filename: string) =>
  Stream.async((emit: ImageStreamEmitter) => {
    pdf2Image({
      filename,
      onPage(image, thumbnail, page) {
        emit(Effect.succeed(Chunk.of({ image, thumbnail, page }))).catch(
          (err) => console.error("pdf2Image error", err),
        );
      },
      onComplete() {
        emit(Effect.fail(Option.none())).catch((err) =>
          console.error("pdf2Image onComplete error", err),
        );
      },
    }).catch((err) => console.error("pdfFileToImageStream error", err));
  });

const generateImageKeys = () =>
  Effect.succeed({
    imageKey: `/ebl-image/${crypto.randomUUID()}`,
    thumbnailKey: `/ebl-thumbnail/${crypto.randomUUID()}`,
  });

const storeImageAndThumbnail = (imagePair: ImagePairType) =>
  StorageService.pipe(
    Effect.flatMap((storage) =>
      generateImageKeys().pipe(
        Effect.tap(({ imageKey }) =>
          storage.putObject({
            content: imagePair.image,
            key: imageKey,
            contentType: "image/webp",
          }),
        ),
        Effect.tap(({ thumbnailKey }) =>
          storage.putObject({
            content: imagePair.thumbnail,
            key: thumbnailKey,
            contentType: "image/webp",
          }),
        ),
        Effect.tap(({ imageKey, thumbnailKey }) =>
          Console.log(`saved to storage: ${imageKey}, ${thumbnailKey}`),
        ),
        Effect.map((keyPair) => ({ ...keyPair, page: imagePair.page })),
      ),
    ),
  );

const insertImageRecords = (
  tx: FlatTransaction,
  docFileId: bigint,
  keyPair: KeyPairType,
) =>
  Effect.tryPromise({
    try: async () => {
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
    },
    catch: (error) => internalServerError(error),
  });

const savePdfImagesToStorage = (content: Buffer) =>
  saveContentToTempFile(content).pipe(
    Effect.flatMap((filename) =>
      Stream.runCollect(
        pdfFileToImageStream(filename).pipe(
          Stream.mapEffect((imagePair) => storeImageAndThumbnail(imagePair)),
        ),
      ),
    ),
  );

const insertFileDoc = ({
  session,
  storagekey,
  filename,
  tx,
}: {
  session: Session;
  storagekey: string;
  filename: string | null;
  tx: FlatTransaction;
}) =>
  asyncFnToEffect(() =>
    tx.docFile.create({
      data: {
        filename,
        platformId: session.platformId,
        uploaderId: session.user.id,
        storagekey,
      },
    }),
  );

const insertEbl = (tx: FlatTransaction, docFileId: bigint) =>
  asyncFnToEffect(() =>
    tx.eBl.create({
      data: {
        id: eBlIdGenerator(),
        docFileId,
        blNumber: "",
        status: "UPLOADED",
      },
    }),
  );

const insertDocAiTask = (tx: FlatTransaction, docFileId: bigint) =>
  asyncFnToEffect(() =>
    tx.docAiTask.create({
      data: {
        docFileId,
        externalId: "",
        status: DocAiTaskStatus.PROCESSING,
      },
    }),
  );

export const processFileDocUploadReq = (
  req: NextRequest,
  maybeSession: Session | null,
) =>
  Effect.gen(function* (_) {
    const storagekey = `/ebl/${crypto.randomUUID()}`;
    const session = yield* _(validateSession(maybeSession));

    const database = yield* _(DatabaseService);
    const storage = yield* _(StorageService);

    // read pdf content from request body
    const pdfBuffer = yield* _(bodyToBuffer(req.body));

    // upload file to s3
    yield* _(
      storage.putObject({
        content: pdfBuffer,
        key: storagekey,
        contentType: "application/pdf",
      }),
    );

    // read pdf page images, send to S3, and return keys
    const keyPairs = yield* _(savePdfImagesToStorage(pdfBuffer));

    return yield* _(
      Effect.scoped(
        Effect.gen(function* (_) {
          const tx = yield* _(database.transaction());

          // insert fileDoc record
          const fileDoc = yield* _(
            insertFileDoc({
              tx,
              session,
              storagekey,
              filename: req.headers.get("X-Filename"),
            }),
          );

          // insert ebl record
          yield* _(insertEbl(tx, fileDoc.id));

          // insert ebl record
          yield* _(insertDocAiTask(tx, fileDoc.id));

          // insert page images
          yield* _(
            Effect.forEach(Chunk.toReadonlyArray(keyPairs), (keyPair) =>
              insertImageRecords(tx, fileDoc.id, keyPair),
            ),
          );

          return fileDoc.id;
        }),
      ),
    );
  });

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
      1: [EBlAllowAction.Transfer, EBlAllowAction.Amend, EBlAllowAction.Return, EBlAllowAction.Print],
      2: [EBlAllowAction.Transfer, EBlAllowAction.Amend, EBlAllowAction.Return, EBlAllowAction.Print],
      3: [EBlAllowAction.Accomplish, EBlAllowAction.Amend, EBlAllowAction.Return, EBlAllowAction.Print],
    },
  ],
]);

export const eBLAllowActions = (ebl: EBl, currentPlatformId: bigint): EBlAllowAction[] => {
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
  const actions = allowActionsMapping.get(ebl.status)
  return actions?.[current] ?? [];
};
