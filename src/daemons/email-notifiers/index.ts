import { type DatabaseType } from "@/server/db";
import { type EmailServiceType } from "@/server/services/email-service";
import { type components } from "@/types/bu-scheme";
import { type EBlStash, type Platform } from "@prisma/client";
import { transferEmailNotifier } from "./transfer-email-notifier";
import { returnEmailNotifier } from "./return-email-notifier";
import { accomplishEmailNotifier } from "./accomplish-email-notifier";
import { amendRequestEmailNotifier } from "./amend-request-email-notifier";

type EBlRecordType = components["schemas"]["BillOfLadingRecord"];

export type EmailNotifier = (args: {
  db: DatabaseType;
  service: EmailServiceType;
  platform: Platform;
  rec: EBlRecordType;
  stash?: EBlStash;
  newStash: EBlStash;
}) => Promise<void>;

export const performEmailNotifiers = async (args: {
  db: DatabaseType;
  service: EmailServiceType;
  platform: Platform;
  rec: EBlRecordType;
  stash?: EBlStash;
  newStash: EBlStash;
}) => {
  await Promise.all(emailNotifiers.map((notifier) => notifier(args)));
};

const emailNotifiers: EmailNotifier[] = [
  transferEmailNotifier,
  returnEmailNotifier,
  accomplishEmailNotifier,
  amendRequestEmailNotifier,
];
