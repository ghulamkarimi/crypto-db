import express from "express";
import { createCoins, getAllCoins, getCoinOhlc, updateCoins } from "../controllers/coinController";


const router = express.Router();

router.put("/api/v1/coins/update", updateCoins);
router.get("/api/v1/coins/", getAllCoins);
router.post("/api/v1/coins/create", createCoins);
router.get("/api/v1/coins/:id/ohlc", getCoinOhlc);

export default router;
