import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import { IUser } from "../../interface";

interface CustomRequest extends Request {
  userId?: IUser;
}

export const verifyToken = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers?.authorization;
  const token = authHeader && authHeader.toString().split(" ")[1];
  if (!token) {
    res.status(401);
    return next(new Error("Token not provided"));
  }
  try {
    const decoded = jwt.verify(
      token,
      process.env.REFRESH_TOKEN_SECRET as Secret
    );
    if (!decoded || typeof decoded !== "object") throw new Error("invalid");
    req.userId = (decoded as JwtPayload).userId;
    next();
  } catch {
    res.status(401);
    next(new Error("Token verification failed"));
  }
};
