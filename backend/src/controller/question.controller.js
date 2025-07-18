// Get a single question by ID (with answers, comments, author, tags)
export const getQuestionById = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id)
      .populate({ path: 'user', select: 'username reputation' })
      .populate('tags');
    if (!question) {
      return res.status(404).json({ message: 'Question not found.' });
    }

    // Populate answers (with author and comments)
    await question.populate({
      path: 'answers',
      populate: [
        { path: 'user', select: 'username reputation' },
        {
          path: 'comments',
          populate: { path: 'user', select: 'username reputation' }
        }
      ]
    });

    // Populate question comments (with author)
    await question.populate({
      path: 'comments',
      populate: { path: 'user', select: 'username reputation' }
    });

    // Format for frontend
    const q = question.toObject();
    q.author = {
       username: q.user?.username || 'Unknown',
      reputation: q.user?.reputation || 0
    };
    q.tags = q.tags?.map(t => t.name) || [];
    q.comments = (q.comments || []).map(c => ({
      ...c,
      author: {
        username: c.user?.username || 'Unknown',
        reputation: c.user?.reputation || 0
      }
    }));
    q.answers = (q.answers || []).map(a => ({
      ...a,
      author: {
        username: a.user?.username || 'Unknown',
        reputation: a.user?.reputation || 0
      },
      comments: (a.comments || []).map(c => ({
        ...c,
        author: {
          username: c.user?.username || 'Unknown',
          reputation: c.user?.reputation || 0
        }
      }))
    }));
    delete q.user;
    res.json({ question: q });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// Get questions for the logged-in user
export const getMyQuestions = async (req, res) => {
  try {
    const questions = await Question.find({ user: req.user.id })
      .populate({ path: 'user', select: 'username reputation' })
      .populate('tags');
    const mapped = questions.map(q => {
      const qObj = q.toObject();
      qObj.author = {
        username: qObj.user?.username || 'Unknown',
        reputation: qObj.user?.reputation || 0
      };
      delete qObj.user;
      return qObj;
    });
    res.json(mapped);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
import Question from '../models/Question.model.js';
import Tag from '../models/Tag.model.js';

// Create question
export const createQuestion = async (req, res) => {
  const { title, description, tagNames } = req.body;
  try {
    const tags = await Promise.all(tagNames.map(async name => {
      let tag = await Tag.findOne({ name });
      if (!tag) tag = await Tag.create({ name });
      return tag._id;
    }));

    const question = await Question.create({
      user: req.user.id, // Use user ID from middleware
      title,
      description,
      tags
    });

    res.status(201).json({ question });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

// Get all questions
export const getAllQuestions = async (req, res) => {
  const questions = await Question.find()
    .populate({ path: 'user', select: 'username reputation' })
    .populate('tags');
  // Map user to author for frontend compatibility
  const mapped = questions.map(q => {
    const qObj = q.toObject();
    qObj.author = {
      username: qObj.user?.username || 'Unknown',
      reputation: qObj.user?.reputation || 0
    };
    delete qObj.user;
    return qObj;
  });
  res.json(mapped);
}

// Edit question (user or admin)
export const editQuestion = async (req, res) => {
    try {
      const question = await Question.findById(req.params.id);
      if (!question) {
        return res.status(404).json({ error: 'Question not found' });
      }
  
      // Check permissions:
      if (
        question.user.toString() !== req.user.id &&
        req.user.role !== 'admin'
      ) {
        return res.status(403).json({ error: 'Not authorized to edit this question' });
      }
  
      // Update fields:
      if (req.body.title) question.title = req.body.title;
      if (req.body.description) question.description = req.body.description;
  
      // If updating tags:
      if (req.body.tagNames) {
        const tags = await Promise.all(req.body.tagNames.map(async name => {
          let tag = await Tag.findOne({ name });
          if (!tag) tag = await Tag.create({ name });
          return tag._id;
        }));
        question.tags = tags;
      }
  
      await question.save();
  
      res.json({
        message: 'Question updated',
        question
      });
  
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
  
  // Delete question (user or admin)
export const deleteQuestion = async (req, res) => {
    try {
      const question = await Question.findById(req.params.id);
      if (!question) {
        return res.status(404).json({ error: 'Question not found' });
      }
  
      if (
        question.user.toString() !== req.user.id &&
        req.user.role !== 'admin'
      ) {
        return res.status(403).json({ error: 'Not authorized to delete this question' });
      }
  
      await question.deleteOne();
  
      res.json({ message: 'Question deleted successfully' });
  
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

export const voteQuestion = async (req, res) => {
  const questionId = req.params.id;
  const { type } = req.body; // 'up' or 'down'
  const userId = req.user?.id || req.userId;

  try {
    const question = await Question.findById(questionId);
    if (!question) return res.status(404).json({ error: "Question not found" });

    // Remove user from both vote arrays to ensure single vote
    question.upvotes.pull(userId);
    question.downvotes.pull(userId);

    // Add vote
    if (type === "up") {
      question.upvotes.push(userId);
    } else if (type === "down") {
      question.downvotes.push(userId);
    }

    await question.save(); // Make sure the vote is persisted

    // Reload or use updated object directly
    const updatedQuestion = await Question.findById(questionId);

    res.json({
      message: "Vote updated",
      votes: updatedQuestion.upvotes.length - updatedQuestion.downvotes.length,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// Get current user's questions
export const getMyQuestions = async (req, res) => {
  try {
    const userId = req.user?.id || req.userId;
    const questions = await Question.find({ user: userId }).populate('tags');
    res.json(questions);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};