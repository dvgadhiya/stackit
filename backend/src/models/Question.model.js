import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }],
  votes: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.models.Question || mongoose.model("Question", questionSchema);
