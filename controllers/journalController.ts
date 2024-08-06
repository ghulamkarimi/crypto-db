import asyncHandler from "express-async-handler";
import Journals from "../models/journalModel";
import { Request, Response } from "express";
import { IJournal } from "../interface";

interface CustomRequest extends Request {
  userId?: IJournal;
}

export const getAllJournals = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const journals = await Journals.find();
      res.json(journals);
    } catch (error) {
      res.json(error);
    }
  }
);

export const createJournal = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    const userId = req.userId;
    const {
      baseCoin,
      quoteCoin,
      tradeType,
      startTime,
      startDate,
      price,
      takeProfit,
      stopLoss,
      riskReward,
      reasonsforEntry,
    } = req.body;
    try {
      const journal = await Journals.create({
        baseCoin,
        quoteCoin,
        tradeType,
        startTime,
        startDate,
        price,
        takeProfit,
        stopLoss,
        riskReward,
        reasonsforEntry,
        user: userId,
      });
      res.json({ journal, message: "journal created successfully" });
    } catch (error) {
      res.json(error);
    }
  }
);

export const editJournalOpen = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    const { journalId } = req.params;
    const {
      baseCoin,
      quoteCoin,
      tradeType,
      startTime,
      price,
      takeProfit,
      stopLoss,
      riskReward,
      reasonsforEntry,
    } = req.body;
    try {
      const journal = await Journals.findByIdAndUpdate(
        journalId,
        {
          baseCoin,
          quoteCoin,
          tradeType,
          startTime,
          price,
          takeProfit,
          stopLoss,
          riskReward,
          reasonsforEntry,
        },
        {
          new: true,
        }
      );
      res.json({
        _id: journalId,
        journal,
        message: "journal Edited successfully",
      });
    } catch (error) {
      res.json(error);
    }
  }
);



export const journalPositionClose = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    const { journalId } = req.params;
    const {
      baseCoin,
      quoteCoin,
      tradeType,
      startTime,
      price,
      takeProfit,
      stopLoss,
      riskReward,
      reasonsforEntry,
      isClose,
      results,
      profit,
      loss,
      endDate,
      endTime,
      tradeSummary,
    } = req.body;
    try {
      const journal = await Journals.findByIdAndUpdate(
        journalId,
        {
          baseCoin,
          quoteCoin,
          tradeType,
          startTime,
          price,
          takeProfit,
          stopLoss,
          riskReward,
          reasonsforEntry,
          isClose,
          results,
          profit,
          loss,
          endDate,
          endTime,
          tradeSummary,
        },
        {
          new: true,
        }
      );
      res.json({
        _id: journalId,
        journal,
        message: "Position Closed successfully",
      });
    } catch (error) {
      res.json(error);
    }
  }
);

export const deleteJournalPosition = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    const { journalId } = req.params;
    try {
      const journal = await Journals.findByIdAndDelete(journalId, {
        new: true,
      });
      res.json({
        _id: journalId,
        journal,
        message: "Posetion Deleted successfully",
      });
    } catch (error) {
      res.json(error);
    }
  }
);
