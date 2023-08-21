import Cart from '../db/models/carts.model.js';

class MongoCartManager {
  constructor() {
    this.loadCarts();
  }

  async loadCarts() {
    try {
      this.carts = await Cart.find();
    } catch (error) {
      throw new Error('Error al cargar carritos: ' + error.message);
    }
  }

  async saveCart(cart) {
    try {
      await cart.save();
      console.log('Se guardó el carrito');
    } catch (error) {
      throw new Error('Error al guardar el carrito: ' + error.message);
    }
  }

  async createCart() {
    const newCart = new Cart({
      products: [],
    });
    try {
      const savedCart = await this.saveCart(newCart);
      console.log(`Carrito creado, su ID es: ${savedCart._id}`);
      return savedCart;
    } catch (error) {
      console.log('Error al guardar el carrito', error.message);
      throw error;
    }
  }

  async getCartById(id) {
    try {
      const cart = await Cart.findById(id);
      if (cart) {
        return cart;
      } else {
        throw new Error('Carrito no encontrado');
      }
    } catch (error) {
      throw new Error('Error al obtener el carrito: ' + error.message);
    }
  }

  async addProductToCart(cartId, productId, quantity) {
    const cart = await this.getCartById(cartId);
    const existingProduct = cart.products.find((p) => p.product.equals(productId));

    if (existingProduct) {
      existingProduct.quantity += quantity || 1;
    } else {
      cart.products.push({ product: productId, quantity: quantity || 1 });
    }

    try {
      await this.saveCart(cart);
      console.log(`Producto agregado al carrito ${cartId}`);
    } catch (error) {
      throw new Error('Error al guardar el carrito: ' + error.message);
    }

    return cart;
  }
}

export { MongoCartManager };
