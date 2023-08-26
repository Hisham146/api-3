import express from "express";
import { registerService, admingetServices, adminSelectedDeleteService } from "../controllers/service.controller.js";
import { verifyToken } from "../middleware/jwt.js";

const router = express.Router();

router.post("/registerService", registerService)
router.get("/adminGetServices", admingetServices)
router.delete("/admin/selected/:ids",  adminSelectedDeleteService);
export default router;