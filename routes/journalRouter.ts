import express from "express";
import {
  journalPositionClose,
  createJournal,
  editJournalOpen,
  getAllJournals,
  deleteJournalPosition,
} from "../controllers/journalController";
import { verifyToken } from "../middlewares/token/verifyToken";

const router = express.Router();

router.get("/api/v1/journals", getAllJournals);
router.post("/api/v1/journals/createJournal", verifyToken, createJournal);
router.put(
  "/api/v1/journals/editJournalOpen/:journalId",
  verifyToken,
  editJournalOpen
);

router.put(
  "/api/v1/journals/journalPositionClose/:journalId",
  verifyToken,
  journalPositionClose
);

router.delete(
  "/api/v1/journals/deleteJournalPosition/:journalId",
  verifyToken,
  deleteJournalPosition
);

export default router;
