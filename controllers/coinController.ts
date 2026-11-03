import asyncHandler from "express-async-handler";
import Coins from "../models/coinModel";
import axios from "axios";
import { Request, Response } from "express";



export const getAllCoins = asyncHandler(async (req:Request, res:Response) => {
  try {
    const coin = await Coins.find();
    res.json(coin);
  } catch (error) {
    res.status(500).json(error);
  }
});

export const createCoins = asyncHandler(async (req:Request, res:Response) => {
  try {
    const response = await axios.get(
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=1&sparkline=true&price_change_percentage=1h%2C24h%2C7d&locale=en"
    );
    const coinsData = response.data;

    await Coins.create(coinsData);
  } catch (error) {
    res.status(500).json(error);
  }
});

export const updateCoins = asyncHandler(async (req:Request, res:Response) => {
  try {
    const response = await axios.get(
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=1&sparkline=true&price_change_percentage=1h%2C24h%2C7d&locale=en"
    );
    const coinsData = response.data;
    for (const coin of coinsData) {
      await Coins.updateOne(
        { id: coin.id },
        coin,
        { upsert: true },
      );
    }

    res.json({ success: true, message: "success" });
  } catch (error) {
    res.status(500).json({ success: false, error: "error" });
  }
});




// Kerzen-Daten (OHLC) für den Chart im Rechner, mit kurzem Zwischenspeicher
const ohlcCache = new Map<string, { at: number; data: unknown }>();
const OHLC_DAYS = ["1", "7", "14", "30", "90", "180", "365"];

export const getCoinOhlc = asyncHandler(async (req: Request, res: Response) => {
  const id = String(req.params.id || "");
  const days = String(req.query.days || "7");
  if (!/^[a-z0-9-]{1,64}$/.test(id) || !OHLC_DAYS.includes(days)) {
    res.status(400);
    throw new Error("Invalid coin or period");
  }
  const key = `${id}:${days}`;
  const cached = ohlcCache.get(key);
  if (cached && Date.now() - cached.at < 10 * 60 * 1000) {
    res.json(cached.data);
    return;
  }
  try {
    const { data } = await axios.get(
      `https://api.coingecko.com/api/v3/coins/${id}/ohlc`,
      { params: { vs_currency: "usd", days }, timeout: 15000 }
    );
    ohlcCache.set(key, { at: Date.now(), data });
    res.json(data);
  } catch (error) {
    // bei Limit des Anbieters lieber alte Daten als gar keine
    if (cached) {
      res.json(cached.data);
      return;
    }
    res.status(502);
    throw new Error("Chart data is not available right now");
  }
});
