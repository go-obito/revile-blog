import mongoose, { Schema } from "mongoose";

export type CommentStatus = "pending" | "approved" | "spam";

export type CommentDocument = mongoose.Document & {
  postId: mongoose.Types.ObjectId;
  authorName: string;
  authorEmail: string;
  body: string;
  status: CommentStatus;
  createdAt: Date;
};

const CommentSchema = new Schema<CommentDocument>(
  {
    postId: { type: Schema.Types.ObjectId, ref: "Post", required: true, index: true },
    authorName: { type: String, required: true, trim: true, maxlength: 80 },
    authorEmail: { type: String, required: true, trim: true, maxlength: 200 },
    body: { type: String, required: true, maxlength: 2000 },
    status: {
      type: String,
      enum: ["pending", "approved", "spam"],
      default: "pending",
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

export const Comment =
  mongoose.models.Comment ||
  mongoose.model<CommentDocument>("Comment", CommentSchema);
