import { NextResponse, type NextRequest } from 'next/server';

import { db } from '@/server/db';
import { processFileDocUploadReq } from '@/server/fx/ebl';
import { convertErrorToResponse } from '@/server/fx/response';
import { liveDatabase } from '@/server/services/database-service';
import { Effect, pipe } from 'effect';

export async function POST(req: NextRequest) {
  const runnable = pipe(
    processFileDocUploadReq(req),

    Effect.map((result) => new NextResponse(result)),
    Effect.catchAll((error) => convertErrorToResponse(error)),

    liveDatabase(db),
  );

  return await Effect.runPromise(runnable);
}
