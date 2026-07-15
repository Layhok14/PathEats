import { describe, expect, it } from "vitest";
import { normalizeStorageImageInput } from "./storageImageMetadata.js";

describe("storage image metadata", () => {
  it("preserves the byte size required for an image update", () => {
    expect(normalizeStorageImageInput({
      storageImage: {
        bucketName: "images",
        objectPath: "vendor/user-id/photo.jpg",
        mimeType: "image/jpeg",
        sizeBytes: 2048,
      },
    })).toMatchObject({
      bucketName: "images",
      objectPath: "vendor/user-id/photo.jpg",
      mimeType: "image/jpeg",
      sizeBytes: 2048,
    });
  });

  it("rejects incomplete metadata instead of persisting an invalid size", () => {
    expect(() => normalizeStorageImageInput({
      storageImage: {
        bucketName: "images",
        objectPath: "vendor/user-id/photo.jpg",
        mimeType: "image/jpeg",
      },
    })).toThrow("Storage image size must be a positive number of bytes");
  });
});
