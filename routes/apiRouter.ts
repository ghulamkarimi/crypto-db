import express from "express";
import { createCategourieName } from "../controllers/apiController";


const router = express.Router();

router.post("/api/v1/title_models", createCategourieName);


export default router;
