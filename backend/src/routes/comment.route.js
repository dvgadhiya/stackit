import express from "express";
import {
  createComment,
  updateComment,
  deleteComment,
  getCommentsByAnswer
} from "../controller/comment.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();

// Create comment
router.post("/answer/:answerId", verifyToken, createComment);

// Update comment
router.put("/:commentId", verifyToken, updateComment);

// Delete comment
router.delete("/:commentId", verifyToken, deleteComment);

// Get comments for an answer
router.get("/answer/:answerId", getCommentsByAnswer);

export default router;
