import express from "express";
import { verifyToken } from "../middlewares/token/verifyToken";
import {
  createNews,
  deleteNews,
  editNews,
  getAllNews,
  incrementNewsViews,
  toggleDisikeNews,
  toggleLikeNews,
} from "../controllers/newsController";
import {
  newsPhotoResize,
  photoUpload,
} from "../middlewares/upload/photoUpload";

const router = express.Router();

//like and dislike
router.put("/api/v1/news/likes", verifyToken, toggleLikeNews);
router.put("/api/v1/news/dislikes", verifyToken, toggleDisikeNews);

router.post(
  "/api/v1/news/create",
  verifyToken,
  photoUpload.single("image"),
  newsPhotoResize,
  createNews
);

router.put("/api/v1/news/incrementViews", verifyToken, incrementNewsViews);

router.put(
  "/api/v1/news/edit",
  verifyToken,
  photoUpload.single("image"),
  newsPhotoResize,
  editNews
);
router.delete("/api/v1/news/delete", verifyToken, deleteNews);

router.get("/api/v1/news", getAllNews);

export default router;
