import Answer from "../models/Answer.model.js";
import Question from "../models/Question.model.js";

// Create an answer
export const createAnswer = async (req, res) => {
  try {
    const { questionId } = req.params;
    const { content } = req.body;

    // Validate question exists
    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ error: "Question not found" });
    }

    const userId = req.user?.id || req.userId;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
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

// Update an answer
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

// Delete an answer
export const deleteAnswer = async (req, res) => {
  try {
    const { answerId } = req.params;

    const answer = await Answer.findById(answerId);

    if (!answer) {
      return res.status(404).json({ error: "Answer not found" });
    }

    const userId = req.user?.id || req.userId;
    const userRole = req.user?.role || req.userRole;
    if (answer.author.toString() !== userId && userRole !== "admin") {
      return res.status(403).json({ error: "Unauthorized" });
    }

    await answer.deleteOne();

    return res.json({ message: "Answer deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// Vote on an answer
export const voteAnswer = async (req, res) => {
  const answerId = req.params.id;
  const { type } = req.body; // 'up' or 'down'
  const userId = req.user?.id || req.userId;

  try {
    const answer = await Answer.findById(answerId);
    if (!answer) return res.status(404).json({ error: "Answer not found" });

    // Remove previous vote
    answer.upvotes.pull(userId);
    answer.downvotes.pull(userId);

    // Add new vote
    if (type === "up") {
      answer.upvotes.push(userId);
    } else if (type === "down") {
      answer.downvotes.push(userId);
    }

    await answer.save();
    const updatedAnswer = await Answer.findById(answerId);

    res.json({
      message: "Vote updated",
      votes: updatedAnswer.upvotes.length - updatedAnswer.downvotes.length,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
// Get current user's answers
export const getMyAnswers = async (req, res) => {
  try {
    const userId = req.user?.id || req.userId;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const answers = await Answer.find({ author: userId }).populate('question').populate('author', 'username');
    res.json(answers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};