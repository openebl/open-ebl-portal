import { Requesters } from "@/drizzle/schema";
import { createHash } from "crypto";
import { headers } from "next/headers";
import { db } from "../db";

export function createRequester({
  platformId,
  userId,
}: {
  platformId: bigint;
  userId: bigint;
}): string {
  const ip = headers().get("x-forwarded-ip");
  const userAgent = headers().get("user-agent");
  const acceptLanguage = headers().get("accept-language");
  const content = `${ip}--${userAgent}--${acceptLanguage}--${platformId}--${userId}`;
  const digest = createHash("sha1").update(content).digest("hex");

  db.insert(Requesters)
    .values({
      id: digest,
      ip,
      userAgent,
      acceptLanguage,
      platformId,
      userId,
    })
    .onConflictDoNothing({
      target: Requesters.id,
    })
    .catch((err) => {
      console.error("Failed to create requester", err);
    });

  return digest;
}
