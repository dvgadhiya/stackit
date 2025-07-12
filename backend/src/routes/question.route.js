import express from 'express';
import { createQuestion, getAllQuestions, editQuestion, deleteQuestion } from '../controller/question.controller.js';

export const QuestionRoutes = express.Router();

// Create question
QuestionRoutes.post('/', createQuestion);

// Get all questions
QuestionRoutes.get('/', getAllQuestions);

// edit questions
QuestionRoutes.put('/:id', editQuestion);

// delete questions
QuestionRoutes.delete('/:id', deleteQuestion);