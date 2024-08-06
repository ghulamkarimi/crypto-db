import asyncHandler from "express-async-handler";
import { IPost } from "../interface";
import { Request, Response } from "express";
import Comments from "../models/commentModel";
import { populate } from "dotenv";
import Users from "../models/userModel";
import { blockUser } from "../utils/blockUser";
import { verifyUser } from "../utils/verifyUser";

interface CustomRequest extends Request {
  userId?: IPost;
  postIdPublic?: IPost;
  commentIdPublic:IPost
}

export const getComments = asyncHandler(async (req, res) => {
  try {
    const comments = await Comments.find().populate("user");
    res.json(comments);
  } catch (error) {
    res.json(error);
  }
});

export const getPostComments = asyncHandler(async (req, res) => {
  try {
    const { postIdPublic } = req.body;
    const comments = await Comments.findOne({ post: postIdPublic }).populate(
      "user"
    );
    res.json({ comment: comments });
  } catch (error) {
    res.json(error);
  }
});

export const createComment = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    const userId = req.userId;

    const userData = await Users.findById(userId);
    blockUser(userData);
    verifyUser(userData);
    const { postIdPublic, comment } = req.body;
    try {
      const comments = await Comments.create({
        post: postIdPublic,
        comment,
        user: userId,
      });
      await comments.populate("user");
      res.json({
        comment: comments,
        message: "Your comment has been successfully registered.",
      });
    } catch (error) {
      res.json(error);
    }
  }
);

//edit Comment
export const editComment = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    const userId = req.userId;
    const targetUser = req.body.targetUser;
    const userData = await Users.findById(userId);
    blockUser(userData);
    verifyUser(userData);
    if (targetUser === userId || userData.isAdmin) {
     
      try {
        const {  comment, commentIdPublic } = req.body;
        const comments = await Comments.findByIdAndUpdate(commentIdPublic, {
          comment:comment
        }, {
          new: true,
        });
        await comments.populate("user");
        res.json({
          _id: commentIdPublic,
          comment: comments,
          message: "Comment edited successfully",
        });
      } catch (error) {
        res.json(error);
      }
    } else {
      throw new Error("You are not authorized to edit this post");
    }
  }
);

//Delete Comment
export const deleteComment = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    const userId = req.userId;
    const { commentIdPublic, targetUser } = req.body;
    const userData = await Users.findById(userId);
    blockUser(userData);
    verifyUser(userData);
    if (targetUser === userId || userData.isAdmin) {
      try {
        const comment = await Comments.findByIdAndDelete(commentIdPublic, {
          new: true,
        });
        res.json({
          _id: commentIdPublic,
          comment: comment,
          message: "Comment deleted successfully",
        });
      } catch (error) {
        res.json(error);
      }
    } else {
      throw new Error("You are not authorized to delete this Comment");
    }
  }
);

//like Comment
export const toggleLikeComment = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    const { commentIdPublic } = req.body;
    const comment = await Comments.findById(commentIdPublic);
    const userId = req.userId;
    const userData = await Users.findById(userId);
    verifyUser(userData);
    const alreadyDisliked = comment.disLikes.find(
      (loginId) => loginId.toString() === userId.toString()
    );
    const alreadyLiked = comment.likes.find(
      (loginId) => loginId.toString() === userId.toString()
    );
    if (alreadyDisliked) {
      await Comments.findByIdAndUpdate(
        commentIdPublic,
        {
          $pull: { disLikes: userId },
        },
        { new: true }
      );
    }
    if (alreadyLiked) {
      const comment = await Comments.findByIdAndUpdate(
        commentIdPublic,
        {
          $pull: { likes: userId },
        },
        { new: true }
      );
      res.json({
        _id: commentIdPublic,
        comment: comment,
        message: "success",
        isliked: false,
      });
    } else {
      const comment = await Comments.findByIdAndUpdate(
        commentIdPublic,
        {
          $push: { likes: userId },
        },
        {
          new: true,
        }
      );
      res.json({
        _id: commentIdPublic,
        comment: comment,
        message: "success",
        isLiked: true,
      });
    }
  }
);

//dislike Post
export const toggleDisikeComment = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    const { commentIdPublic } = req.body;
    const comment = await Comments.findById(commentIdPublic);
    const userId = req.userId;
    const userData = await Users.findById(userId);
    verifyUser(userData);
    const alreadyLiked = comment.likes.find(
      (loginId) => loginId.toString() === userId.toString()
    );
    const alreadyDisliked = comment.disLikes.find(
      (loginId) => loginId.toString() === userId.toString()
    );
    if (alreadyLiked) {
      await Comments.findByIdAndUpdate(
        commentIdPublic,
        {
          $pull: { likes: userId },
        },
        { new: true }
      );
    }
    if (alreadyDisliked) {
      const comment = await Comments.findByIdAndUpdate(
        commentIdPublic,
        {
          $pull: { disLikes: userId },
        },
        { new: true }
      );
      res.json({
        _id: commentIdPublic,
        comment: comment,
        message: "success",
        isDisliked: false,
      });
    } else {
      const comment = await Comments.findByIdAndUpdate(
        commentIdPublic,
        {
          $push: { disLikes: userId },
        },
        {
          new: true,
        }
      );
      res.json({
        _id: commentIdPublic,
        comment: comment,
        message: "success",
        isDisliked: true,
      });
    }
  }
);
