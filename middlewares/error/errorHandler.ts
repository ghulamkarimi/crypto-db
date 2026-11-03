import { Request, Response } from "express";

export const errorHandler = (
  err: { message: string; stack: string },
  req: Request,
  res: Response,
  next: Function
) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  const isDev = process.env.NODE_ENV === "development";
  res.json({
    message: err.message,
    // Stack-Traces nur in der Entwicklung
    stack: isDev ? err.stack : null,
  });
};

export const notFound = (req: Request, res: Response, next: Function) => {
  const error = new Error(`${req.originalUrl} - Not Found`);
  res.status(404);
  next(error);
};
