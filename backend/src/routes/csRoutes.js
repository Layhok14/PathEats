import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { restrictToRoles } from "../middlewares/rbacGuard.js";
import { catchAsync } from "../utils/catchAsync.js";

const router = Router();

router.use(authMiddleware);
router.use(restrictToRoles("CUSTOMER_SERVICE_ADMIN", "GLOBAL_ADMIN"));

export default router;
