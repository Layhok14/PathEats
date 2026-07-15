import { Router } from "express";
import { getImage } from "../controllers/storageController.js";

const router = Router();

router.get("/images/:token", getImage);

export default router;
