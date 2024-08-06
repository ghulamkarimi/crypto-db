import { Request, Response } from "express";

export const errorHandler = (
  err: { message: string; stack: string },
  req: Request,
  res: Response,
  next: Function
) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

export const notFound = (req: Request, res: Response, next: Function) => {
  const error = new Error(`${req.originalUrl} - Not Found`);
  res.status(404);
  next(error);
};
