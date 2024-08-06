import express from "express";
import { verifyToken } from "../middlewares/token/verifyToken";
import {
  createAnalyze,
  deleteAnalyze,
  editAnalyze,
  getAllAnalysis,
  incrementAnalyzeViews,
  toggleDisikeAnalyze,
  toggleLikeAnalyze,
} from "../controllers/analizeController";
import {
  analyzePhotoResize,
  photoUpload,
} from "../middlewares/upload/photoUpload";

const router = express.Router();

//like and dislike
router.put("/api/v1/analyze/likes",verifyToken,toggleLikeAnalyze)
router.put("/api/v1/analyze/dislikes",verifyToken,toggleDisikeAnalyze)

router.put("/api/v1/analyze/incrementViews", verifyToken, incrementAnalyzeViews);

router.post(
  "/api/v1/analyze/create",
  verifyToken,
  photoUpload.single("image"),
  analyzePhotoResize,
  createAnalyze
);

router.put(
  "/api/v1/analyze/edit",
  verifyToken,
  photoUpload.single("image"),
  analyzePhotoResize,
  editAnalyze
);

router.delete("/api/v1/analyze/delete", verifyToken, deleteAnalyze);

router.get("/api/v1/analysis", getAllAnalysis);

export default router;
