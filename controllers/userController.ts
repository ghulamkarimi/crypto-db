import asyncHandler from "express-async-handler";
import Users from "../models/userModel";
import jwt from "jsonwebtoken";
import { jwtDecode } from "jwt-decode";
import { IUser } from "../interface/index";
import { Request, Response } from "express";
import { sendVerificationLinkToEmail } from "./email/sendEmail";
import { cloudinaryUploadImage } from "../utils/cloudinary";
import fs from "fs";
import { addMonths } from "date-fns";

interface CustomRequest extends Request {
  userId?: IUser;
}

// Register User
export const registerUser = asyncHandler(
  async (req: Request, res: Response) => {
    const { firstName, lastName, email, password, confirmPassword, gender } =
      req.body;
    const existEmail = await Users.findOne({ email });
    if (existEmail)
      throw new Error("Oops! Looks like this email is already in our Database");
    if (password !== confirmPassword)
      throw new Error("Password and Confirm Password do not match.");

    try {
      const user = await Users.create({
        firstName,
        lastName,
        email,
        password,
        gender,
      });

      res.json({
        user: user,
        message: "You have successfully registered.",
      });
    } catch (error) {
      console.log("Catch");
      res.json(error);
    }
  }
);

// Login User
export const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const userFound = await Users.findOne({ email });
  if (userFound && (await userFound.isPasswordMatched(password))) {
    const {
      _id: userId,
      firstName,
      lastName,
      email,
      isAccountVerified,
      isAdmin,
      profile_photo: photo,
    } = userFound;
    const accessToken = jwt.sign(
      {
        userId,
        firstName,
        lastName,
        email,
        isAccountVerified,
        isAdmin,
        photo,
      },
      process.env.ACCESS_TOKEN_SECRET as string,
      {
        expiresIn: "30d",
      }
    );
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
      process.env.REFRESH_TOKEN_SECRET as string,
      {
        expiresIn: "30s",
      }
    );
    const user = await Users.findByIdAndUpdate(userId, {
      access_token: accessToken,
    });

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
      secure: true,
      sameSite: "lax",
    });

    const decode = jwtDecode<IUser>(accessToken);

    res.json({
      message: "Login successful",
      token: refreshToken,
      userInfo: decode,
      user: user,
    });
  } else {
    throw new Error("Invalid username or password");
  }
});

// Logout User
export const logoutUser = asyncHandler(async (req: Request, res: Response) => {
  const token = req.cookies.accessToken;
  if (!token) throw new Error("no token");
  const user = await Users.findOne({ access_token: token });
  if (!user) throw new Error("No User");
  user.access_token = undefined;
  await user.save();
  res.clearCookie("accessToken");
  res.json({ message: "logout Successful" });
});

export const verifyUserEmail = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    const loginUserId = req.userId;
    const user = await Users.findById(loginUserId);
    if (!user) throw new Error("User not found");
    // Throw an error if the user's account has already been verified
    if (user.isAccountVerified) return;

    const verificationCode = Math.floor(100000 + Math.random() * 900000);

    user.verificationCode = verificationCode.toString();
    await user.save();
    sendVerificationLinkToEmail(user.email, user.firstName, verificationCode);
    res.json({
      message:
        "Your activation code has been sent to your email. If you do not receive the email within 15 minutes, please request it again.",
      verificationCode,
    });
  }
);

export const accountVerification = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    const loginUserId = req.userId;
    const user = await Users.findById(loginUserId);

    if (!user) throw new Error("no user");
    try {
      const { verificationCode } = req.body;
      if (verificationCode === user.verificationCode) {
        user.verificationCode = "";
        user.isAccountVerified = true;

        await user.save();

        res.json({
          _id: loginUserId,
          user: user,
          message: "Your account has been verified successfully.",
        });
      } else {
        throw new Error("Code is not valid");
      }
    } catch (error) {
      res.json(error);
    }
  }
);

