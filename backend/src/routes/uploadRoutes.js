import path from "path";
import { fileURLToPath } from "url";
import { Router } from "express";
import AppError from "../utils/AppError.js";

const router = Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const VENDOR_IMAGE_DIR = path.resolve(__dirname, "../../uploads/vendor-images");
const VENDOR_IMAGE_FILE_PATTERN = /^[0-9a-f-]{36}-[0-9]+-[0-9a-f-]{36}\.(jpg|png|webp|gif)$/i;

router.get("/vendor-images/:filename", (req, res, next) => {
  const { filename } = req.params;
  if (!VENDOR_IMAGE_FILE_PATTERN.test(filename)) {
    return next(new AppError("Image not found", 404));
  }

  const filePath = path.resolve(VENDOR_IMAGE_DIR, filename);
  if (path.dirname(filePath) !== VENDOR_IMAGE_DIR) {
    return next(new AppError("Image not found", 404));
  }

  return res.sendFile(filePath, (err) => {
    if (err) next(new AppError("Image not found", 404));
  });
});

export default router;
