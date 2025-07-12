import express from "express";
import {
  createAnswer,
  updateAnswer,
  deleteAnswer,
  voteAnswer
} from "../controller/answer.controller.js";

import { verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();

// Create an answer
router.post("/question/:questionId", verifyToken, createAnswer);

// Update an answer
router.put("/:answerId", verifyToken, updateAnswer);

// Delete an answer
router.delete("/:answerId", verifyToken, deleteAnswer);

// Vote on an answer
router.post("/:answerId/vote", verifyToken, voteAnswer);

export { router as answerRoutes };
