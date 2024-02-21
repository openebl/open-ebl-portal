import { Effect } from "effect";
import { DatabaseService } from "@/server/services/database-service";
import { type DocImage } from "@prisma/client";
import { sortBy } from "remeda";
import { StorageService } from "../services/storage-service";

export const getDocImagesByDocFileId = (docFileId: bigint) =>
  DatabaseService.pipe(
    Effect.flatMap((db) => db.transaction()),
    Effect.flatMap((tx) =>
      Effect.promise(() => tx.docImage.findMany({ where: { docFileId } })),
    ),

    Effect.map(groupImagesByPage),

    Effect.tap((n) => console.log(n)),
    Effect.flatMap((images) =>
      StorageService.pipe(
        Effect.flatMap((storage) =>
          Effect.forEach(images, (image) =>
            Effect.all({
              page: Effect.succeed(image.page),
              imageUrl: storage.getPresignedUrl({
                key: image.imageKey!,
              }),
              thumbnailUrl: storage.getPresignedUrl({
                key: image.thumbnailKey!,
              }),
            }),
          ),
        ),
      ),
    ),
  );

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
