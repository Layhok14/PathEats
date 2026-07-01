import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import AppError from "../utils/AppError.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LOCAL_VENDOR_IMAGE_DIR = path.resolve(__dirname, "../../uploads/vendor-images");
const LOCAL_VENDOR_IMAGE_BUCKET = "local-vendor-images";
const LOCAL_VENDOR_IMAGE_PREFIX = "/api/uploads/vendor-images";
const DEFAULT_VENDOR_IMAGE_BUCKET = "vendor-images";
const UUID_PATTERN = /^[0-9a-f-]{36}$/i;

function cleanEnv(value) {
  return String(value || "").trim();
}

function storageMode() {
  return cleanEnv(process.env.SUPABASE_STORAGE_MODE || "auto").toLowerCase();
}

function normalizeSupabaseUrl(value) {
  return cleanEnv(value).replace(/\/+$/, "");
}

function imageExtension(file) {
  const byType = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
    "image/gif": ".gif",
  };
  return byType[file.mimetype] || ".img";
}

function safePathSegment(value) {
  const raw = cleanEnv(value);
  if (UUID_PATTERN.test(raw)) return raw;
  return raw.replace(/[^a-zA-Z0-9_-]/g, "-").slice(0, 64) || "vendor";
}

function encodeObjectPath(objectPath) {
  return objectPath.split("/").map(encodeURIComponent).join("/");
}

function getSupabaseStorageConfig() {
  const supabaseUrl = normalizeSupabaseUrl(process.env.SUPABASE_URL);
  const serviceRoleKey = cleanEnv(process.env.SUPABASE_SERVICE_ROLE_KEY);
  const bucketName = cleanEnv(process.env.SUPABASE_STORAGE_BUCKET) || DEFAULT_VENDOR_IMAGE_BUCKET;

  return {
    supabaseUrl,
    serviceRoleKey,
    bucketName,
    configured: Boolean(supabaseUrl && serviceRoleKey && bucketName),
  };
}

export function isSupabaseStorageConfigured() {
  return getSupabaseStorageConfig().configured;
}

function assertValidStorageMode(mode) {
  if (!["auto", "local", "supabase"].includes(mode)) {
    throw new AppError("SUPABASE_STORAGE_MODE must be auto, local, or supabase.", 500);
  }
}

function absoluteUploadUrl(baseUrl, relativeUrl) {
  return `${String(baseUrl || "").replace(/\/+$/, "")}${relativeUrl}`;
}

async function uploadLocalVendorImage({ file, ownerId, altText, baseUrl }) {
  await mkdir(LOCAL_VENDOR_IMAGE_DIR, { recursive: true });

  const ownerSegment = safePathSegment(ownerId);
  const filename = `${ownerSegment}-${Date.now()}-${randomUUID()}${imageExtension(file)}`;
  const diskPath = path.join(LOCAL_VENDOR_IMAGE_DIR, filename);
  await writeFile(diskPath, file.buffer, { flag: "wx" });

  return {
    url: absoluteUploadUrl(baseUrl, `${LOCAL_VENDOR_IMAGE_PREFIX}/${filename}`),
    storageImage: {
      bucketName: LOCAL_VENDOR_IMAGE_BUCKET,
      objectPath: `vendor-images/${filename}`,
      mimeType: file.mimetype,
      sizeBytes: file.size,
      altText: altText || "",
    },
  };
}

async function uploadSupabaseVendorImage({ file, ownerId, altText }) {
  const { supabaseUrl, serviceRoleKey, bucketName, configured } = getSupabaseStorageConfig();
  if (!configured) {
    throw new AppError("Supabase Storage is not configured for image uploads.", 503);
  }

  const ownerSegment = safePathSegment(ownerId);
  const objectPath = `vendor/${ownerSegment}/${Date.now()}-${randomUUID()}${imageExtension(file)}`;
  const encodedBucket = encodeURIComponent(bucketName);
  const encodedObjectPath = encodeObjectPath(objectPath);
  const uploadUrl = `${supabaseUrl}/storage/v1/object/${encodedBucket}/${encodedObjectPath}`;

  const response = await fetch(uploadUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${serviceRoleKey}`,
      apikey: serviceRoleKey,
      "Content-Type": file.mimetype,
      "x-upsert": "false",
    },
    body: file.buffer,
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    const detail = body ? ` ${body.slice(0, 200)}` : "";
    throw new AppError(`Supabase Storage upload failed.${detail}`, 502);
  }

  const publicUrl = `${supabaseUrl}/storage/v1/object/public/${encodedBucket}/${encodedObjectPath}`;
  return {
    url: publicUrl,
    storageImage: {
      bucketName,
      objectPath,
      mimeType: file.mimetype,
      sizeBytes: file.size,
      altText: altText || "",
      publicUrl,
    },
  };
}

export async function uploadVendorImage({ file, ownerId, altText = "", baseUrl = "" }) {
  if (!file?.buffer || !file?.mimetype || !file?.size) {
    throw new AppError("Image file is required", 400);
  }

  const mode = storageMode();
  assertValidStorageMode(mode);

  if (mode === "supabase" || (mode === "auto" && isSupabaseStorageConfigured())) {
    return uploadSupabaseVendorImage({ file, ownerId, altText });
  }

  return uploadLocalVendorImage({ file, ownerId, altText, baseUrl });
}
