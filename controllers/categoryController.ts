import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import Categories from "../models/categoryModel";

export const createCategories = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const category = await Categories.create(req.body);
      res.json({ category: category, message: "success" });
    } catch (error) {
      res.json(error);
    }
  }
);