// Get All Users
export const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
  try {
    const users = await Users.find();
    res.json(users);
  } catch (error) {
    res.json(error);
  }
});

export const profilePhotoUser = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    try {
      const userId = req.userId;
      const localPath = `public/images/profile/${req.file.filename}`;
      const imageUploaded = await cloudinaryUploadImage(localPath);
      const user = await Users.findByIdAndUpdate(
        userId,
        {
          profile_photo: imageUploaded.url,
        },
        { new: true }
      );
      fs.unlinkSync(localPath);
      res.json({ message: "success", user: user });
    } catch (error) {
      res.json(error);
    }
  }
);

export const accessTokenExpired = asyncHandler(
  async (req: Request, res: Response) => {
    const token = req.cookies.accessToken;
    if (!token) throw new Error("user ist nicht mehr loggin");

    const user = await Users.findOne({ access_token: token });
    if (!user) throw new Error("user ist nicht mehr loggin");
    res.json({ user: user, message: "user is loggin" });
  }
);

// Edit User Info
export const editProfileInfo = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    try {
      const { firstName, lastName, gender, bio } = req.body;
      const userId = req.userId;
      const user = await Users.findByIdAndUpdate(
        userId,
        {
          firstName,
          lastName,
          gender,
          bio,
        },
        { new: true }
      );
      res.json({
        user: user,
        message: "Profile information updated successfully.",
      });
    } catch (error) {
      res.json(error);
    }
  }
);

//CHANGE PASSWORD WENN USER IST LOGIN
export const changePassword = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    const userId = req.userId;
    const { password, newPassword, confirmPassword } = req.body;
    const user = await Users.findById(userId);
    if (await user.isPasswordMatched(password)) {
      if (newPassword !== confirmPassword) {
        throw new Error("Password and Confirm Password do not match.");
      }
      user.password = newPassword;
      await user.save();
      res.json({ message: "Your password has been successfully changed." });
    } else {
      throw new Error("Please enter your password correctly");
    }
  }
);

// Follow User
export const followUser = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    const loginUserId = req.userId;
    const targetUserId = req.body.targetUserId;
    const targetUser = await Users.findById(targetUserId);
    const followers = targetUser.followers.find(
      (user: string) => user.toString() === loginUserId.toString()
    );
    if (followers) throw new Error("You are already following this user.");
    const targetUserFollow = await Users.findByIdAndUpdate(
      targetUserId,
      {
        $push: { followers: loginUserId },
        isFollowing: true,
      },
      { new: true }
    );
    const loginUserFollow = await Users.findByIdAndUpdate(
      loginUserId,
      {
        $push: { following: targetUserId },
      },
      { new: true }
    );
    res.json({
      user: [targetUserFollow, loginUserFollow],
      message: "You are now following the user.",
    });
  }
);

// UnFollow User
export const unFollowUser = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    const loginUserId = req.userId;
    const targetUserId = req.body.targetUserId;
    const targetUser = await Users.findById(targetUserId);
    const followers = targetUser.followers.find(
      (user: string) => user.toString() === loginUserId.toString()
    );
    if (!followers) throw new Error("You are not following this user.");
    const targetUserFollow = await Users.findByIdAndUpdate(
      targetUserId,
      {
        $pull: { followers: loginUserId },
        isFollowing: false,
      },
      { new: true }
    );
    const loginUserFollow = await Users.findByIdAndUpdate(
      loginUserId,
      {
        $pull: { following: targetUserId },
      },
      { new: true }
    );
    res.json({
      user: [targetUserFollow, loginUserFollow],
      message: "You have unfollowed the user.",
    });
  }
);

// Delete Account
export const deleteAccount = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    const loginUserId = req.userId;
    const { targetUserId } = req.params;

    const loginUser = await Users.findById(loginUserId);
    if (loginUser.isAdmin || loginUserId.toString() === targetUserId) {
      await Users.findByIdAndDelete(targetUserId);
      res.json({ message: "Account successfully deleted." });
    } else {
      throw new Error("You do not have permission to delete this account.");
    }
  }
);

