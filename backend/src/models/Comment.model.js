import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  answer: { type: mongoose.Schema.Types.ObjectId, ref: 'Answer', required: true },
  content: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model('Comment', commentSchema);
