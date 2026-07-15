import type { StorageImage } from "../types";

export function hasCompleteStorageImageMetadata(image: StorageImage | null | undefined) {
  return Boolean(
    image?.bucketName &&
    image.objectPath &&
    image.mimeType?.startsWith("image/") &&
    Number.isFinite(Number(image.sizeBytes)) &&
    Number(image.sizeBytes) > 0
  );
}
