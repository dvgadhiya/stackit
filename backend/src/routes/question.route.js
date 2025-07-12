import express from 'express';
import { createQuestion, getAllQuestions, voteUpdate, editQuestion, deleteQuestion } from '../controller/question.controller.js';

export const QuestionRoutes = express.Router();

// Create question
QuestionRoutes.post('/', createQuestion);

// Get all questions
QuestionRoutes.get('/', getAllQuestions);

// edit questions
QuestionRoutes.put('/:id', editQuestion);

// delete questions
QuestionRoutes.delete('/:id', deleteQuestion);

QuestionRoutes.post("/:id/vote", voteUpdate);
