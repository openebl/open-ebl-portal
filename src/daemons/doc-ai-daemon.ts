import { getLogger } from "@/lib/logger";
import { DocAiTaskStatus, PrismaClient } from "@prisma/client";

const logger = getLogger();
const db = new PrismaClient()

const rawDocInfos = {
  "DEMO0001.pdf": {
    blNumber: "DEMO0001",
    blType: "hbl-non-negotiable",
    pol: "CNYTN",
    pod: "USLAX",
    eta: new Date(2024, 2, 29),
    shipper: '101',
    consignee: '102',
    releaseAgent: '103',
  },
  "DEMO0002.pdf": {
    blNumber: "DEMO0001",
    blType: "hbl-non-negotiable",
    pol: "CNSHA",
    pod: "USLAX",
    eta: new Date(2024, 3, 22),
    shipper: '101',
    consignee: '102',
    releaseAgent: '103',
  },
  "other": {
    blNumber: "Others",
    blType: "hbl-non-negotiable",
    pol: "CNSHA",
    pod: "USLAX",
    eta: new Date(2024, 5, 22),
    shipper: '101',
    consignee: '102',
    releaseAgent: '103',
  },
}
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
        const docFile = await tx.docFile.findFirst({where: {id: task.docFileId}}) ;
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
