import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  recipientUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { 
    type: String, 
    enum: ['answer_posted', 'comment_posted', 'mention'],
    required: true
  },
  referenceId: { type: mongoose.Schema.Types.ObjectId, required: true },
  message: { type: String, required: true },
  isRead: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model('Notification', notificationSchema);
