import { InferSelectModel } from "drizzle-orm";
import { type TestDbType } from "../fixtures/db-fixtures";
import { DocFiles, DocImages } from "@/drizzle/schema";

export const withDocImages = ({
  db,
  docFile,
}: {
  db: TestDbType;
  docFile: InferSelectModel<typeof DocFiles>;
}) => {
  const images = [1, 2, 3].map((idx) => [
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
  ]).flat();

  return db.insert(DocImages).values(images).returning().execute()
};
