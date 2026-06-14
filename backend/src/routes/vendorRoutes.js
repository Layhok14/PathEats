import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { restrictToRoles } from "../middlewares/rbacGuard.js";

const router = Router();

// All vendor routes require authentication + VENDOR role
router.use(authMiddleware);
router.use(restrictToRoles("VENDOR"));

// TODO: wire vendor controllers
router.get("/profile", (req, res) => res.json({ success: false, message: "Not implemented" }));
router.put("/details", (req, res) => res.json({ success: false, message: "Not implemented" }));
router.get("/metrics", (req, res) => res.json({ success: false, message: "Not implemented" }));

export default router;
