import UserRepository from "../repositories/UserRepository.js";
import {
  deleteStoredImage,
  storageImageUrlFromMetadata,
  uploadVendorImage,
} from "./storageService.js";

const userRepository = new UserRepository();

export function profileImageUrlFromMetadata(profile) {
  const bucketName = profile?.profile_image_bucket;
  const objectPath = profile?.profile_image_path;
  if (!bucketName || !objectPath) return null;

  return storageImageUrlFromMetadata({ bucketName, objectPath });
}

export function attachProfileImageUrl(profile) {
  if (!profile) return profile;
  return {
    ...profile,
    profile_image_url: profileImageUrlFromMetadata(profile),
  };
}

export async function saveProfileImage({ userId, file, altText = "", baseUrl = "" }) {
  const previousImage = await userRepository.findProfileImage(userId);
  const upload = await uploadVendorImage({ file, ownerId: userId, altText, baseUrl });
  let image;

  try {
    image = await userRepository.upsertProfileImage(userId, upload.storageImage);
  } catch (error) {
    await deleteStoredImage(upload.storageImage).catch(() => undefined);
    throw error;
  }

  const previousImageWasReplaced =
    previousImage &&
    (previousImage.bucket_name !== image.bucket_name ||
      previousImage.object_path !== image.object_path);
  if (previousImageWasReplaced) {
    await deleteStoredImage(previousImage).catch((error) => {
      console.error("[profileImageService] Failed to remove replaced profile image:", error);
    });
  }

  const persistedImageUrl = profileImageUrlFromMetadata({
    profile_image_bucket: image.bucket_name,
    profile_image_path: image.object_path,
  });

  return {
    ...image,
    profile_image_url: persistedImageUrl || upload.url,
  };
}
