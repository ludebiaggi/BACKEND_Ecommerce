import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  user: String,
  message: String,
}, {
  timestamps: true, 
});

const Message = mongoose.model('Message', messageSchema);

export { Message };
