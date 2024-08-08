import { eq } from "drizzle-orm";
import { NextResponse, type NextRequest } from "next/server";

import { DocFiles } from "@/drizzle/schema";
import { getServerAuthSession } from "@/server/auth";
import { db } from "@/server/db";
import { s3StorageService } from "@/server/services/storage-service";

export async function GET(req: NextRequest, { params }: { params: { uuid: string } }) {
  const { uuid } = params;
  const session = await getServerAuthSession();
  if (!session) return new NextResponse("No Permission", { status: 401 });
  if (!uuid) return new NextResponse("No uuid", { status: 400 });
  // get docFile by uuid from db
  const docFile = await db.query.DocFiles.findFirst({
    where: eq(DocFiles.uuid, uuid),
  });
  if (!docFile) return new NextResponse("No docFile found", { status: 404 });

  const key = docFile.storagekey ?? "";
  const filename = docFile.filename ?? "";

  const url = await s3StorageService.downloadToBrowser({ key, filename });
  if (url) {
    return NextResponse.redirect(url, { status: 301 });
  } else {
    throw new Error(`Failed to download EBL document`);
  }
}
