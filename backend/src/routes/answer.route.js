import express from "express";

import { verifyToken } from "../middleware/auth.middleware.js";
import {
  createAnswer,
  updateAnswer,
  deleteAnswer,
  voteAnswer,
  getMyAnswers
} from "../controller/answer.controller.js";

const router = express.Router();

// Get answers for the logged-in user
router.get('/my', verifyToken, getMyAnswers);

// Create an answer
router.post("/question/:questionId", verifyToken, createAnswer);

// Update an answer
router.put("/:answerId", verifyToken, updateAnswer);

// Delete an answer
router.delete("/:answerId", verifyToken, deleteAnswer);

// Vote on an answer
router.post("/:answerId/vote", verifyToken, voteAnswer);

export { router as answerRoutes };
