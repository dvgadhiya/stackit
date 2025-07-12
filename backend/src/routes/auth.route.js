import express from 'express';
import { register, login, logout, getMe } from '../controller/auth.controller.js';

export const authRoutes = express.Router();
authRoutes.get('/me', getMe);
// REGISTER
authRoutes.post('/register', register);
// LOGIN
authRoutes.post('/login', login);
// LOGOUT
authRoutes.post('/logout', logout);
