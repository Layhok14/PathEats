import { Router } from "express";
import * as adminController from "../controllers/adminController.js";

const router = Router();

router.post("/roles", adminController.createRole);
router.get("/users", adminController.getUsers);
router.post("/users", adminController.createUser);
router.patch("/users/:id/role", adminController.updateRole);
router.patch("/users/:id/status", adminController.updateStatus);

export default router;
