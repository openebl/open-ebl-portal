import { NextResponse, type NextRequest } from 'next/server';

import { getServerAuthSession } from '@/server/auth';
import { db } from '@/server/db';
import { processFileDocUploadReq } from '@/server/fx/ebl';
import { convertErrorToResponse } from '@/server/fx/response';
import { DatabaseService, liveDatabaseService } from '@/server/services/database-service';
import { StorageService, s3StorageService } from '@/server/services/storage-service';
import { Effect, pipe } from 'effect';

export async function POST(req: NextRequest) {
  const session = await getServerAuthSession();
  const runnable = pipe(
    processFileDocUploadReq(req, session),

    Effect.map((result) => new NextResponse(result.toString())),
    Effect.catchAll((error) => convertErrorToResponse(error)),

    Effect.provideService(DatabaseService, liveDatabaseService(db)),
    Effect.provideService(StorageService, s3StorageService),
  );

  return await Effect.runPromise(runnable);
}
