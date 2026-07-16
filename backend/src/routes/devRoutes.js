import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { restrictToRoles } from "../middlewares/rbacGuard.js";
import { requireSystemCapability } from "../middlewares/privilegeGuard.js";
import { recoveryUpload } from "../middlewares/recoveryUpload.js";
import * as developerController from "../controllers/developerController.js";
import * as backupController from "../controllers/developerBackupController.js";

const router = Router();

router.use(authMiddleware);
router.use(restrictToRoles("GLOBAL_ADMIN", "DEVELOPER_ADMIN"));

router.use("/backups", requireSystemCapability("BACKUP"));
router.use("/recovery", requireSystemCapability("RECOVERY"));
router.use("/query", requireSystemCapability("QUERY"));
router.use("/queries", requireSystemCapability("QUERY"));
router.use("/maintenance", requireSystemCapability("MAINTENANCE"));

router.get("/health", developerController.getHealth);
router.get("/database", developerController.getDatabase);
router.get("/logs", developerController.getLogs);
router.get("/api-metrics", developerController.getApiMetrics);

router.get("/queries/presets", developerController.getPresets);
router.get("/queries/presets/all", developerController.getAllPresets);
router.post("/queries/presets", developerController.createPreset);
router.put("/queries/presets/:id", developerController.updatePreset);
router.delete("/queries/presets/:id", developerController.deletePreset);
router.patch("/queries/presets/:id/used", developerController.markPresetUsed);
router.post("/query", developerController.executeQuery);
router.get("/query/history", developerController.getQueryHistory);
router.get("/maintenance", developerController.getMaintenance);
router.get("/errors", developerController.getErrors);
router.get("/activity-log", developerController.getActivityLog);

router.get("/backups",backupController.listProfiles);
router.get("/backups/tables", backupController.listTables);
router.post("/backups", backupController.createProfile);
router.get("/backups/:id/download", backupController.downloadProfile);
router.patch("/backups/:id", backupController.updateProfile);
router.post("/backups/:id/pause", backupController.pauseProfile);
router.post("/backups/:id/resume", backupController.resumeProfile);
router.delete("/backups/:id", backupController.deleteProfile);
router.get("/backups/scheduled", backupController.listScheduled);
router.get("/backups/scheduled/:id/download", backupController.downloadScheduled);
router.delete("/backups/scheduled/:id", backupController.deleteScheduled);
router.get("/recovery", backupController.listRecovery);
router.post("/recovery", recoveryUpload.single("file"), backupController.recover);

router.get("/reviews", developerController.getReviews);
router.get("/user-management/overview", developerController.getUserManagementOverview);
router.get("/vendor-management/overview", developerController.getVendorManagementOverview);
router.get("/audit/by-role", developerController.getAuditByRole);
router.get("/profile", developerController.getProfile);

export default router;
