import { put, del } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";
import { GALLERY_PREFIX } from "@/constants/blob";

export async function PUT(request: NextRequest) {
  const token = request.cookies.get("admin_auth")?.value;
  if (token !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file") as File;
  const url = formData.get("url") as string;

  if (!file || !url) {
    return NextResponse.json({ error: "Missing file or URL" }, { status: 400 });
  }

  const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
  const MAX_SIZE_MB = 10;
  const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: "Invalid file type. Only JPEG, PNG and WebP are allowed." }, { status: 400 });
  }

  if (file.size > MAX_SIZE_BYTES) {
    return NextResponse.json({ error: `File too large. Maximum size is ${MAX_SIZE_MB}MB.` }, { status: 413 });
  }

  const blob = await put(`${GALLERY_PREFIX}${file.name}`, file, { access: "public" });
  await del(url);
  return NextResponse.json(blob);
}
