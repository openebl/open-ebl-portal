import { getLogger } from "./lib/logger"
import { init_doc_ai } from "./services/doc-ai"

export function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    init_doc_ai().catch((e) => {
      getLogger().error(`Failed to initialize doc ai: ${e}`);
    });

  } else if (process.env.NEXT_RUNTIME === 'edge') {
    // do nothing. simplely a placeholder
  }
}
