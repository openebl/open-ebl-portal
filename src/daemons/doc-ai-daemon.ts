import { DocAiTaskStatus, PrismaClient } from "@prisma/client";
// import { add } from "date-fns";
// import pino from "pino";

const shippers = ["Foxconn", "Quanta Computer", "Flex", "Pegatron"].map(
  (n) => ({ name: n, value: n.toLowerCase() }),
);

const consignees = ["Samsung", "Apple", "Google", "Microsoft"].map(
  (n) => ({ name: n, value: n.toLowerCase() }),
);

// const logger = pino({
//   level: "debug",
//   formatters: {
//     level(label) {
//       return { level: label.toUpperCase() };
//     },
//   },
// });

const logger = {
  info: console.log,
  error: console.error,
  debug: console.debug,
  warn: console.warn,
};

const db = new PrismaClient()

const docAiDaemon = async () => {
  logger.info("initialize doc ai");

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
        if (ebl) {
          await tx.eBl.update({
            where: { id: ebl.id },
            data: {
              blNumber: "123456",
              blType: "hbl-non-negotiable",
              pol: "CNYTN",
              pod: "USLAX",
              eta: new Date(new Date().setDate(new Date().getDate() + 20)),
              shipper:
                shippers[Math.floor(Math.random() * shippers.length)]?.value,
              consignee:
                consignees[Math.floor(Math.random() * consignees.length)]
                  ?.value,
            },
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

await docAiDaemon().catch(console.error);
