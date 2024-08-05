import { test } from 'vitest';

import { spinUpTestPrisma } from '@/test/integration/helpers/test-db';
import { DatabaseType } from '@/server/db';

export type TestDbType = DatabaseType;

export interface DBFixtures {
  db: TestDbType
}

export const testWithDb = test.extend<DBFixtures>({
  db: async ({}, use) => {
    await spinUpTestPrisma(async (testPrisma) => {
      await use(testPrisma)
    })
  },
})
