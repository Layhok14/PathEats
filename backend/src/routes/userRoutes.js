import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { restrictToRoles } from "../middlewares/rbacGuard.js";
import * as userController from "../controllers/userController.js";

const router = Router();

router.use(authMiddleware);
router.use(restrictToRoles("CONSUMER"));

router.get("/profile", userController.getProfile);
router.put("/profile", userController.updateProfile);

// Bookmarks
router.get("/bookmarks", userController.getBookmarks);
router.post("/bookmarks", userController.addBookmark);
router.delete("/bookmarks/:placeId", userController.removeBookmark);

// Saved Routes
router.get("/routes", userController.getRoutes);
router.post("/routes", userController.addRoute);
router.delete("/routes", userController.deleteAllRoutes);
router.patch("/routes/:id", userController.updateRoute);
router.delete("/routes/:id", userController.deleteRoute);

// Search History
router.get("/history", userController.getHistory);
router.post("/history", userController.addHistory);
router.delete("/history", userController.deleteAllHistory);
router.delete("/history/:id", userController.deleteHistory);

export default router;
