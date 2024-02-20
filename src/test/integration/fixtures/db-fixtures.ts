import { type createDb } from "@/server/db";
import { test } from 'vitest';

import { spinUpTestPrisma } from '@/test/integration/helpers/test-db';

export type TestDbType = ReturnType<typeof createDb>;
export interface DBFixtures {
  db: ReturnType<typeof createDb>
}

export const testWithDb = test.extend<DBFixtures>({
  db: async ({}, use) => {
    await spinUpTestPrisma(async (testPrisma) => {
      await use(testPrisma)
    })
  },
})
