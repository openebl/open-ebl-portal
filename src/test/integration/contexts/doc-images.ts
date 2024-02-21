import { type DocFile } from "@prisma/client";
import { type TestDbType } from "../fixtures/db-fixtures";

export const withDocImages = ({
  db,
  docFile,
}: {
  db: TestDbType;
  docFile: DocFile;
}) => {
  return db.docImage.createMany({
    data: [1, 2, 3]
      .map((idx) => [
        {
          docFileId: docFile.id,
          page: idx,
          thumbnail: false,
          storagekey: `mockimg-${idx}`,
        },
        {
          docFileId: docFile.id,
          page: idx,
          thumbnail: true,
          storagekey: `mockthu-${idx}`,
        },
      ])
      .flat(),
  });
};
