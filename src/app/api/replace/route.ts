import { put, del } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";
import { GALLERY_PREFIX } from "@/constants/blob";
import { validateImageFile } from "@/lib/validateImageFile";

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

  const validationError = validateImageFile(file);
  if (validationError) return validationError;

  try {
    const blob = await put(`${GALLERY_PREFIX}${file.name}`, file, { access: "public" });
    await del(url);
    return NextResponse.json(blob);
  } catch (error) {
    console.error("Blob replace failed:", error);
    return NextResponse.json({ error: "Failed to replace photo" }, { status: 500 });
  }
}
