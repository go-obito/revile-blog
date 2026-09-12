import { NextResponse } from "next/server";
import { createHmac, randomUUID } from "node:crypto";

export async function GET() {
  const publicKey = process.env.IMAGEKIT_PUBLIC_KEY;
  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
  const urlEndpoint = process.env.IMAGEKIT_URL_ENDPOINT;

  if (!publicKey || !privateKey || !urlEndpoint) {
    return NextResponse.json(
      { error: "ImageKit environment variables are not configured." },
      { status: 500 },
    );
  }

  const expire = Math.floor(Date.now() / 1000) + 60 * 60;
  const token = randomUUID();
  const signature = createHmac("sha1", privateKey)
    .update(`${token}${expire}`)
    .digest("hex");

  return NextResponse.json({
    token,
    expire,
    signature,
    publicKey,
    urlEndpoint,
  });
}
