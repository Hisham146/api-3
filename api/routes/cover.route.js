import express from "express";
import { addNewCover,getCover,deleteCover, selectedCover,selectedCoverApply } from "../controllers/cover.controller.js";



const router = express.Router();
router.post("/postcover", addNewCover);
 router.get("/getcover", getCover)
 router.delete("/deletecover/:id",  deleteCover);
 router.post("/selectedcover/:id",  selectedCover);
 router.get("/appliedcover", selectedCoverApply);
export default router;