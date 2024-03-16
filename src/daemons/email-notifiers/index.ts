import { type components } from "@/types/bu-scheme";
import { type EBlStash, type Platform } from "@prisma/client";

type EBlRecordType = components["schemas"]["BillOfLadingRecord"];

export type EmailNotifier = (args: {
  platform: Platform;
  rec: EBlRecordType;
  stash?: EBlStash;
  newStash: EBlStash;
}) => Promise<void>;

export const performEmailNotifiers = async (args: {
  platform: Platform;
  rec: EBlRecordType;
  stash?: EBlStash;
  newStash: EBlStash;
}) => {
  await Promise.all(emailNotifiers.map((notifier) => notifier(args)));
}

const emailNotifiers: EmailNotifier[] = [
];

