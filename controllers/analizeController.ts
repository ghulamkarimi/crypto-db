import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import fs from "fs";
import { IPost } from "../interface";
import Users from "../models/userModel";
import { blockUser } from "../utils/blockUser";
import { verifyUser } from "../utils/verifyUser";
import { analysatorUser } from "../utils/analysatorUser";
import { cloudinaryUploadImage } from "../utils/cloudinary";
import Analysis from "../models/analyzeModel";

interface CustomRequest extends Request {
  userId?: IPost;
}

//View all Analysis
export const getAllAnalysis = asyncHandler(async (req: Request, res: Response) => {
  try {
    const analyze = await Analysis.find();
    res.json(analyze);
  } catch (error) {
    res.json(error);
  }
});

//create a Analyze
export const createAnalyze = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    const userId = req.userId;
    const userData = await Users.findById(userId);
    blockUser(userData);
    verifyUser(userData);
    analysatorUser(userData)
    const { title, description } = req.body;
    const localPath = `public/images/analyze/${req.file.filename}`;
    const imageUploaded = await cloudinaryUploadImage(localPath);
    try {
      const analyze = await Analysis.create({
        user: userId,
        title,
        image: imageUploaded.url,
        description,
      });
      res.json({ analyze: analyze, message: "success" });
      fs.unlinkSync(localPath);
    } catch (error) {
      res.json(error);
    }
  }
);

//edit Post
export const editAnalyze = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    const userId = req.userId;
    const targetUser = req.body.targetUser;
    const userData = await Users.findById(userId);
    blockUser(userData);
    verifyUser(userData);
    analysatorUser(userData)
    if (targetUser === userId || userData.isAdmin) {
      const { title, description, image,  postIdPublic } = req.body;
      let imageUploadedUrl: string | undefined;
      if (req.file) {
        const localPath = `public/images/analyze/${req.file.filename}`;
        const imageUploaded = await cloudinaryUploadImage(localPath);
        imageUploadedUrl = imageUploaded.url;
        fs.unlinkSync(localPath);
      }
      try {
        const updateData: any = { title, description };
        if (imageUploadedUrl) {
          updateData.image = imageUploadedUrl;
        } else if (image) {
          updateData.image = image;
        }
        const analyze = await Analysis.findByIdAndUpdate(postIdPublic, updateData, {
          new: true,
        });
        res.json({_id:postIdPublic, analyze: analyze, message: "Analyze edited successfully"  });
      } catch (error) {
        res.json(error);
      }
    }
      else{
        throw new Error("You are not authorized to edit this Analyze")
      }
    
  }
);

//Delete Post
export const deleteAnalyze = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    const userId = req.userId;
    const targetUser = req.body.targetUser;
    const userData = await Users.findById(userId);
    blockUser(userData);
    verifyUser(userData);
    analysatorUser(userData)
    console.log(targetUser)
    if (targetUser === userId || userData.isAdmin) {
      const { postIdPublic } = req.body;
      try {
        const analyze = await Analysis.findByIdAndDelete(postIdPublic, {
          new: true,
        });
        res.json({ _id:postIdPublic,analyze: analyze, message: "Analyze deleted successfully" });
      } catch (error) {
        res.json(error);
      }
    }else{
      throw new Error("You are not authorized to delete this Analyze")
    }
  }
);

//like Analyze
export const toggleLikeAnalyze = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    const { postIdPublic } = req.body;
    const analyze = await Analysis.findById(postIdPublic);
    const userId = req.userId;
    const userData = await Users.findById(userId);
    verifyUser(userData);
    const alreadyDisliked = analyze.disLikes.find(
      (loginId) => loginId.toString() === userId.toString()
    );
    const alreadyLiked = analyze.likes.find(
      (loginId) => loginId.toString() === userId.toString()
    );
    if (alreadyDisliked) {
      await Analysis.findByIdAndUpdate(
        postIdPublic,
        {
          $pull: { disLikes: userId },
        },
        { new: true }
      );
    }
    if (alreadyLiked) {
      const analyze = await Analysis.findByIdAndUpdate(
        postIdPublic,
        {
          $pull: { likes: userId },
        },
        { new: true }
      );
      res.json({
        _id: postIdPublic,
        analyze: analyze,
        message: "success",
        isliked:false
      });
    } else {
      const analyze = await Analysis.findByIdAndUpdate(
        postIdPublic,
        {
          $push: { likes: userId },
        },
        {
          new: true,
        }
      );
      res.json({
        _id: postIdPublic,
        analyze: analyze,
        message: "success",
        isLiked:true
      });
    }
  }
);

//dislike Post
export const toggleDisikeAnalyze = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    const { postIdPublic } = req.body;
    const analyze = await Analysis.findById(postIdPublic);
    const userId = req.userId;
    const userData = await Users.findById(userId);
    verifyUser(userData);
    const alreadyLiked = analyze.likes.find(
      (loginId) => loginId.toString() === userId.toString()
    );
    const alreadyDisliked = analyze.disLikes.find(
      (loginId) => loginId.toString() === userId.toString()
    );
    if (alreadyLiked) {
      await Analysis.findByIdAndUpdate(
        postIdPublic,
        {
          $pull: { likes: userId },
        },
        { new: true }
      );
    }
    if (alreadyDisliked) {
      const analyze = await Analysis.findByIdAndUpdate(
        postIdPublic,
        {
          $pull: { disLikes: userId },
        },
        { new: true }
      );
      res.json({
        _id: postIdPublic,
        analyze: analyze,
        message: "success",
        isDisliked:false
      });
    } else {
      const analyze = await Analysis.findByIdAndUpdate(
        postIdPublic,
        {
          $push: { disLikes: userId },
        },
        {
          new: true,
        }
      );
      res.json({
        _id: postIdPublic,
        analyze: analyze,
        message: "success",
        isDisliked:true
      });
    }
  }
);

export const incrementAnalyzeViews = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    try {
      const { postIdPublic } = req.body;
      const analyze = await Analysis.findById(postIdPublic);
      if (analyze) {
        analyze.numViews += 1;
        await analyze.save();
        res.json({ _id: postIdPublic, analyze: analyze, message: "Views incremented successfully" });
      } else {
        throw new Error("Post not found");
      }
    } catch (error) {
      res.json({ error: "Error incrementing post views" });
    }
  }
);

