import mongoose, { Schema } from "mongoose";

export type AnalyticsEventType =
  | "page_view"
  | "comment"
  | "post_publish"
  | "post_update";

export type AnalyticsEventDocument = mongoose.Document & {
  type: AnalyticsEventType;
  path: string;
  postId?: mongoose.Types.ObjectId | null;
  sessionId?: string | null;
  visitorId?: string | null;
  referrer?: string | null;
  userAgent?: string | null;
  createdAt: Date;
};

const AnalyticsEventSchema = new Schema<AnalyticsEventDocument>(
  {
    type: {
      type: String,
      enum: ["page_view", "comment", "post_publish", "post_update"],
      required: true,
      index: true,
    },
    path: { type: String, required: true, trim: true },
    postId: { type: Schema.Types.ObjectId, ref: "Post", default: null },
    sessionId: { type: String, default: null },
    visitorId: { type: String, default: null },
    referrer: { type: String, default: null, maxlength: 500 },
    userAgent: { type: String, default: null, maxlength: 500 },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: false },
);

AnalyticsEventSchema.index({ createdAt: -1 });
AnalyticsEventSchema.index({ type: 1, createdAt: -1 });
AnalyticsEventSchema.index({ path: 1, createdAt: -1 });
AnalyticsEventSchema.index({ postId: 1, createdAt: -1 });
AnalyticsEventSchema.index({ visitorId: 1, createdAt: -1 });

export const AnalyticsEvent =
  mongoose.models.AnalyticsEvent ||
  mongoose.model<AnalyticsEventDocument>("AnalyticsEvent", AnalyticsEventSchema);
