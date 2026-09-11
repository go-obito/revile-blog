import { NextResponse } from "next/server";
import { writeFile, mkdir } from "node:fs/promises";
import { join } from "node:path";
import { randomUUID } from "node:crypto";
import { dbConnect } from "@/lib/db";
import { getSession } from "@/lib/auth";

const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const maxBytes = 5 * 1024 * 1024;

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Missing file" }, { status: 400 });
  }

  if (!allowedTypes.has(file.type)) {
    return NextResponse.json({ error: "Only JPG, PNG, WEBP, and GIF uploads are allowed." }, { status: 400 });
  }

  if (file.size > maxBytes) {
    return NextResponse.json({ error: "Image must be under 5MB." }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const targetDir = join(process.cwd(), "public", "uploads");
  await mkdir(targetDir, { recursive: true });

  const ext = file.name.split(".").pop()?.toLowerCase() || "png";
  const fileName = `${randomUUID()}.${ext}`;
  const savePath = join(targetDir, fileName);
  await writeFile(savePath, buffer);

  await dbConnect();
  return NextResponse.json({ url: `/uploads/${fileName}` });
}
