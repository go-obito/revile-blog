"use client";

import { useRef, useState, type ChangeEvent, type DragEvent } from "react";
import { FiLoader, FiUploadCloud } from "react-icons/fi";

const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_FILE_SIZE = 5 * 1024 * 1024;

type CoverImageUploaderProps = {
  name?: string;
  initialValue?: string;
  placeholder?: string;
};

export default function CoverImageUploader({
  name = "coverImageUrl",
  initialValue = "",
  placeholder = "/uploads/cover.jpg",
}: CoverImageUploaderProps) {
  const [value, setValue] = useState(initialValue);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const uploadFile = async (file: File | null) => {
    if (!file) return;

    if (!ALLOWED_TYPES.has(file.type)) {
      setError("Only PNG, JPG, and WebP images are supported.");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError("Image must be 5MB or smaller.");
      return;
    }

    try {
      setError("");
      setIsUploading(true);

      const authResponse = await fetch("/api/imagekit-auth", {
        method: "GET",
        headers: { accept: "application/json" },
      });

      if (!authResponse.ok) {
        const authPayload = await authResponse.json().catch(() => ({}));
        throw new Error(authPayload.error || "ImageKit authentication failed.");
      }

      const authData = await authResponse.json();
      const { token, expire, signature, publicKey, urlEndpoint } = authData;

      const formData = new FormData();
      formData.append("file", file);
      formData.append("fileName", file.name);
      formData.append("useUniqueFileName", "true");
      formData.append("folder", "/blog/covers");
      formData.append("publicKey", publicKey);
      formData.append("signature", signature);
      formData.append("expire", String(expire));
      formData.append("token", token);

      const uploadResponse = await fetch("https://upload.imagekit.io/api/v1/files/upload", {
        method: "POST",
        body: formData,
      });

      const uploadData = await uploadResponse.json().catch(() => ({}));
      if (!uploadResponse.ok) {
        throw new Error(uploadData.message || "Image upload failed.");
      }

      const uploadedUrl =
        uploadData.url ||
        (uploadData.filePath && urlEndpoint
          ? `${urlEndpoint.replace(/\/$/, "")}${uploadData.filePath.startsWith("/") ? uploadData.filePath : `/${uploadData.filePath}`}`
          : "");

      if (!uploadedUrl) {
        throw new Error("ImageKit did not return a usable URL.");
      }

      setValue(uploadedUrl);
      setError("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (uploadError) {
      const message = uploadError instanceof Error ? uploadError.message : "Upload failed.";
      setError(message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    const [file] = Array.from(event.dataTransfer.files ?? []);
    await uploadFile(file);
  };

  return (
    <div
      className={`space-y-2 rounded-xl border bg-white p-2 transition ${
        isDragging ? "border-blue-400 bg-blue-50" : error ? "border-red-200 bg-red-50" : "border-slate-200"
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          type="text"
          name={name}
          value={value}
          onChange={handleInputChange}
          placeholder={placeholder}
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-slate-900 outline-none transition focus:border-blue-400 focus:bg-white"
        />

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-blue-200 bg-blue-600 px-3 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isUploading ? (
            <>
              <FiLoader className="h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <FiUploadCloud className="h-4 w-4" />
              Upload Cover Image
            </>
          )}
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="hidden"
        onChange={(event) => {
          const [file] = Array.from(event.target.files ?? []);
          void uploadFile(file);
        }}
      />

      {error ? <p className="text-xs text-red-600">{error}</p> : null}
    </div>
  );
}
