import { Router } from "express";
import developerController from "../controllers/developerController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { restrictToRoles } from "../middlewares/rbacGuard.js";
import { catchAsync } from "../utils/catchAsync.js";

const router = Router();

const devBypass = (req, res, next) => {
  if (process.env.NODE_ENV !== "production") {
    req.user = {
      id: "local-developer",
      email: "developer@patheat.local",
      role_scope: "DEVELOPER_ADMIN",
    };
    return next();
  }

  return authMiddleware(req, res, next);
};

router.use(devBypass);
router.use(restrictToRoles("DEVELOPER_ADMIN", "GLOBAL_ADMIN"));

router.get("/health", catchAsync(developerController.health));

router.get("/users", catchAsync(developerController.getUsers));
router.post("/users", catchAsync(developerController.createUser));
router.patch("/users/:id", catchAsync(developerController.updateUser));
router.post("/users/:id/ban", catchAsync(developerController.banUser));
router.post("/users/:id/unban", catchAsync(developerController.unbanUser));
router.delete("/users/:id", catchAsync(developerController.deleteUser));

router.get("/vendors", catchAsync(developerController.getVendors));
router.post("/vendors", catchAsync(developerController.createVendor));
router.patch("/vendors/:id", catchAsync(developerController.updateVendor));
router.post("/vendors/:id/ban", catchAsync(developerController.banVendor));
router.post("/vendors/:id/unban", catchAsync(developerController.unbanVendor));
router.delete("/vendors/:id", catchAsync(developerController.deleteVendor));
router.get("/place-categories", catchAsync(developerController.getPlaceCategories));
router.get("/database/tables/:tableName/columns", catchAsync(developerController.getTableColumns));

router.get("/backups", catchAsync(developerController.getBackups));
router.post("/backups", catchAsync(developerController.createBackup));
router.post("/backups/:id/recover", catchAsync(developerController.recoverBackup));

router.get("/database", catchAsync(async (req, res) => {
  res.json({ success: true, data: { message: "Use /api/dev/backups for logical database/table/row backups." } });
}));

router.get("/logs", catchAsync(async (req, res) => {
  res.json({ success: true, data: [] });
}));

export default router;
