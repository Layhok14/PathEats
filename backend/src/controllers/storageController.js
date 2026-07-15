import { downloadStoredImage } from "../services/storageService.js";
import { catchAsync } from "../utils/catchAsync.js";

export const getImage = catchAsync(async (req, res) => {
  const image = await downloadStoredImage(req.params.token);
  res.setHeader("Content-Type", image.contentType);
  res.setHeader("Content-Length", image.body.length);
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
  res.status(200).send(image.body);
});
