import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
  id: Number,
  products: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      quantity: Number,
    },
  ],
});

const Cart = mongoose.model('Cart', cartSchema);

export default Cart;
