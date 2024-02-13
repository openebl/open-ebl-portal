import { getLogger } from "./lib/logger"

export function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    getLogger().info("---- nodejs")
  } else if (process.env.NEXT_RUNTIME === 'edge') {
    // do nothing. simplely a placeholder
  }
}
