import mongoose from 'mongoose';

const answerSchema = new mongoose.Schema({
  question: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  description: { type: String, required: true },
  isAccepted: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model('Answer', answerSchema);
