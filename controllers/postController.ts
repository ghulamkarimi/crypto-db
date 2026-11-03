import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import Posts from "../models/postModel";
import { blockUser } from "../utils/blockUser";
import { verifyUser } from "../utils/verifyUser";
import { IPost } from "../interface";
import { cloudinaryUploadImage } from "../utils/cloudinary";
import fs from "fs";
import Users from "../models/userModel";


interface CustomRequest extends Request {
  userId?: IPost;
  targetUser?: IPost;
  postIdPublic?: IPost;
}

//View all Posts
export const getAllPosts = asyncHandler(async (req: Request, res: Response) => {
  try {
    const post = await Posts.find();
    res.json(post);
  } catch (error) {
    res.json(error);
  }
});

//create a Post
export const createPost = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    console.log("create");
    const userId = req.userId;
    const userData = await Users.findById(userId);
    blockUser(userData);
    verifyUser(userData);
    const { title, description } = req.body;
    const localPath = `public/images/posts/${req.file.filename}`;
    const imageUploaded = await cloudinaryUploadImage(localPath);
    try {
      const post = await Posts.create({
        user: userId,
        title,
        image: imageUploaded.url,
        description,
      });
      res.json({ post: post, message: "Post created successfully" });
      fs.unlinkSync(localPath);
    } catch (error) {
      res.json(error);
    }
  }
);

//edit Post
export const editPost = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    const userId = req.userId;
    const targetUser = req.body.targetUser;
    const userData = await Users.findById(userId);
    console.log("userId: ", userId);
    console.log("targetUser: ", targetUser);
    blockUser(userData);
    verifyUser(userData);
    if (targetUser === userId || userData.isAdmin) {
      const { title, description, image, postIdPublic } = req.body;
      let imageUploadedUrl: string | undefined;
      if (req.file) {
        const localPath = `public/images/posts/${req.file.filename}`;
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
        const post = await Posts.findByIdAndUpdate(postIdPublic, updateData, {
          new: true,
        });
        res.json({
          _id: postIdPublic,
          post: post,
          message: "Post edited successfully",
        });
      } catch (error) {
        res.json(error);
      }
    } else {
      throw new Error("You are not authorized to edit this post");
    }
  }
);

//Delete Post
export const deletePost = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    console.log("first");
    const userId = req.userId;
    const { postIdPublic, targetUser } = req.body;
    const userData = await Users.findById(userId);
    blockUser(userData);
    verifyUser(userData);
    if (targetUser === userId || userData.isAdmin) {
      try {
        const post = await Posts.findByIdAndDelete(postIdPublic, {
          new: true,
        });
        res.json({
          _id: postIdPublic,
          post: post,
          message: "Post deleted successfully",
        });
      } catch (error) {
        res.json(error);
      }
    } else {
      throw new Error("You are not authorized to delete this post");
    }
  }
);

//like Post
export const toggleLikePost = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    const { postIdPublic } = req.body;
    const post = await Posts.findById(postIdPublic);
    const userId = req.userId;
    const userData = await Users.findById(userId);
    verifyUser(userData);
    const alreadyDisliked = post.disLikes.find(
      (loginId) => loginId.toString() === userId.toString()
    );
    const alreadyLiked = post.likes.find(
      (loginId) => loginId.toString() === userId.toString()
    );
    if (alreadyDisliked) {
      await Posts.findByIdAndUpdate(
        postIdPublic,
        {
          $pull: { disLikes: userId },
        },
        { new: true }
      );
    }
    if (alreadyLiked) {
      const post = await Posts.findByIdAndUpdate(
        postIdPublic,
        {
          $pull: { likes: userId },
        },
        { new: true }
      );
      res.json({
        _id: postIdPublic,
        post: post,
        message: "success",
        isliked: false,
      });
    } else {
      const post = await Posts.findByIdAndUpdate(
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
        post: post,
        message: "success",
        isLiked: true,
      });
    }
  }
);

//dislike Post
export const toggleDisikePost = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    const { postIdPublic } = req.body;
    const post = await Posts.findById(postIdPublic);
    const userId = req.userId;
    const userData = await Users.findById(userId);
    verifyUser(userData);
    const alreadyLiked = post.likes.find(
      (loginId) => loginId.toString() === userId.toString()
    );
    const alreadyDisliked = post.disLikes.find(
      (loginId) => loginId.toString() === userId.toString()
    );
    if (alreadyLiked) {
      await Posts.findByIdAndUpdate(
        postIdPublic,
        {
          $pull: { likes: userId },
        },
        { new: true }
      );
    }
    if (alreadyDisliked) {
      const post = await Posts.findByIdAndUpdate(
        postIdPublic,
        {
          $pull: { disLikes: userId },
        },
        { new: true }
      );
      res.json({
        _id: postIdPublic,
        post: post,
        message: "success",
        isDisliked: false,
      });
    } else {
      const post = await Posts.findByIdAndUpdate(
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
        post: post,
        message: "success",
        isDisliked: true,
      });
    }
  }
);

export const incrementPostViews = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    try {
      const { postIdPublic } = req.body;
      const post = await Posts.findById(postIdPublic);
      if (post) {
        post.numViews += 1;
        await post.save();
        res.json({ _id: postIdPublic, post: post, message: "Views incremented successfully" });
      } else {
        throw new Error("Post not found");
      }
    } catch (error) {
      res.json({ error: "Error incrementing post views" });
    }
  }
);
