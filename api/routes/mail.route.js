import express from "express";
import { sendMail } from "../controllers//mail.controller.js";
import { verifyToken } from "../middleware/jwt.js";
const router = express.Router();

router.post("/sendMail",verifyToken, sendMail)

export default router;