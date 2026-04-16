import { del } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(request: NextRequest) {
  const token = request.cookies.get("admin_auth")?.value;
  if (token !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { url?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
  const { url } = body;

  if (!url || typeof url !== "string") {
    return NextResponse.json({ error: "No URL provided" }, { status: 400 });
  }

  try {
    await del(url);
  } catch (error) {
    console.error("Blob delete failed:", error);
    return NextResponse.json({ error: "Failed to delete photo" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
