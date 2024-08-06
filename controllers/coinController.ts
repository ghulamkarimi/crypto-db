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


