import { getLogger } from "@/lib/logger";
import { DocAiTaskStatus, PrismaClient } from "@prisma/client";

const logger = getLogger();
const db = new PrismaClient();

const rawDocInfos = {
  "DEMO0001.pdf": {
    blNumber: "DEMO0001",
    blType: "hbl-non-negotiable",
    pol: "CNYTN",
    pod: "USLAX",
    eta: new Date(Date.parse("2024-02-29T14:30:00")),
    shipperPlatform: {
      connect: { id: 101n },
    },
    consigneePlatform: {
      connect: { id: 102n },
    },
    releaseAgentPlatform: {
      connect: { id: 103n },
    },
  },
  "DEMO0002.pdf": {
    blNumber: "DEMO0001",
    blType: "hbl-non-negotiable",
    pol: "CNSHA",
    pod: "USLAX",
    eta: new Date(Date.parse("2024-03-22T14:30:00")),
    shipperPlatform: {
      connect: { id: 101n },
    },
    consigneePlatform: {
      connect: { id: 102n },
    },
    releaseAgentPlatform: {
      connect: { id: 103n },
    },
  },
  other: {
    blNumber: "Others",
    blType: "hbl-non-negotiable",
    pol: "CNSHA",
    pod: "USLAX",
    eta: new Date(Date.parse("2024-05-22T14:30:00")),
    shipperPlatform: {
      connect: { id: 101n },
    },
    consigneePlatform: {
      connect: { id: 102n },
    },
    releaseAgentPlatform: {
      connect: { id: 103n },
    },
  },
};
const docInfos: Record<string, typeof rawDocInfos.other> = rawDocInfos;

const docAiDaemon = async () => {
  logger.info("Doc AI Daemon started");

  while (true) {
    const tasks = await db.docAiTask.findMany({
      where: { status: DocAiTaskStatus.PROCESSING },
      take: 1,
    });

    for (const task of tasks) {
      logger.info(`processing task ${task.id}`);
      await db.$transaction(async (tx) => {
        const ebl = await tx.eBl.findFirst({
          where: { docFileId: task.docFileId },
        });
        const docFile = await tx.docFile.findFirst({
          where: { id: task.docFileId },
        });
        if (ebl && docFile) {
          await tx.eBl.update({
            where: { id: ebl.id },
            data: docInfos[docFile.filename ?? 'other'] ?? docInfos.other!
          });
          await tx.docAiTask.update({
            where: { id: task.id },
            data: { status: DocAiTaskStatus.COMPLETED },
          });
        }
      });
    }
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }
};

docAiDaemon().catch(console.error);
