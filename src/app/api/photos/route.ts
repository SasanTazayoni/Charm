import { list } from "@vercel/blob";
import { NextResponse } from "next/server";
import { GALLERY_PREFIX } from "@/constants/blob";

export async function GET() {
  const { blobs } = await list({ prefix: GALLERY_PREFIX });
  const photos = blobs.filter((blob) => !blob.pathname.endsWith("/"));
  return NextResponse.json(photos);
}