export const examScoreRegistration = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    const loginUserId = req.userId;

    const loginUser = await Users.findById(loginUserId);
    console.log("loginUser: ", loginUser);
    if (loginUser) {
      const { correctAnswers, incorrectAnswers, totalScore, canAnalyze } =
        req.body;
      console.log("req.body: ", req.body);
      const user = await Users.findByIdAndUpdate(
        { _id: loginUserId },
        {
          correctAnswers,
          incorrectAnswers,
          totalScore,
          canAnalyze,
        },
        { new: true }
      );
      res.json({ message: "success", _id: loginUserId, user: user });
    } else {
      throw new Error("no User");
    }
  }
);

//wenn Benutzer hat seine Password Vergessen muss zuerst seine email bestätigen
export const confirmEmail = asyncHandler(
  async (req: Request, res: Response) => {
    const { email } = req.body;
    const user = await Users.findOne({ email });

    if (!user) {
      throw new Error("User not found");
    }

    if (!user.email) {
      throw new Error("User's email not found");
    }
    const verificationCode = Math.floor(100000 + Math.random() * 900000);

    user.verificationCode = verificationCode.toString();
    await user.save();
    sendVerificationLinkToEmail(user.email, user.firstName, verificationCode);
    res.json({
      message:
        "Your activation code has been sent to your email. If you do not receive the email within 15 minutes, please request it again.",
      verificationCode,
      email,
    });
  }
);

//CHANGE PASSWORD WENN USER IST Nicht LOGIN
export const changePasswordWithotLogin = asyncHandler(
  async (req: Request, res: Response) => {
    const { email, newPassword, confirmPassword } = req.body;
    const user = await Users.findOne({ email });
    if (user) {
      if (newPassword !== confirmPassword) {
        throw new Error("Password and Confirm Password do not match.");
      }
      user.password = newPassword;
      await user.save();
      res.json({
        message: "Your password has been successfully changed.",
        user: user,
      });
    } else {
      throw new Error("user Not Found");
    }
  }
);

export const confirmVerificationCode = asyncHandler(
  async (req: Request, res: Response) => {
    const { email, verificationCode } = req.body;
    const user = await Users.findOne({ email });

    if (!user) throw new Error("no user");

    if (verificationCode === user.verificationCode) {
      user.verificationCode = "";
      user.isAccountVerified = true;

      await user.save();

      res.json({
        user: user,
        message: "Your verify Code  successfully.",
      });
    } else {
      throw new Error("Code is not valid");
    }
  }
);

export const paymentJournl = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    const loginUserId = req.userId;
    const { planJournal, priceJournal } = req.body;
    const user = await Users.findById(loginUserId);
    if (user) {
      const currentDate = new Date();
      user.planJournal = planJournal;
      user.priceJournal = priceJournal;

      user.iatJournal = currentDate;
      user.expJournal = addMonths(currentDate, Number(planJournal));
      user.isPaid = true;
      await user.save();
      res.json({ _id: user._id, message: "payment Success", user });
    } else {
      throw new Error("no User");
    }
  }
);

export const checkAndUpdateExpDateJournal = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    const loginUserId = req.userId;
    const user = await Users.findById(loginUserId);
    if (user && user.expJournal) {
      const currentDate = new Date();
      if (currentDate > user.expJournal) {
        user.iatJournal = undefined;
        user.priceJournal = undefined;
        user.planJournal = undefined;
        user.isPaid = false;
        await user.save();
  
        res.json({
          _id: user._id,
          user,
          status:400,
          message: "Expired fields checked and updated successfully",
        });
      } else {
     
        const difference = currentDate.getTime() - user.expJournal.getTime();
        const daysDifference = Math.ceil(difference / (1000 * 60 * 60 * 24));
        res.json({
          _id: user._id,
          user,
          status:200,
          message: `${daysDifference} days left`,
        });
      }
    } else {
      throw new Error("no User");
    }
  }
);
