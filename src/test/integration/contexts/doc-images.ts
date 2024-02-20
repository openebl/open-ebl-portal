import { type DocFile } from "@prisma/client";
import { type TestDbType } from "../fixtures/db-fixtures";

export const withDocImage = ({
  db,
  docFile,
}: {
  db: TestDbType;
  docFile: DocFile;
}) => {
  return db.docImage.create({
    data: { docFileId: docFile.id, page: 1, storagekey: "mockimage-1" },
  });
};
