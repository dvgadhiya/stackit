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

    res.status(201).json(question);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

// Get all questions
export const getAllQuestions = async (req, res) => {
  const questions = await Question.find().populate('user').populate('tags');
  res.json(questions);
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
  
