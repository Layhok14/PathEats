import AppError from "./AppError.js";

const hasOwn = (value, key) => Object.prototype.hasOwnProperty.call(value, key);

const readFirst = (source, keys) => {
  if (!source || typeof source !== "object") return undefined;

  for (const key of keys) {
    if (hasOwn(source, key) && source[key] !== undefined) {
      return source[key];
    }
  }

  return undefined;
};

const asTrimmedString = (value) => {
  if (value === undefined || value === null) return "";
  return String(value).trim();
};

const hasStorageFields = (payload) => {
  if (!payload || typeof payload !== "object") return false;

  return [
    "bucketName",
    "bucket_name",
    "imageBucket",
    "image_bucket",
    "storageBucket",
    "storage_bucket",
    "objectPath",
    "object_path",
    "imagePath",
    "image_path",
    "storagePath",
    "storage_path",
    "mimeType",
    "mime_type",
    "sizeBytes",
    "size_bytes",
  ].some((key) => hasOwn(payload, key));
};

const getRawStorageImage = (payload) => {
  if (!payload || typeof payload !== "object") return null;
  if (payload.storageImage !== undefined) return payload.storageImage;
  if (payload.storage_image !== undefined) return payload.storage_image;
  return hasStorageFields(payload) ? payload : null;
};

const hasExplicitStorageImageInput = (payload) =>
  Boolean(payload && typeof payload === "object" && (hasOwn(payload, "storageImage") || hasOwn(payload, "storage_image")));

const isStorageImageClear = (payload) =>
  Boolean(payload && typeof payload === "object" && (payload.storageImage === null || payload.storage_image === null));

export const hasStorageImageInput = (payload) =>
  hasExplicitStorageImageInput(payload) || Boolean(getRawStorageImage(payload));

export const imageDisplayUrlFromStorageInput = (payload, fallbackUrlKeys = []) => {
  if (isStorageImageClear(payload)) return null;

  const rawImage = getRawStorageImage(payload);
  if (!rawImage) return undefined;

  const bucketName = asTrimmedString(
    readFirst(rawImage, ["bucketName", "bucket_name", "imageBucket", "image_bucket", "storageBucket", "storage_bucket"])
  );
  const objectPath = asTrimmedString(
    readFirst(rawImage, ["objectPath", "object_path", "imagePath", "image_path", "storagePath", "storage_path"])
  );

  if (bucketName === "local-vendor-images" && objectPath.startsWith("vendor-images/")) {
    const fileName = objectPath.split("/").pop();
    return fileName ? `/uploads/vendor-images/${fileName}` : null;
  }

  const explicitUrl = asTrimmedString(
    readFirst(rawImage, ["publicUrl", "public_url", "signedUrl", "signed_url", "url"]) ||
      readFirst(payload, fallbackUrlKeys)
  );

  if (!explicitUrl) return null;

  if (!/^(https?:\/\/|\/[^/])/i.test(explicitUrl)) {
    throw new AppError("Storage image display URL must be http(s) or application-relative.", 400);
  }

  return explicitUrl;
};

export const normalizeStorageImageInput = (payload, defaultBucketName) => {
  const rawImage = getRawStorageImage(payload);
  if (!rawImage) return null;

  const bucketName = asTrimmedString(
    readFirst(rawImage, ["bucketName", "bucket_name", "imageBucket", "image_bucket", "storageBucket", "storage_bucket"]) ||
      defaultBucketName
  );
  const objectPath = asTrimmedString(
    readFirst(rawImage, ["objectPath", "object_path", "imagePath", "image_path", "storagePath", "storage_path"])
  );
  const mimeType = asTrimmedString(readFirst(rawImage, ["mimeType", "mime_type", "imageMimeType", "image_mime_type"]));
  const sizeBytes = Number(readFirst(rawImage, ["sizeBytes", "size_bytes", "imageSizeBytes", "image_size_bytes"]));
  const altText = asTrimmedString(readFirst(rawImage, ["altText", "alt_text", "imageAltText", "image_alt_text"]));
  const sortOrder = Number(readFirst(rawImage, ["sortOrder", "sort_order"]) ?? 0);

  if (!bucketName) {
    throw new AppError("Storage image bucket name is required.", 400);
  }

  if (!objectPath) {
    throw new AppError("Storage image object path is required.", 400);
  }

  if (!mimeType || !mimeType.startsWith("image/")) {
    throw new AppError("Storage image MIME type must start with image/.", 400);
  }

  if (!Number.isFinite(sizeBytes) || sizeBytes <= 0) {
    throw new AppError("Storage image size must be a positive number of bytes.", 400);
  }

  return {
    bucketName,
    objectPath,
    mimeType,
    sizeBytes,
    altText: altText || null,
    sortOrder: Number.isFinite(sortOrder) && sortOrder >= 0 ? sortOrder : 0,
  };
};

const upsertPrimaryImage = async ({
  client,
  tableName,
  ownerColumn,
  ownerId,
  payload,
  defaultBucketName,
  uploadedBy,
  conflictMessage,
}) => {
  if (isStorageImageClear(payload)) {
    await client.query(
      `DELETE FROM ${tableName}
       WHERE ${ownerColumn}::text = $1 AND is_primary = TRUE`,
      [ownerId]
    );
    return null;
  }

  const image = normalizeStorageImageInput(payload, defaultBucketName);
  if (!image) return null;

  await client.query(
    `UPDATE ${tableName}
     SET is_primary = FALSE, updated_at = NOW()
     WHERE ${ownerColumn}::text = $1 AND is_primary = TRUE`,
    [ownerId]
  );

  const { rows } = await client.query(
    `INSERT INTO ${tableName} (
       ${ownerColumn}, bucket_name, object_path, uploaded_by,
       mime_type, size_bytes, alt_text, sort_order, is_primary
     )
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, TRUE)
     ON CONFLICT (bucket_name, object_path)
     DO UPDATE SET
       mime_type = EXCLUDED.mime_type,
       size_bytes = EXCLUDED.size_bytes,
       alt_text = EXCLUDED.alt_text,
       sort_order = EXCLUDED.sort_order,
       is_primary = TRUE,
       uploaded_by = COALESCE(EXCLUDED.uploaded_by, ${tableName}.uploaded_by),
       updated_at = NOW()
     WHERE ${tableName}.${ownerColumn}::text = EXCLUDED.${ownerColumn}::text
     RETURNING *`,
    [
      ownerId,
      image.bucketName,
      image.objectPath,
      uploadedBy || null,
      image.mimeType,
      image.sizeBytes,
      image.altText,
      image.sortOrder,
    ]
  );

  if (!rows.length) {
    throw new AppError(conflictMessage, 409);
  }

  return rows[0];
};

export const upsertPrimaryPlaceImage = (client, placeId, payload, uploadedBy = null) =>
  upsertPrimaryImage({
    client,
    tableName: "place_images",
    ownerColumn: "place_id",
    ownerId: placeId,
    payload,
    defaultBucketName: "place-images",
    uploadedBy,
    conflictMessage: "Storage image already belongs to another place.",
  });

export const upsertPrimaryMenuItemImage = (client, menuItemId, payload, uploadedBy = null) =>
  upsertPrimaryImage({
    client,
    tableName: "menu_item_images",
    ownerColumn: "menu_item_id",
    ownerId: menuItemId,
    payload,
    defaultBucketName: "menu-item-images",
    uploadedBy,
    conflictMessage: "Storage image already belongs to another menu item.",
  });
