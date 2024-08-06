import express from "express";
import { createCategories } from "../controllers/categoryController";
import { verifyToken } from "../middlewares/token/verifyToken";



const router = express.Router();

router.post("/api/v1/categories/create",verifyToken, createCategories);

export default router;
