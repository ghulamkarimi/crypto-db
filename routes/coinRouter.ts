import express from "express";
import { createCoins, getAllCoins, updateCoins } from "../controllers/coinController";


const router = express.Router();

router.put("/api/v1/coins/update", updateCoins);
router.get("/api/v1/coins/", getAllCoins);
router.post("/api/v1/coins/create", createCoins);

export default router;
