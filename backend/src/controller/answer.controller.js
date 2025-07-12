import Answer from "../models/Answer.model.js";
import Question from "../models/Question.model.js";
import mongoose from "mongoose";

export const createAnswer = async (req, res) => {
  try {
    const { questionId } = req.params;
    const { content } = req.body;

    // Validate question exists
    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ error: "Question not found" });
    }

    const answer = new Answer({
      question: questionId,
      content,
      author: req.userId,
      votes: 0,
      isPinned: false
    });

    await answer.save();

    return res.status(201).json({ message: "Answer created", answer });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const updateAnswer = async (req, res) => {
  try {
    const { answerId } = req.params;
    const { content } = req.body;

    const answer = await Answer.findById(answerId);

    if (!answer) {
      return res.status(404).json({ error: "Answer not found" });
    }

    // Check if user is owner
    if (answer.author.toString() !== req.userId) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    answer.content = content;
    await answer.save();

    return res.json({ message: "Answer updated", answer });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const deleteAnswer = async (req, res) => {
  try {
    const { answerId } = req.params;

    const answer = await Answer.findById(answerId);

    if (!answer) {
      return res.status(404).json({ error: "Answer not found" });
    }

    // Check if user is owner or admin
    if (answer.author.toString() !== req.userId && req.userRole !== "admin") {
      return res.status(403).json({ error: "Unauthorized" });
    }

    await answer.deleteOne();

    return res.json({ message: "Answer deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const voteAnswer = async (req, res) => {
  try {
    const { answerId } = req.params;
    const { vote } = req.body; // vote = +1 or -1

    const answer = await Answer.findById(answerId);
    if (!answer) {
      return res.status(404).json({ error: "Answer not found" });
    }

    answer.votes += vote;
    await answer.save();

    return res.json({ message: "Vote updated", votes: answer.votes });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
