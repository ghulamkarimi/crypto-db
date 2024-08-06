import { Request, Response } from "express";
import Quiz from "../models/quizModel";
import asyncHandler from "express-async-handler";

export const getAllQuestions = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const quiz = await Quiz.find();
      res.json(quiz);
    } catch (error) {
      res.json(error.message);
    }
  }
);

export const getRandomQuestions = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const randomQuestions = await Quiz.aggregate([{ $sample: { size: 20 } }]);
      res.json(randomQuestions);
    } catch (error) {
      res.json(error.message);
    }
  }
);

export const createQuiz = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { type, question, choices, correct_answers, score } = req.body;
    await Quiz.create({
      type,
      question,
      choices,
      correct_answers,
      score,
    });
    res.json("successfully created");
  } catch (error) {
    res.json(error.message);
  }
});
