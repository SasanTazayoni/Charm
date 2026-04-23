import { put } from "@vercel/blob";
import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { GALLERY_PREFIX } from "@/constants/blob";
import { validateImageFile } from "@/lib/validateImageFile";

export async function POST(request: NextRequest) {
  const token = request.cookies.get("admin_auth")?.value;
  if (token !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const validationError = validateImageFile(file);
  if (validationError) return validationError;

  const blob = await put(`${GALLERY_PREFIX}${file.name}`, file, { access: "public" });
  revalidateTag("photos", {});
  return NextResponse.json(blob);
}
