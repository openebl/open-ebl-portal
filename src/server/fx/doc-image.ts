import { sortBy } from "remeda";

import { DocImages } from "@/drizzle/schema";
import { type StorageServiceType } from "@/server/services/storage-service";
import { eq, InferSelectModel, sql } from "drizzle-orm";
import { DatabaseType } from "../db";

export const getDocImagesByDocFileUuid = async (
  db: DatabaseType,
  storage: StorageServiceType,
  uuid: string,
) => {
  const images = await db
    .select()
    .from(DocImages)
    .where(sql`"docFileId" = (SELECT id FROM "DocFiles" WHERE uuid = ${uuid})`);

  const n = groupImagesByPage(images).map(async (image) => {
    const [imageUrl, thumbnailUrl] = await Promise.all([
      image.imageKey && storage.getPresignedUrl({ key: image.imageKey }),
      image.thumbnailKey &&
        storage.getPresignedUrl({ key: image.thumbnailKey }),
    ]);
    return {
      page: image.page,
      imageUrl,
      thumbnailUrl,
    };
  });
  return Promise.all(n);
};

export const getDocImagesByDocFileId = async (
  db: DatabaseType,
  storage: StorageServiceType,
  docFileId: bigint,
) => {
  const images = await db.query.DocImages.findMany({
    where: eq(DocImages.docFileId, docFileId),
  });
  const n = groupImagesByPage(images).map(async (image) => {
    const [imageUrl, thumbnailUrl] = await Promise.all([
      image.imageKey && storage.getPresignedUrl({ key: image.imageKey }),
      image.thumbnailKey &&
        storage.getPresignedUrl({ key: image.thumbnailKey }),
    ]);
    return {
      page: image.page,
      imageUrl,
      thumbnailUrl,
    };
  });
  return Promise.all(n);
};

type DocImageType = InferSelectModel<typeof DocImages>;

const groupImagesByPage = (images: DocImageType[]) => {
  const result = {} as Record<
    number,
    { page: number; imageKey?: string | null; thumbnailKey?: string | null }
  >;
  images.forEach((image) => {
    const key = image.thumbnail
      ? { thumbnailKey: image.storagekey }
      : { imageKey: image.storagekey };
    if (!result[image.page]) {
      result[image.page] = { page: image.page, ...key };
    } else {
      result[image.page] = { ...result[image.page]!, ...key };
    }
  });
  return sortBy(Object.values(result), (n) => n.page);
};
