import multer from "multer";
import AppError from "../utils/AppError.js";

const MAX_RECOVERY_FILE_BYTES = 100 * 1024 * 1024;
const allowedExtensions = new Set(["dump", "backup", "pgdump", "csv"]);

export const recoveryUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_RECOVERY_FILE_BYTES },
  fileFilter: (_req, file, callback) => {
    const extension = file.originalname.split(".").pop()?.toLowerCase();
    if (allowedExtensions.has(extension)) return callback(null, true);
    return callback(new AppError("Only .dump, .backup, .pgdump, and .csv files are allowed", 400));
  },
});
