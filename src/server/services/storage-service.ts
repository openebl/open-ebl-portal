import { env } from "@/env";
import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { fromEnv } from "@aws-sdk/credential-providers";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export type PutObjectProps = {
  content: Buffer;
  key: string;
  contentType: string;
};

export type StorageServiceType = {
  readonly putObject: (props: PutObjectProps) => Promise<void>;
  readonly getPresignedUrl: (props: { key: string }) => Promise<string>;
  readonly downloadToBrowser: (props: { key: string; filename: string }) => Promise<string>;
};

const putObject = async ({ content, key, contentType }: PutObjectProps) => {
  const s3 = new S3Client({ credentials: fromEnv() });
  const cmd = new PutObjectCommand({
    Bucket: env.S3_BUCKET,
    Key: key,
    Body: content,
    ContentType: contentType,
  });
  await s3.send(cmd);
};

const getPresignedUrl = ({ key }: { key: string }) => {
  const s3 = new S3Client({ credentials: fromEnv() });
  const command = new GetObjectCommand({
    Bucket: env.S3_BUCKET,
    Key: key,
  });
  return getSignedUrl(s3, command, { expiresIn: 3600 });
};

const downloadToBrowser = ({ key, filename }: { key: string; filename: string }) => {
  const s3 = new S3Client({ credentials: fromEnv() });
  const command = new GetObjectCommand({
    Bucket: env.S3_BUCKET,
    Key: key,
    ResponseContentDisposition: `attachment; filename=${filename}`,
  });
  return getSignedUrl(s3, command, { expiresIn: 3600 });
};

export const s3StorageService: StorageServiceType = {
  putObject,
  getPresignedUrl,
  downloadToBrowser,
};
