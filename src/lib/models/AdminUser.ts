import mongoose, { Schema } from "mongoose";

export type AdminUserDocument = mongoose.Document & {
  email: string;
  passwordHash: string;
  createdAt: Date;
};

const AdminUserSchema = new Schema<AdminUserDocument>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

export const AdminUser =
  mongoose.models.AdminUser ||
  mongoose.model<AdminUserDocument>("AdminUser", AdminUserSchema);
