import { list } from "@vercel/blob";
import { NextResponse } from "next/server";

export async function GET() {
  const { blobs } = await list({ prefix: "gallery/" });
  const photos = blobs.filter((blob) => !blob.pathname.endsWith("/"));
  return NextResponse.json(photos);
}
