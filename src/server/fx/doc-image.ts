import { sortBy } from "remeda";

import { type DatabaseType } from "@/server/db";
import { type StorageServiceType } from "@/server/services/storage-service";
import { type DocImage } from "@prisma/client";

export const getDocImagesByDocFileId = async (db: DatabaseType, storage: StorageServiceType, docFileId: bigint) => {
  const images = await db.docImage.findMany({ where: { docFileId } });
  const n = groupImagesByPage(images).map(async (image) => {
    const [imageUrl, thumbnailUrl] = await Promise.all([
      storage.getPresignedUrl({key: image.imageKey!}),
      storage.getPresignedUrl({key: image.thumbnailKey!,})
    ]);
    return {
      page: image.page,
      imageUrl,
      thumbnailUrl
    }
  });
  return Promise.all(n);
}

const groupImagesByPage = (images: DocImage[]) => {
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
