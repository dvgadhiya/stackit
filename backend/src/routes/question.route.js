import express from 'express';
import { createQuestion, getAllQuestions, voteQuestion, editQuestion, deleteQuestion } from '../controller/question.controller.js';

export const QuestionRoutes = express.Router();

// Get questions for the logged-in user
QuestionRoutes.get('/my', verifyToken, getMyQuestions);

// Create question
QuestionRoutes.post('/', createQuestion);

// Get all questions
QuestionRoutes.get('/', getAllQuestions);

// Get single question by id
import { getQuestionById } from '../controller/question.controller.js';
QuestionRoutes.get('/:id', getQuestionById);

// edit questions
QuestionRoutes.put('/:id', editQuestion);

// delete questions
QuestionRoutes.delete('/:id', deleteQuestion);

QuestionRoutes.post("/:id/vote", voteUpdate);
