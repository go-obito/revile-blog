import mongoose, { Schema } from "mongoose";

export type PostStatus = "draft" | "published";

export type PostDocument = mongoose.Document & {
  title: string;
  slug: string;
  body: string;
  excerpt: string;
  coverImageUrl: string;
  tags: string[];
  status: PostStatus;
  viewCount: number;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

const PostSchema = new Schema<PostDocument>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true, trim: true },
    body: { type: String, required: true },
    excerpt: { type: String, default: "" },
    coverImageUrl: { type: String, default: "" },
    tags: { type: [String], default: [] },
    status: { type: String, enum: ["draft", "published"], default: "draft" },
    viewCount: { type: Number, default: 0 },
    publishedAt: { type: Date, default: null },
  },
  { timestamps: true },
);

PostSchema.index({ status: 1, publishedAt: -1 });
PostSchema.index({ tags: 1 });

export const Post =
  mongoose.models.Post || mongoose.model<PostDocument>("Post", PostSchema);
