import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema({
  code: {
    type: String,
    unique: true,
    required: true,
  },
  purchase_datetime: {
    type: Date,
    default: Date.now,
  },
  amount: {
    type: Number,
    required: true,
  },
  purchaser: {
    type: String,
    // type:
    // mongoose.Schema.Types.ObjectId, 
    // ref: 'User', //Referimos al model de usuarios para ocupar mail
  },
});

const Ticket = mongoose.model('Ticket', ticketSchema);

export default Ticket;
