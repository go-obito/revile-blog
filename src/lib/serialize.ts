export const SITE_NAME = "Revile Blog";
export const SITE_TAGLINE = "News and dispatches";

export function slugify(input: string) {
  const base = input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
  return base || "post";
}

export function excerptFrom(body: string, excerpt?: string) {
  if (excerpt?.trim()) return excerpt.trim();
  const plain = body.replace(/[#*_`>\-\[\]\(\)]/g, " ").replace(/\s+/g, " ").trim();
  return plain.slice(0, 180);
}

export type PublicPost = {
  id: string;
  title: string;
  slug: string;
  body: string;
  excerpt: string;
  coverImageUrl: string;
  tags: string[];
  status: "draft" | "published";
  viewCount: number;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export function serializePost(doc: {
  _id: { toString(): string };
  title: string;
  slug: string;
  body: string;
  excerpt: string;
  coverImageUrl: string;
  tags: string[];
  status: "draft" | "published";
  viewCount: number;
  publishedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}): PublicPost {
  return {
    id: doc._id.toString(),
    title: doc.title,
    slug: doc.slug,
    body: doc.body,
    excerpt: doc.excerpt,
    coverImageUrl: doc.coverImageUrl,
    tags: doc.tags,
    status: doc.status,
    viewCount: doc.viewCount,
    publishedAt: doc.publishedAt ? doc.publishedAt.toISOString() : null,
    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString(),
  };
}

export type PublicComment = {
  id: string;
  postId: string;
  authorName: string;
  body: string;
  status: "pending" | "approved" | "spam";
  createdAt: string;
};

export type AdminComment = PublicComment & { authorEmail: string };

export function serializeComment(
  doc: {
    _id: { toString(): string };
    postId: { toString(): string };
    authorName: string;
    authorEmail: string;
    body: string;
    status: "pending" | "approved" | "spam";
    createdAt: Date;
  },
  includeEmail: boolean,
): PublicComment | AdminComment {
  const base: PublicComment = {
    id: doc._id.toString(),
    postId: doc.postId.toString(),
    authorName: doc.authorName,
    body: doc.body,
    status: doc.status,
    createdAt: doc.createdAt.toISOString(),
  };
  if (includeEmail) {
    return { ...base, authorEmail: doc.authorEmail };
  }
  return base;
}

export function isSafeUploadPath(src: string) {
  return (
    src.startsWith("/api/uploads/") ||
    src.startsWith("https://") ||
    src.startsWith("http://")
  );
}
