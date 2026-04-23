import { list } from "@vercel/blob";
import { cacheTag } from "next/cache";
import { NextResponse } from "next/server";
import { GALLERY_PREFIX } from "@/constants/blob";

async function getPhotos() {
  "use cache";
  cacheTag("photos");
  const { blobs } = await list({ prefix: GALLERY_PREFIX });
  return blobs.filter((blob) => !blob.pathname.endsWith("/"));
}

export async function GET() {
  const photos = await getPhotos();
  return NextResponse.json(photos);
}
