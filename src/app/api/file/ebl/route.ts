import { NextResponse, type NextRequest } from "next/server";

import { getServerAuthSession } from "@/server/auth";
import { db } from "@/server/db";
import { processFileDocUploadReq } from "@/server/fx/ebl";
import { s3StorageService } from "@/server/services/storage-service";
import { bxDocExtraction } from "@/add-ons/doc-reader/doc-extraction";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const session = await getServerAuthSession();
  if (!session) {
    return new NextResponse("No Permission", { status: 401 });
  }

  const result = await processFileDocUploadReq({
    req,
    session,
    db,
    storage: s3StorageService,
    docExtraction: bxDocExtraction,
  });
  return NextResponse.json(result)
}
