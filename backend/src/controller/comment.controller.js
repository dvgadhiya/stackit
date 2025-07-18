import Comment from "../models/Comment.model.js";
import Answer from "../models/Answer.model.js";
import User from "../models/User.model.js";
import Notification from "../models/Notification.model.js";
import { extractMentions } from "../utils/extractMentions.js";
import Mention from "../models/Mention.model.js";


export const createComment = async (req, res) => {
  try {
    const { answerId } = req.params;
    const { content } = req.body;

    // Ensure answer exists
    const answer = await Answer.findById(answerId);
    if (!answer) {
      return res.status(404).json({ error: "Answer not found" });
    }

    // Save comment
    const comment = new Comment({
      answer: answerId,
      user: req.userId,
      content
    });

    await comment.save();

    // Handle mentions
    const mentions = extractMentions(content);

    for (const username of mentions) {
      const mentionedUser = await User.findOne({ username });

      if (mentionedUser) {
        // Create a Mention document
        await Mention.create({
            sourceId: comment._id,
            sourceType: "comment",
            mentionedUser: mentionedUser._id,
            byUser: req.userId
        });

        // Create a notification
        await Notification.create({
        referenceId: answerId,
        type: "mention",
        recipientUser: mentionedUser._id,
        message: `${req.userId} mentioned you in a comment.`,
        link: `/answer/${answerId}`
        });
      }
    }

    return res.status(201).json({ message: "Comment created", comment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const updateComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { content } = req.body;

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    if (comment.user.toString() !== req.userId) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    comment.content = content;
    await comment.save();

    return res.json({ message: "Comment updated", comment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    if (comment.user.toString() !== req.userId && req.userRole !== "admin") {
      return res.status(403).json({ error: "Unauthorized" });
    }

    await comment.deleteOne();

    return res.json({ message: "Comment deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const getCommentsByAnswer = async (req, res) => {
  try {
    const { answerId } = req.params;

    const comments = await Comment.find({ answer: answerId })
      .populate("user", "username")
      .sort({ createdAt: -1 });

    return res.json(comments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const voteComment = async (req, res) => {
  const commentId = req.params.id;
  const { type } = req.body; // 'up' or 'down'
  const userId = req.user?.id || req.userId;

  try {
    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({ error: "Comment not found" });

    // Remove previous vote
    comment.upvotes.pull(userId);
    comment.downvotes.pull(userId);

    // Add new vote
    if (type === "up") {
      comment.upvotes.push(userId);
    } else if (type === "down") {
      comment.downvotes.push(userId);
    }

    await comment.save();
    const updatedComment = await Comment.findById(commentId);

    res.json({
      message: "Vote updated",
      votes: updatedComment.upvotes.length - updatedComment.downvotes.length,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
