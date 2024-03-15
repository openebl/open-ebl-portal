import { type Platform, type User } from "@prisma/client";
import { type TestDbType } from "../fixtures/db-fixtures";

export const withDocFile = ({
  db,
  platform,
  user,
}: {
  db: TestDbType;
  platform: Platform;
  user: User;
}) => {
  return db.docFile.create({
    data: {
      uuid: 'mockuuid',
      platformId: platform.id,
      uploaderId: user.id,
      filename: "mockfile",
      storagekey: "mockkey",
    },
  });
};
