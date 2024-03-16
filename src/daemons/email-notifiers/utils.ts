import { db } from "@/server/db";
import { type EBlStash } from "@prisma/client";

export const touchEmailNotification = async (name: string, stash: EBlStash) => {
  return db.eBlNotification.create({
    data: {
      name,
      eBlStashId: stash.id,
    },
  });
}
