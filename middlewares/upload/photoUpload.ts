import { Request, Response } from "express";
import multer from "multer";
import sharp from "sharp";
import path from "path";
import fs from "fs";

const multerStorage = multer.memoryStorage();

const multerFilter = (req: Request, file: any, cb: Function) => {
  if (file.mimetype.startsWith("image")) {
    file.mimetype.startsWith("image/jpeg") ||
    file.mimetype.startsWith("image/png") ||
    file.mimetype.startsWith("image/jpg") ||
    file.mimetype.startsWith("image/avif") ||
    file.mimetype.startsWith("image/heic") ||
    file.mimetype.startsWith("image/gif") ||
    file.mimetype.startsWith("image/bmp") ||
    file.mimetype.startsWith("image/webp") ||
    file.mimetype.startsWith("image/tiff")
    cb(null, true);
  } else {
    cb(
      {
        message: "Unsupported file format",
      },
      false
    );
  }
};

export const photoUpload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
  limits: { fileSize: 8000000 },
});

export const profilePhotoResize = async (
  req: Request,
  res: Response,
  next: Function
) => {
  if (!req.file) return next();
  req.file.filename = `user-${Date.now()}-${Math.random().toString(36).slice(2, 10)}.jpg`;
  try {
  fs.mkdirSync("public/images/profile", { recursive: true });
  await sharp(req.file.buffer)
  .resize(400,400)
  .toFormat("jpeg")
  .jpeg({quality:90})
  .toFile(path.join(`public/images/profile/${req.file.filename}`))
  next()
  } catch (error) {
    res.status(400);
    next(new Error("Das Bild konnte nicht verarbeitet werden"));
  }
};

export const postPhotoResize = async (
  req: Request,
  res: Response,
  next: Function
) => {
  if (!req.file) return next();
  req.file.filename = `post-${Date.now()}-${req.file.originalname}`;
  try {
  fs.mkdirSync("public/images/posts", { recursive: true });
  await sharp(req.file.buffer)
  .resize(500,500)
  .toFormat("jpeg")
  .jpeg({quality:90})
  .toFile(path.join(`public/images/posts/${req.file.filename}`))
  next()
  } catch (error) {
    res.status(400);
    next(new Error("Das Bild konnte nicht verarbeitet werden"));
  }
};

export const newsPhotoResize = async (
  req: Request,
  res: Response,
  next: Function
) => {
  if (!req.file) return next();
  req.file.filename = `news-${Date.now()}-${req.file.originalname}`;
  try {
  fs.mkdirSync("public/images/news", { recursive: true });
  await sharp(req.file.buffer)
  .resize(500,500)
  .toFormat("jpeg")
  .jpeg({quality:90})
  .toFile(path.join(`public/images/news/${req.file.filename}`))
  next()
  } catch (error) {
    res.status(400);
    next(new Error("Das Bild konnte nicht verarbeitet werden"));
  }
};

export const analyzePhotoResize = async (
  req: Request,
  res: Response,
  next: Function
) => {
  if (!req.file) return next();
  req.file.filename = `analyze-${Date.now()}-${req.file.originalname}`;
  try {
  fs.mkdirSync("public/images/analyze", { recursive: true });
  await sharp(req.file.buffer)
  .resize(500,500)
  .toFormat("jpeg")
  .jpeg({quality:90})
  .toFile(path.join(`public/images/analyze/${req.file.filename}`))
  next()
  } catch (error) {
    res.status(400);
    next(new Error("Das Bild konnte nicht verarbeitet werden"));
  }
};
