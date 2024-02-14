import { getLogger } from "@/lib/logger";

const init_doc_ai = async () => {
  getLogger().info("initialize doc ai");

  // while (true) {
  //   getLogger().info("polling data from doc ai...");
  //   await new Promise((resolve) => setTimeout(resolve, 60000));
  // }
};

export { init_doc_ai };
