import { Request, Response } from "express";
import multer from "multer";
import sharp from "sharp";
import path from "path"

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
  req.file.filename = `user-${Date.now()}-${req.file.originalname}`;
  await sharp(req.file.buffer)
  .resize(250,250)
  .toFormat("jpeg")
  .jpeg({quality:90})
  .toFile(path.join(`public/images/profile/${req.file.filename}`))
  next()
};

export const postPhotoResize = async (
  req: Request,
  res: Response,
  next: Function
) => {
  if (!req.file) return next();
  req.file.filename = `post-${Date.now()}-${req.file.originalname}`;
  await sharp(req.file.buffer)
  .resize(500,500)
  .toFormat("jpeg")
  .jpeg({quality:90})
  .toFile(path.join(`public/images/posts/${req.file.filename}`))
  next()
};

export const newsPhotoResize = async (
  req: Request,
  res: Response,
  next: Function
) => {
  if (!req.file) return next();
  req.file.filename = `news-${Date.now()}-${req.file.originalname}`;
  await sharp(req.file.buffer)
  .resize(500,500)
  .toFormat("jpeg")
  .jpeg({quality:90})
  .toFile(path.join(`public/images/news/${req.file.filename}`))
  next()
};

export const analyzePhotoResize = async (
  req: Request,
  res: Response,
  next: Function
) => {
  if (!req.file) return next();
  req.file.filename = `analyze-${Date.now()}-${req.file.originalname}`;
  await sharp(req.file.buffer)
  .resize(500,500)
  .toFormat("jpeg")
  .jpeg({quality:90})
  .toFile(path.join(`public/images/analyze/${req.file.filename}`))
  next()
};
