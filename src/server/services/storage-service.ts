import { env } from "@/env";
import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { fromEnv } from "@aws-sdk/credential-providers";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Context, Effect } from "effect";

import {
  internalServerError,
  type InternalServerError,
} from "../server-errors";

export type PutObjectProps = {
  content: Buffer;
  key: string;
  contentType: string;
};

export type StorageServiceType = {
  readonly putObject: (
    props: PutObjectProps,
  ) => Effect.Effect<void, InternalServerError, never>;
  readonly getPresignedUrl: (props: {
    key: string;
  }) => Effect.Effect<string, InternalServerError, never>;
};

const putObject = ({ content, key, contentType }: PutObjectProps) =>
  Effect.tryPromise({
    try: async () => {
      const s3 = new S3Client({ credentials: fromEnv() });
      const cmd = new PutObjectCommand({
        Bucket: env.S3_BUCKET,
        Key: key,
        Body: content,
        ContentType: contentType,
      });
      await s3.send(cmd);
    },
    catch: (err) => internalServerError(err),
  });

const getPresignedUrl = ({ key }: { key: string }) =>
  Effect.tryPromise({
    try: async () => {
      const s3 = new S3Client({ credentials: fromEnv() });
      const command = new GetObjectCommand({
        Bucket: env.S3_BUCKET,
        Key: key,
      });
      return await getSignedUrl(s3, command, { expiresIn: 3600 });
    },
    catch: (err) => internalServerError(err),
  });

export class StorageService extends Context.Tag("StorageService")<
  StorageService,
  {
    readonly putObject: (
      props: PutObjectProps,
    ) => Effect.Effect<void, InternalServerError>;
    readonly getPresignedUrl: (props: {
      key: string;
    }) => Effect.Effect<string, InternalServerError, never>;
  }
>() {}

// export const provideS3StorageService = Effect.provideService(StorageService, {
//   putObject: putObject,
// });
export const s3StorageService: StorageServiceType = {
  putObject,
  getPresignedUrl,
};
