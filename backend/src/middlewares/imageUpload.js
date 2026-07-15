import multer from "multer";
import AppError from "../utils/AppError.js";

export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
export const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

export const imageUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_IMAGE_BYTES },
  fileFilter: (_req, file, callback) => {
    if (ALLOWED_IMAGE_TYPES.has(file.mimetype)) {
      callback(null, true);
      return;
    }
    callback(new AppError("Only JPEG, PNG, WEBP, and GIF images are allowed", 400));
  },
});
