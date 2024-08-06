import express from "express";
import {
  createComment,
  deleteComment,
  editComment,
  getComments,
  getPostComments,
  toggleDisikeComment,
  toggleLikeComment,
} from "../controllers/commentController";
import { verifyToken } from "../middlewares/token/verifyToken";

const router = express.Router();

//like and dislike
router.put("/api/v1/comments/likes", verifyToken, toggleLikeComment);
router.put("/api/v1/comments/dislikes", verifyToken, toggleDisikeComment);

router.get("/api/v1/comments", getComments);
router.post("/api/v1/comments/postComments", verifyToken, getPostComments);
router.post("/api/v1/comments/create", verifyToken, createComment);
router.put("/api/v1/comments/edit", verifyToken, editComment);
router.delete("/api/v1/comments/delete", verifyToken, deleteComment);
export default router;
