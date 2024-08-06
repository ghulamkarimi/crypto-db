import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import Users from "../models/userModel";
import jwt, { Secret } from "jsonwebtoken";

export const refreshToken = asyncHandler(
  async (req: Request, res: Response) => {
      const token = req.cookies.accessToken;
      if (!token) throw new Error("Access token not provided");
      const user = await Users.findOne({ access_token: token });
      if (!user) throw new Error("User not found");

      jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET as Secret,
        (err: any, decoded: any) => {
            if (err) throw new Error("Access token verification failed");
          const {
            _id: userId,
            firstName,
            lastName,
            email,
            isAccountVerified,
            isAdmin,
            profile_photo: photo,
          } = user;
          const refreshToken = jwt.sign(
            {
              userId,
              firstName,
              lastName,
              email,
              isAccountVerified,
              isAdmin,
              photo,
            },
            process.env.REFRESH_TOKEN_SECRET as Secret,
            {
              expiresIn: "30s",
            }
          );
          res.json({ refreshToken });
        }
      );
   
  }
);
