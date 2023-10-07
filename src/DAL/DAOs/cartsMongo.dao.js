import Cart from '../mongoDB/models/carts.model.js';

class MongoCartManager {
  constructor() {
    this.loadCarts();
  }

  async loadCarts() {
    this.carts = await Cart.find();
  }

  async saveCart(cart) {
    await cart.save();
  }

  async createCart() {
    const newCart = new Cart({
      products: [],
    });

    const savedCart = await this.saveCart(newCart);
    return savedCart;
  }

  async getCartById(id) {
    return await Cart.findById(id);
  }

  async addProductToCart(cartId, productId, quantity) {
    const cart = await this.getCartById(cartId);
    const existingProduct = cart.products.find((p) => p.product.equals(productId));

    if (existingProduct) {
      existingProduct.quantity += quantity || 1;
    } else {
      cart.products.push({ product: productId, quantity: quantity || 1 });
    }

    await this.saveCart(cart);
    return cart;
  }

  async removeProductFromCart(cartId, productId) {
    const cart = await this.getCartById(cartId);
    cart.products = cart.products.filter((p) => !p.product.equals(productId));

    await this.saveCart(cart);
    return cart;
  }

  async updateCart(cartId, newProducts) {
    const cart = await this.getCartById(cartId);

    newProducts.forEach((newProduct) => {
      const existingProduct = cart.products.find(
        (product) => product.product.toString() === newProduct.product
      );

      if (existingProduct) {
        existingProduct.quantity += newProduct.quantity;
      } else {
        cart.products.push(newProduct);
      }
    });

    await this.saveCart(cart);
    return cart;
  }

  async updateProductQuantity(cartId, productId, newQuantity) {
    const cart = await this.getCartById(cartId);
    const product = cart.products.find((p) => p.product.equals(productId));

    if (product) {
      product.quantity += newQuantity;
    } else {
      cart.products.push({ product: productId, quantity: newQuantity });
    }

    await this.saveCart(cart);
    return cart;
  }

  async clearCart(cartId) {
    const cart = await this.getCartById(cartId);
    cart.products = [];

    await this.saveCart(cart);
    return cart;
  }

  async getPopulatedCartById(_id) {
    return await Cart.findById(_id).populate('products.product');
  }
}

export { MongoCartManager };

