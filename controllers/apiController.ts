import asyncHandler from "express-async-handler";
import Apis from "../models/apiModel";

export const createCategourieName = asyncHandler(async (req, res) => {
  try {
    const { title } = req.body;
    await Apis.create({ title });
    res.json({ message: "success" });
  } catch (error) {
    res.json(error);
  }
});
