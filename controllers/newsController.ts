import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import News from "../models/newsModel";
import fs from "fs";
import { IPost } from "../interface";
import Users from "../models/userModel";
import { blockUser } from "../utils/blockUser";
import { verifyUser } from "../utils/verifyUser";
import { adminUser } from "../utils/adminUser";
import { cloudinaryUploadImage } from "../utils/cloudinary";

interface CustomRequest extends Request {
  userId?: IPost;
}

//View all News
export const getAllNews = asyncHandler(async (req: Request, res: Response) => {
  try {
    const news = await News.find();
    res.json(news);
  } catch (error) {
    res.json(error);
  }
});

//create a News
export const createNews = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    const userId = req.userId;
    const userData = await Users.findById(userId);
    blockUser(userData);
    verifyUser(userData);
    adminUser(userData);
    const { title, description } = req.body;
    const localPath = `public/images/news/${req.file.filename}`;
    const imageUploaded = await cloudinaryUploadImage(localPath);
    try {
      const news = await News.create({
        user: userId,
        title,
        image: imageUploaded.url,
        description,
      });
      res.json({ news: news, message: "success" });
      fs.unlinkSync(localPath);
    } catch (error) {
      res.json(error);
    }
  }
);

//edit News
export const editNews = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    const userId = req.userId;
    const userData = await Users.findById(userId);
    blockUser(userData);
    verifyUser(userData);
    adminUser(userData);
    const { title, description, image, postIdPublic } = req.body;
    let imageUploadedUrl: string | undefined;
    if (req.file) {
      const localPath = `public/images/news/${req.file.filename}`;
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
      const news = await News.findByIdAndUpdate(postIdPublic, updateData, {
        new: true,
      });
      res.json({
        _id: postIdPublic,
        news: news,
        message: "news edited successfully",
      });
    } catch (error) {
      res.json(error);
    }
  }
);

//Delete News
export const deleteNews = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    const userId = req.userId;
    const userData = await Users.findById(userId);
    blockUser(userData);
    verifyUser(userData);
    adminUser(userData);
    const { postIdPublic } = req.body;
    try {
      const news = await News.findByIdAndDelete(postIdPublic, {
        new: true,
      });
      res.json({
        _id: postIdPublic,
        news: news,
        message: "news deleted successfully",
      });
    } catch (error) {
      res.json(error);
    }
  }
);

//like Post
export const toggleLikeNews = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    const { postIdPublic } = req.body;
    const news = await News.findById(postIdPublic);
    const userId = req.userId;
    const userData = await Users.findById(userId);
    verifyUser(userData);
    const alreadyDisliked = news.disLikes.find(
      (loginId) => loginId.toString() === userId.toString()
    );
    const alreadyLiked = news.likes.find(
      (loginId) => loginId.toString() === userId.toString()
    );
    if (alreadyDisliked) {
      await News.findByIdAndUpdate(
        postIdPublic,
        {
          $pull: { disLikes: userId },
        },
        { new: true }
      );
    }
    if (alreadyLiked) {
      const news = await News.findByIdAndUpdate(
        postIdPublic,
        {
          $pull: { likes: userId },
        },
        { new: true }
      );
      res.json({
        _id: postIdPublic,
        news: news,
        message: "success",
        isliked: false,
      });
    } else {
      const news = await News.findByIdAndUpdate(
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
        news: news,
        message: "success",
        isLiked: true,
      });
    }
  }
);

//dislike Post
export const toggleDisikeNews = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    const { postIdPublic } = req.body;
    const news = await News.findById(postIdPublic);
    const userId = req.userId;
    const userData = await Users.findById(userId);
    verifyUser(userData);
    const alreadyLiked = news.likes.find(
      (loginId) => loginId.toString() === userId.toString()
    );
    const alreadyDisliked = news.disLikes.find(
      (loginId) => loginId.toString() === userId.toString()
    );
    if (alreadyLiked) {
      await News.findByIdAndUpdate(
        postIdPublic,
        {
          $pull: { likes: userId },
        },
        { new: true }
      );
    }
    if (alreadyDisliked) {
      const news = await News.findByIdAndUpdate(
        postIdPublic,
        {
          $pull: { disLikes: userId },
        },
        { new: true }
      );
      res.json({
        _id: postIdPublic,
        news: news,
        message: "success",
        isDisliked: false,
      });
    } else {
      const news = await News.findByIdAndUpdate(
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
        news: news,
        message: "success",
        isDisliked: true,
      });
    }
  }
);

export const incrementNewsViews = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    try {
      const { postIdPublic } = req.body;
      const news = await News.findById(postIdPublic);
      if (news) {
        news.numViews += 1;
        await news.save();
        res.json({ _id: postIdPublic, news: news, message: "Views incremented successfully" });
      } else {
        throw new Error("Post not found");
      }
    } catch (error) {
      res.json({ error: "Error incrementing post views" });
    }
  }
);
