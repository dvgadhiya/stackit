import express from "express";
import authRoutes from "./routes/auth.route.js";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello World");
});

app.use("/api/auth", authRoutes);

mongoose.connect('mongodb://localhost:27017/stackit')
  .then(() => {
    console.log('MongoDB connected');
    app.listen(3000, () => {
      console.log('Server running on http://localhost:3000');
    });
  })
  .catch(console.error);