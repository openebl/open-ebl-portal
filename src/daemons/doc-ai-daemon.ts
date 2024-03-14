import { getLogger } from "@/lib/logger";

const logger = getLogger();

// TODO: this daemon will be removed completed later
const docAiDaemon = async () => {
  logger.info("Doc AI Daemon started");

  while (true) {
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }
};

docAiDaemon().catch(console.error);
