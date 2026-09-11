import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { Post } from "@/lib/models/Post";
import { serializePost, slugify, excerptFrom } from "@/lib/serialize";
import { sanitizeHtml, sanitizePlainText } from "@/lib/sanitize";

const DEFAULT_LIMIT = 10;

function getFormValue(form: FormData, key: string) {
  const value = form.get(key);
  return typeof value === "string" ? value : "";
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const session = await getSession();
  const status = url.searchParams.get("status");
  const tag = url.searchParams.get("tag")?.trim();
  const page = Number(url.searchParams.get("page") ?? "1") || 1;
  const limit = Math.min(Number(url.searchParams.get("limit") ?? String(DEFAULT_LIMIT)) || DEFAULT_LIMIT, 50);

  await dbConnect();

  const query: Record<string, unknown> = {};
  if (session) {
    if (status === "draft" || status === "published") {
      query.status = status;
    }
  } else {
    query.status = "published";
  }

  if (tag) {
    query.tags = tag;
  }

  const total = await Post.countDocuments(query);
  const posts = await Post.find(query)
    .sort({ publishedAt: -1, createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .lean();

  return NextResponse.json({
    posts: posts.map((post) => serializePost(post as Parameters<typeof serializePost>[0])),
    total,
    page,
    totalPages: Math.max(1, Math.ceil(total / limit)),
    limit,
  });
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const form = await request.formData();
  const intent = getFormValue(form, "intent");
  const id = getFormValue(form, "id");

  if (intent === "delete" || getFormValue(form, "_method") === "DELETE") {
    if (!id) {
      return NextResponse.json({ error: "Missing post id" }, { status: 400 });
    }
    await dbConnect();
    await Post.findByIdAndDelete(id);
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  if (intent === "update" || id) {
    const title = sanitizePlainText(getFormValue(form, "title"), 200);
    const inputSlug = sanitizePlainText(getFormValue(form, "slug"), 120);
    const body = sanitizeHtml(getFormValue(form, "body"));
    const excerpt = sanitizePlainText(getFormValue(form, "excerpt") || excerptFrom(getFormValue(form, "body")), 240);
    const coverImageUrl = sanitizePlainText(getFormValue(form, "coverImageUrl") || "", 500);
    const tags = getFormValue(form, "tags")
      .split(",")
      .map((tag) => tag.trim().toLowerCase())
      .filter(Boolean)
      .slice(0, 12);
    const status = getFormValue(form, "status") === "published" ? "published" : "draft";

    if (!id) {
      return NextResponse.json({ error: "Missing post id" }, { status: 400 });
    }

    await dbConnect();
    const post = await Post.findById(id);
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const slug = slugify(inputSlug || title || post.slug);
    await Post.findByIdAndUpdate(id, {
      title,
      slug,
      body,
      excerpt,
      coverImageUrl,
      tags,
      status,
      publishedAt: status === "published" && !post.publishedAt ? new Date() : post.publishedAt ?? null,
    });

    return NextResponse.redirect(new URL("/admin", request.url));
  }

  const body = getFormValue(form, "body");
  const title = sanitizePlainText(getFormValue(form, "title"), 200);
  const inputSlug = sanitizePlainText(getFormValue(form, "slug"), 120);
  const rawExcerpt = sanitizePlainText(getFormValue(form, "excerpt") || excerptFrom(body), 240);
  const coverImageUrl = sanitizePlainText(getFormValue(form, "coverImageUrl") || "", 500);
  const tags = getFormValue(form, "tags")
    .split(",")
    .map((tag) => tag.trim().toLowerCase())
    .filter(Boolean)
    .slice(0, 12);
  const status = getFormValue(form, "status") === "published" ? "published" : "draft";
  const slug = slugify(inputSlug || title);

  await dbConnect();

  await Post.create({
    title,
    slug,
    body: sanitizeHtml(body),
    excerpt: rawExcerpt,
    coverImageUrl,
    tags,
    status,
    publishedAt: status === "published" ? new Date() : null,
  });

  return NextResponse.redirect(new URL("/admin", request.url));
}

export async function PUT(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const form = await request.formData();
  const id = getFormValue(form, "id");
  const title = sanitizePlainText(getFormValue(form, "title"), 200);
  const inputSlug = sanitizePlainText(getFormValue(form, "slug"), 120);
  const body = sanitizeHtml(getFormValue(form, "body"));
  const excerpt = sanitizePlainText(getFormValue(form, "excerpt") || excerptFrom(body), 240);
  const coverImageUrl = sanitizePlainText(getFormValue(form, "coverImageUrl") || "", 500);
  const tags = getFormValue(form, "tags")
    .split(",")
    .map((tag) => tag.trim().toLowerCase())
    .filter(Boolean)
    .slice(0, 12);
  const status = getFormValue(form, "status") === "published" ? "published" : "draft";

  if (!id) {
    return NextResponse.json({ error: "Missing post id" }, { status: 400 });
  }

  await dbConnect();
  const post = await Post.findById(id);
  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  const slug = slugify(inputSlug || title || post.slug);
  await Post.findByIdAndUpdate(id, {
    title,
    slug,
    body,
    excerpt,
    coverImageUrl,
    tags,
    status,
    publishedAt: status === "published" && !post.publishedAt ? new Date() : post.publishedAt ?? null,
  });

  return NextResponse.redirect(new URL("/admin", request.url));
}

export async function DELETE(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const form = await request.formData();
  const id = getFormValue(form, "id");

  if (!id) {
    return NextResponse.json({ error: "Missing post id" }, { status: 400 });
  }

  await dbConnect();
  await Post.findByIdAndDelete(id);
  return NextResponse.redirect(new URL("/admin", request.url));
}
