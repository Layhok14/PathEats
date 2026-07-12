import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { restrictToRoles } from "../middlewares/rbacGuard.js";
import * as userController from "../controllers/userController.js";
import { requirePrivileges } from "../middlewares/privilegeGuard.js";

const router = Router();

router.use(authMiddleware);
router.use(restrictToRoles("CONSUMER"));

router.get("/profile", requirePrivileges({ table: "users", action: "SELECT" }), userController.getProfile);
router.put("/profile", requirePrivileges({ table: "users", action: "UPDATE" }), userController.updateProfile);

// Bookmarks
router.get("/bookmarks", requirePrivileges({ table: "bookmarks", action: "SELECT" }), userController.getBookmarks);
router.post("/bookmarks", requirePrivileges({ table: "bookmarks", action: "INSERT" }), userController.addBookmark);
router.delete("/bookmarks/:placeId", requirePrivileges({ table: "bookmarks", action: "DELETE" }), userController.removeBookmark);

// Saved Routes
router.get("/routes", requirePrivileges({ table: "routes", action: "SELECT" }), userController.getRoutes);
router.post("/routes", requirePrivileges({ table: "routes", action: "INSERT" }), userController.addRoute);
router.delete("/routes", requirePrivileges({ table: "routes", action: "DELETE" }), userController.deleteAllRoutes);
router.patch("/routes/:id", requirePrivileges({ table: "routes", action: "UPDATE" }), userController.updateRoute);
router.delete("/routes/:id", requirePrivileges({ table: "routes", action: "DELETE" }), userController.deleteRoute);

// Search History
router.get("/history", requirePrivileges({ table: "search_history", action: "SELECT" }), userController.getHistory);
router.post("/history", requirePrivileges({ table: "search_history", action: "INSERT" }), userController.addHistory);
router.delete("/history", requirePrivileges({ table: "search_history", action: "DELETE" }), userController.deleteAllHistory);
router.delete("/history/:id", requirePrivileges({ table: "search_history", action: "DELETE" }), userController.deleteHistory);

export default router;
