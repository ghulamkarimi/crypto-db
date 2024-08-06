import mongoose from "mongoose";

const quizInfoSchema = new mongoose.Schema({
  time: {
    type: Number,
    default: 5,
  },
  totalQuestion: {
    type: Number,
    default: 20,
  },
});

const QuizInfo = mongoose.model("QuizInfo", quizInfoSchema);

export default QuizInfo;
