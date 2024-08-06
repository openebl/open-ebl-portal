import { DocFiles, type Platforms, type Users } from "@/drizzle/schema";
import type { InferSelectModel } from "drizzle-orm";
import { type TestDbType } from "../fixtures/db-fixtures";

export const withDocFile = async ({
  db,
  platform,
  user,
}: {
  db: TestDbType;
  platform: InferSelectModel<typeof Platforms>;
  user: InferSelectModel<typeof Users>;
}) => {
  const [docFile] = await db
    .insert(DocFiles)
    .values({
      uuid: "mockuuid",
      platformId: platform.id,
      uploaderId: user.id,
      filename: "mockfile",
      storagekey: "mockkey",
    })
    .returning()
    .execute();

  return docFile!;
};
