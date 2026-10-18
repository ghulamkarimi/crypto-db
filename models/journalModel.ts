import mongoose from "mongoose";

const journalSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    baseCoin: {
      type: String,
      required: true,
    },
    quoteCoin: {
      type: String,
      required: true,
    },
    tradeType: {
      type: String,
      required: true,
    },
    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
    },
    startDate: {
      type: String,
      required: true,
    },
    endDate: {
      type: String,
    },
    price: {
      type: Number,
      required: true,
    },

    takeProfit: {
      type: Number,
      required: true,
    },
    stopLoss: {
      type: Number,
      required: true,
    },
    riskReward: {
      type: Number,
      required: true,
    },

    reasonsforEntry: {
      type: String,
      required: true,
    },
    isClose: {
      type: Boolean,
      default: false,
    },
    results: {
      type: Boolean,
    },
    profit: {
      type: Number,
    },
    loss: {
      type: Number,
    },
    tradeSummary: {
      type: String,
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
    timestamps: true,
  }
);

const Journals = mongoose.model("Journal", journalSchema);
export default Journals;
