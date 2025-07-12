import mongoose from 'mongoose';

const mentionSchema = new mongoose.Schema({
  sourceType: { type: String, enum: ['question', 'answer', 'comment'], required: true },
  sourceId: { type: mongoose.Schema.Types.ObjectId, required: true },
  mentionedUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

export default mongoose.model('Mention', mentionSchema);
