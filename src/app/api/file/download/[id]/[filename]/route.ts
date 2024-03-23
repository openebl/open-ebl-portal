import { NextResponse, type NextRequest } from "next/server";

import { getServerAuthSession } from "@/server/auth";
import { env } from "@/env";

export async function GET(req: NextRequest, { params }: { params: { id: string, filename: string } }) {
  const { id, filename } = params;
  const session = await getServerAuthSession();
  if (!session) return new NextResponse("No Permission", { status: 401 });
  if (!id || !filename) return new NextResponse("No ID or filename", { status: 400 });

  // use fetch to get a response
  const response = await fetch(`${env.BU_SERVER_URL}/ebl/${id}/document`, {
    method: 'GET',
    headers: {
      'accept': 'application/octet-stream',
      'Authorization': `Bearer ${env.BU_SERVER_API_KEY}`,
      'X-Business-Unit-ID': String(session.platform.platformId),
    },
  })

  if (response.ok) {
    return new NextResponse(response.body, {
      headers: {
        ...response.headers, // copy the previous headers
        "content-disposition": `attachment; filename="${filename}"`,
      },
    });
  } else {
    throw new Error(`Failed to download EBL document: ${await response.text()}`);
  }
}
