import express from "express";
import { verifyToken } from "../middlewares/token/verifyToken";
import {
  createPost,
  deletePost,
  editPost,
  getAllPosts,
  incrementPostViews,
  toggleDisikePost,
  toggleLikePost,
} from "../controllers/postController";
import {
  photoUpload,
  postPhotoResize,
} from "../middlewares/upload/photoUpload";

const router = express.Router();

//like and dislike
router.put("/api/v1/posts/likes",verifyToken,toggleLikePost)
router.put("/api/v1/posts/dislikes",verifyToken,toggleDisikePost)


router.put("/api/v1/posts/incrementViews",verifyToken,incrementPostViews)


router.post(
  "/api/v1/posts/create",
  verifyToken,
  photoUpload.single("image"),
  postPhotoResize,
  createPost
);
router.put(
  "/api/v1/posts/edit",
  verifyToken,
  photoUpload.single("image"),
  postPhotoResize,
  editPost
);
router.delete("/api/v1/posts/delete", verifyToken, deletePost);

router.get("/api/v1/posts", getAllPosts);

export default router;
