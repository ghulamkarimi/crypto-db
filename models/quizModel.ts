import mongoose from "mongoose";
import { IQuestion } from "../interface";
const quizSchema = new mongoose.Schema<IQuestion>({
  type: {
    type: String,
    enum: ["trueFalse", "singlecorrect_answers", "multiplecorrect_answers"],
  },
  question: {
    type: String,
    required: true,
  },
  choices: {
    type: String,
    required: true,
  },
  correct_answers: {
    type: String,
    required: true,
  },
  score: {
    type: Number,
    required: true,
  },
});

const Quiz = mongoose.model("Quiz", quizSchema);
export default Quiz;
