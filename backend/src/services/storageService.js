import { createHmac, randomUUID, timingSafeEqual } from "crypto";
import { mkdir, readFile, unlink, writeFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import AppError from "../utils/AppError.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LOCAL_VENDOR_IMAGE_DIR = process.env.VENDOR_IMAGE_DIR
  ? path.resolve(process.env.VENDOR_IMAGE_DIR)
  : path.resolve(__dirname, "../../../frontend/public/uploads/vendor-images");
const LOCAL_VENDOR_IMAGE_BUCKET = "local-vendor-images";
const LOCAL_VENDOR_IMAGE_PREFIX = "/uploads/vendor-images";
const DEFAULT_VENDOR_IMAGE_BUCKET = "vendor-images";
const STORAGE_IMAGE_ROUTE = "/api/storage/images";
const UUID_PATTERN = /^[0-9a-f-]{36}$/i;

function cleanEnv(value) {
  return String(value || "").trim();
}

function storageMode() {
  return cleanEnv(process.env.SUPABASE_STORAGE_MODE || "auto").toLowerCase();
}

function normalizeSupabaseUrl(value) {
  const normalized = cleanEnv(value).replace(/\/+$/, "");
  return /^https?:\/\//i.test(normalized) ? normalized : "";
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
  const supabaseUrl = normalizeSupabaseUrl(process.env.SUPABASE_URL || process.env.supabaseUrl);
  const serviceRoleKey = cleanEnv(process.env.SUPABASE_SERVICE_ROLE_KEY);
  const bucketName = cleanEnv(process.env.SUPABASE_STORAGE_BUCKET) || DEFAULT_VENDOR_IMAGE_BUCKET;

  return {
    supabaseUrl,
    serviceRoleKey,
    bucketName,
    configured: Boolean(supabaseUrl && serviceRoleKey && bucketName),
  };
}

function getStorageUrlSigningSecret() {
  const secret = cleanEnv(process.env.STORAGE_URL_SIGNING_SECRET || process.env.JWT_ACCESS_SECRET);
  if (!secret) {
    throw new AppError("Storage URL signing is not configured.", 500);
  }
  return secret;
}

function storageImageDescriptor(storageImage) {
  const bucketName = cleanEnv(storageImage?.bucketName ?? storageImage?.bucket_name);
  const objectPath = cleanEnv(storageImage?.objectPath ?? storageImage?.object_path);
  if (!bucketName || !objectPath) return null;

  const hasUnsafePathSegment = objectPath
    .replace(/\\/g, "/")
    .split("/")
    .some((segment) => segment === ".." || segment === "." || !segment);
  if (hasUnsafePathSegment) {
    throw new AppError("Invalid storage image path.", 400);
  }

  return { bucketName, objectPath };
}

function signStorageImageDescriptor(descriptor) {
  const payload = Buffer.from(JSON.stringify([descriptor.bucketName, descriptor.objectPath])).toString("base64url");
  const signature = createHmac("sha256", getStorageUrlSigningSecret()).update(payload).digest("hex");
  return `${payload}.${signature}`;
}

function storageImageDescriptorFromToken(token) {
  const [payload, providedSignature, ...extra] = String(token || "").split(".");
  if (!payload || !providedSignature || extra.length || !/^[a-f0-9]{64}$/i.test(providedSignature)) {
    throw new AppError("Storage image was not found.", 404);
  }

  const expectedSignature = createHmac("sha256", getStorageUrlSigningSecret()).update(payload).digest("hex");
  const providedBuffer = Buffer.from(providedSignature, "hex");
  const expectedBuffer = Buffer.from(expectedSignature, "hex");
  if (providedBuffer.length !== expectedBuffer.length || !timingSafeEqual(providedBuffer, expectedBuffer)) {
    throw new AppError("Storage image was not found.", 404);
  }

  let decoded;
  try {
    decoded = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
  } catch {
    throw new AppError("Storage image was not found.", 404);
  }

  const descriptor = Array.isArray(decoded)
    ? storageImageDescriptor({ bucketName: decoded[0], objectPath: decoded[1] })
    : null;
  if (!descriptor) throw new AppError("Storage image was not found.", 404);
  return descriptor;
}

export function storageImageUrlFromMetadata(storageImage, { baseUrl = "" } = {}) {
  const descriptor = storageImageDescriptor(storageImage);
  if (!descriptor) return null;
  const relativeUrl = `${STORAGE_IMAGE_ROUTE}/${signStorageImageDescriptor(descriptor)}`;
  return baseUrl ? absoluteUploadUrl(baseUrl, relativeUrl) : relativeUrl;
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

async function uploadSupabaseVendorImage({ file, ownerId, altText, baseUrl }) {
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

  const storageImage = {
    bucketName,
    objectPath,
    mimeType: file.mimetype,
    sizeBytes: file.size,
    altText: altText || "",
  };
  const displayUrl = storageImageUrlFromMetadata(storageImage, { baseUrl });
  return {
    url: displayUrl,
    storageImage: {
      ...storageImage,
      publicUrl: displayUrl,
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
    return uploadSupabaseVendorImage({ file, ownerId, altText, baseUrl });
  }

  return uploadLocalVendorImage({ file, ownerId, altText, baseUrl });
}

function localImageContentType(objectPath) {
  const extension = path.extname(objectPath).toLowerCase();
  return {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".webp": "image/webp",
    ".gif": "image/gif",
  }[extension] || "application/octet-stream";
}

export async function downloadStoredImage(token) {
  const { bucketName, objectPath } = storageImageDescriptorFromToken(token);

  if (bucketName === LOCAL_VENDOR_IMAGE_BUCKET) {
    if (!objectPath.startsWith("vendor-images/")) {
      throw new AppError("Storage image was not found.", 404);
    }
    const filename = path.basename(objectPath);
    const diskPath = path.resolve(LOCAL_VENDOR_IMAGE_DIR, filename);
    if (path.dirname(diskPath) !== path.resolve(LOCAL_VENDOR_IMAGE_DIR)) {
      throw new AppError("Storage image was not found.", 404);
    }
    try {
      return { body: await readFile(diskPath), contentType: localImageContentType(objectPath) };
    } catch (error) {
      if (error?.code === "ENOENT") throw new AppError("Storage image was not found.", 404);
      throw error;
    }
  }

  const { supabaseUrl, serviceRoleKey, configured } = getSupabaseStorageConfig();
  if (!configured) {
    throw new AppError("Supabase Storage is not configured for image delivery.", 503);
  }

  const downloadUrl = `${supabaseUrl}/storage/v1/object/authenticated/${encodeURIComponent(bucketName)}/${encodeObjectPath(objectPath)}`;
  const response = await fetch(downloadUrl, {
    headers: {
      Authorization: `Bearer ${serviceRoleKey}`,
      apikey: serviceRoleKey,
    },
  });
  if (response.status === 404) throw new AppError("Storage image was not found.", 404);
  if (!response.ok) throw new AppError("Supabase Storage image delivery failed.", 502);

  const contentType = cleanEnv(response.headers.get("content-type"));
  if (contentType && !contentType.toLowerCase().startsWith("image/")) {
    throw new AppError("Stored object is not an image.", 502);
  }

  return {
    body: Buffer.from(await response.arrayBuffer()),
    contentType: contentType || "application/octet-stream",
  };
}

export async function deleteStoredImage(storageImage) {
  const bucketName = storageImage?.bucketName ?? storageImage?.bucket_name;
  const objectPath = storageImage?.objectPath ?? storageImage?.object_path;
  if (!bucketName || !objectPath) return;

  if (bucketName === LOCAL_VENDOR_IMAGE_BUCKET) {
    const filename = path.basename(objectPath);
    const diskPath = path.resolve(LOCAL_VENDOR_IMAGE_DIR, filename);
    const isInsideImageDirectory = path.dirname(diskPath) === path.resolve(LOCAL_VENDOR_IMAGE_DIR);
    if (!isInsideImageDirectory) {
      throw new AppError("Invalid local image path.", 500);
    }
    await unlink(diskPath).catch((error) => {
      if (error?.code !== "ENOENT") throw error;
    });
    return;
  }

  const { supabaseUrl, serviceRoleKey, configured } = getSupabaseStorageConfig();
  if (!configured) {
    throw new AppError("Supabase Storage is not configured for image cleanup.", 503);
  }

  const deleteUrl = `${supabaseUrl}/storage/v1/object/${encodeURIComponent(bucketName)}/${encodeObjectPath(objectPath)}`;
  const response = await fetch(deleteUrl, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${serviceRoleKey}`,
      apikey: serviceRoleKey,
    },
  });

  if (!response.ok && response.status !== 404) {
    throw new AppError("Supabase Storage cleanup failed.", 502);
  }
}
