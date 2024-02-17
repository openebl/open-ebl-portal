import crypto from "crypto";
import { Chunk, Effect, Option, Stream, type StreamEmit } from "effect";
import { writeFile } from "fs/promises";
import { type Session } from "next-auth";
import { type NextRequest } from "next/server";
import path from "path";

import { pdf2Image } from "@/lib/pdf2image";
import { tempFolder } from "@/lib/utils";
import { internalServerError } from "@/server/server-errors";
import {
  DatabaseService,
  type FlatTransaction,
} from "@/server/services/database-service";
import { StorageService } from "@/server/services/storage-service";
import { eBlIdGenerator } from "@/types/ebl";
import { DocAiTaskStatus } from "@prisma/client";
import { asyncFnToEffect } from "./helper";
import { bodyToBuffer } from "./req";
import { validateSession } from "./session";

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
          (err) => console.error('pdf2Image error', err),
        );
      },
      onComplete() {
        emit(Effect.fail(Option.none())).catch(
          (err) => console.error('pdf2Image onComplete error', err),
        );
      },
    }).catch((err) => console.error('pdfFileToImageStream error', err));
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
        Effect.map((keyPair) => ({ ...keyPair, page: imagePair.page })),
      ),
    ),
  );

const insertImageRecords = (docFileId: bigint, keyPair: KeyPairType) =>
  DatabaseService.pipe(
    Effect.flatMap((db) => db.transaction()),
    Effect.flatMap((tx) =>
      Effect.tryPromise({
        try: () =>
          Promise.all([
            tx.docImage.create({
              data: {
                docFileId,
                page: 1,
                storagekey: keyPair.imageKey,
              },
            }),
            tx.docImage.create({
              data: {
                docFileId,
                page: 1,
                storagekey: keyPair.thumbnailKey,
              },
            }),
          ]),
        catch: (error) => internalServerError(error),
      }),
    ),
  );

const savePdfImagesToStorageAndDb = (docFileId: bigint, content: Buffer) =>
  saveContentToTempFile(content).pipe(
    Effect.flatMap((filename) =>
      Stream.runCollect(
        pdfFileToImageStream(filename).pipe(
          Stream.mapEffect((imagePair) => storeImageAndThumbnail(imagePair)),
          Stream.mapEffect((keyPair) => insertImageRecords(docFileId, keyPair)),
          // Stream.tap((n) =>
          //   Console.log(
          //     `saved to storage: ${n.imageKey}, ${n.thumbnailKey}`,
          //   ),
          // ),
          // Stream.mapEffect((imagePair) => saveImageToDatabase(imagePair, tx)),
        ),
      ),
    ),
    // Effect.flatMap((filename) => Effect.succeed(1)),
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
  Effect.scoped(
    Effect.gen(function* (_) {
      const storagekey = `/ebl/${crypto.randomUUID()}`;
      const session = yield* _(validateSession(maybeSession));

      const database = yield* _(DatabaseService);
      const storage = yield* _(StorageService);
      const tx = yield* _(database.transaction());

      // read pdf content from request body
      const pdfBuffer = yield* _(bodyToBuffer(req.body));

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

      // upload file to s3
      yield* _(
        storage.putObject({
          content: pdfBuffer,
          key: storagekey,
          contentType: "application/pdf",
        }),
      );

      // read pdf page images, send to S3, and store image records to db
      yield* _(savePdfImagesToStorageAndDb(fileDoc.id, pdfBuffer));

      return fileDoc.id;
    }),
  );
