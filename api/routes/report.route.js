import express from "express";
import { postReport, getReports,adminSelectedDeleteAd } from "../controllers/report.controller.js";


const router = express.Router();
router.post("/reportpost", postReport);
router.get("/getreports", getReports)
router.delete("/admin/selected/:ids",  adminSelectedDeleteAd);
export default router;