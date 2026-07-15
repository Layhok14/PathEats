import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  downloadStoredImage,
  isSupabaseStorageConfigured,
  storageImageUrlFromMetadata,
} from "./storageService.js";

const originalEnv = { ...process.env };

describe("storage image delivery", () => {
  beforeEach(() => {
    process.env.SUPABASE_URL = "https://project.supabase.co";
    process.env.SUPABASE_SERVICE_ROLE_KEY = "test-service-key";
    process.env.SUPABASE_STORAGE_BUCKET = "images";
    process.env.JWT_ACCESS_SECRET = "test-signing-secret";
  });

  afterEach(() => {
    process.env = { ...originalEnv };
    vi.restoreAllMocks();
  });

  it("rejects a database connection string as a storage API URL", () => {
    process.env.SUPABASE_URL = "postgresql://user:secret@example.com/postgres";
    expect(isSupabaseStorageConfigured()).toBe(false);
  });

  it("serves a signed private-bucket image through the authenticated Storage API", async () => {
    const imageBytes = Buffer.from([1, 2, 3, 4]);
    const fetchMock = vi.fn().mockResolvedValue(new globalThis.Response(imageBytes, {
      status: 200,
      headers: { "content-type": "image/png" },
    }));
    vi.stubGlobal("fetch", fetchMock);

    const imageUrl = storageImageUrlFromMetadata({
      bucketName: "images",
      objectPath: "vendor/user-id/photo.png",
    });
    const token = imageUrl.split("/").pop();
    const result = await downloadStoredImage(token);

    expect(result).toEqual({ body: imageBytes, contentType: "image/png" });
    expect(fetchMock).toHaveBeenCalledWith(
      "https://project.supabase.co/storage/v1/object/authenticated/images/vendor/user-id/photo.png",
      expect.objectContaining({
        headers: {
          Authorization: "Bearer test-service-key",
          apikey: "test-service-key",
        },
      })
    );
  });

  it("rejects a modified storage image token", async () => {
    const imageUrl = storageImageUrlFromMetadata({
      bucketName: "images",
      objectPath: "vendor/user-id/photo.png",
    });
    const token = imageUrl.split("/").pop();

    await expect(downloadStoredImage(`${token}0`)).rejects.toMatchObject({ statusCode: 404 });
  });
});
