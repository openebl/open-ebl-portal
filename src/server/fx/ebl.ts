import { env } from "@/env";
import { internalServerError } from "@/server/server-errors";
import {
  DatabaseService,
  type FlatTransaction,
} from "@/server/services/database-service";
import { eBlIdGenerator } from "@/types/ebl";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { fromEnv } from "@aws-sdk/credential-providers";
import { DocAiTaskStatus } from "@prisma/client";
import { Effect } from "effect";
import { type Session } from "next-auth";
import { type NextRequest } from "next/server";
import { validateSession } from "./session";

const uploadReadableStreamToS3 = async (
  stream: ReadableStream<Uint8Array> | null,
  uuid: string,
) => {
  if (!stream) {
    throw new Error("No file provided");
  }

  const reader = stream.getReader();
  let result = await reader.read();
  const chunks = [];
  while (!result.done) {
    chunks.push(result.value);
    result = await reader.read();
  }
  const buffer = Buffer.concat(chunks);
  const s3 = new S3Client({
    credentials: fromEnv(),
  });

  const cmd = new PutObjectCommand({
    Bucket: env.S3_BUCKET,
    Key: `/ebl/${uuid}`,
    Body: buffer,
  });

  await s3.send(cmd);
  return uuid;
};

const TryInsertDbRecord = <R>(fn: () => Promise<R>) =>
  Effect.tryPromise({
    try: fn,
    catch: (error) => internalServerError(error),
  });

const insertFileDoc = ({
  session,
  uuid,
  filename,
  tx,
}: {
  session: Session;
  uuid: string;
  filename: string | null;
  tx: FlatTransaction;
}) =>
  TryInsertDbRecord(() =>
    tx.docFile.create({
      data: {
        filename,
        platformId: session.platformId,
        uploaderId: session.user.id,
        storagekey: uuid,
      },
    }),
  );

const insertEbl = (tx: FlatTransaction, docFileId: bigint) =>
  TryInsertDbRecord(() =>
    tx.eBl.create({
      data: {
        id: eBlIdGenerator(),
        docFileId,
        blNumber: "",
      },
    }),
  );

const insertDocAiTask = (tx: FlatTransaction, docFileId: bigint) =>
  TryInsertDbRecord(() =>
    tx.docAiTask.create({
      data: {
        docFileId,
        externalId: "",
        status: DocAiTaskStatus.PROCESSING,
      },
    }),
  );

export const processFileDocUploadReq = (req: NextRequest) =>
  Effect.scoped(
    Effect.gen(function* (_) {
      const uuid = crypto.randomUUID();

      const session = yield* _(validateSession());

      const database = yield* _(DatabaseService);
      const tx = yield* _(database.transaction());

      // insert fileDoc record
      const fileDoc = yield* _(
        insertFileDoc({
          session,
          uuid,
          filename: req.headers.get("X-Filename"),
          tx,
        }),
      );

      // insert ebl record
      yield* _(insertEbl(tx, fileDoc.id));

      // upload file to s3
      yield* _(
        Effect.tryPromise({
          try: () => uploadReadableStreamToS3(req.body, uuid),
          catch: (error) => internalServerError(error),
        }),
      );

      // insert ebl record
      yield* _(insertDocAiTask(tx, fileDoc.id));

      return fileDoc.id.toString();
    }),
  );
