import { del } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(request: NextRequest) {
  const { url } = await request.json();

  if (!url) {
    return NextResponse.json({ error: "No URL provided" }, { status: 400 });
  }

  await del(url);
  return NextResponse.json({ success: true });
}
