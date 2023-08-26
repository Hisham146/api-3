import express from "express";
import { register, login, logout, verifyUser,forgetPass,verifyPass, newPass, adminLogin } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", register)
router.post("/admin/login", adminLogin)
router.post("/login", login)
router.post("/logout", logout)
router.post("/forgetPass", forgetPass);
router.get("/:id/verify/:token", verifyUser);
router.get("/:id/:token", verifyPass);
router.post("/:id/:token", newPass);

export default router;
