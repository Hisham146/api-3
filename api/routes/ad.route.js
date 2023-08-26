import express from "express";
import {
  createAd,
  deleteAd,
  getAd,
  getAds,
  userMyAds,
  updateAd,getuserAds,admingetAds,admindeleteAd, adminSelectedDeleteAd // Import the updateAd controller function
} from "../controllers/ad.controller.js";

const router = express.Router();

router.post("/postAd/:id",  createAd);
router.delete("/delete/:id", deleteAd);
router.delete("/admin/selected/:ids",  adminSelectedDeleteAd);
router.delete("/admin/:id", admindeleteAd);
router.get("/single/:id", getAd);
router.get("/", getAds);
router.get("/adminposts", admingetAds);
router.put("/:id", updateAd);
router.get("/userposts/:id", getuserAds);
router.get("/myposts/:id", userMyAds);

export default router;
