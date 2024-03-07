import { NextResponse, type NextRequest } from 'next/server';

import { getServerAuthSession } from '@/server/auth';
import { db } from '@/server/db';
import { processFileDocUploadReq } from '@/server/fx/ebl';
import { s3StorageService } from '@/server/services/storage-service';

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  const session = await getServerAuthSession();
  // TODO: create_doc_ai_extraction
  const res = await processFileDocUploadReq({ req, session, db, storage: s3StorageService })
  return new NextResponse(res.toString())
}
