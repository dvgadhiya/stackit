import express from "express";
import {authRoutes} from "./routes/auth.route.js";
import {QuestionRoutes} from "./routes/question.route.js";
import mongoose from "mongoose";
import {verifyToken} from "./middleware/auth.middleware.js";
import dotenv from "dotenv";
import {answerRoutes} from "./routes/answer.route.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import commentRoutes from "./routes/comment.route.js";


dotenv.config({ path: './.env' });

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;
const app = express();

app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
    res.send("Hello World");
});

app.use("/api/auth", authRoutes);

//verify token to get roles 
app.use(verifyToken);
app.use("/api/question", QuestionRoutes);
app.use("/api/answer", answerRoutes);
app.use("/api/comment", commentRoutes);

mongoose.connect('mongodb://localhost:27017/stackit')
  .then(() => {
    console.log('MongoDB connected');
    app.listen(3000, () => {
      console.log('Server running on http://localhost:3000');
    });
  })
  .catch(console.error);