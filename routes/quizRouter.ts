import express from "express";
import { createQuiz, getAllQuestions, getRandomQuestions } from "../controllers/quizController";


const router = express.Router();



router.get("/api/v1/quiz", getAllQuestions);
router.get("/api/v1/quiz/random-question", getRandomQuestions);
router.post("/api/v1/quiz/create", createQuiz);

export default router;
