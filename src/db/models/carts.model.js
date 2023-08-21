import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
  products: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      quantity: Number,
    },
  ],
});

const Cart = mongoose.model('Cart', cartSchema);

export default Cart;

