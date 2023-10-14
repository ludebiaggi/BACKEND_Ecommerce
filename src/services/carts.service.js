import { MongoCartManager } from '../DATA/DAOs/cartsMongo.dao.js';

class CartService {
  constructor() {
    this.cartManager = new MongoCartManager();
  }

  async createCart() {
    try {
      const newCart = await this.cartManager.createCart();
      return { message: 'Carrito creado', cart: newCart };
    } catch (error) {
      throw new Error('Error al intentar crear el carrito');
    }
  }

  async getCartById(cartId) {
    try {
      const cart = await this.cartManager.getCartById(cartId);
      return cart;
    } catch (error) {
      throw new Error('Error al obtener el carrito');
    }
  }

  async addProductToCart(cartId, productId, quantity) {
    try {
      const cart = await this.cartManager.addProductToCart(cartId, productId, quantity);
      return this.calculateTotalAmount(cart);
    } catch (error) {
      throw new Error('Error al agregar el producto al carrito');
    }
  }

  async removeProductFromCart(cartId, productId) {
    try {
      const cart = await this.cartManager.removeProductFromCart(cartId, productId);
      return { message: 'Producto eliminado del carrito', cart };
    } catch (error) {
      throw new Error('Error al eliminar el producto del carrito');
    }
  }

  async updateCart(cartId, newProducts) {
    try {
      const cart = await this.cartManager.updateCart(cartId, newProducts);
      return { message: 'Carrito actualizado', cart };
    } catch (error) {
      throw new Error('Error al actualizar el carrito');
    }
  }

  async updateProductQuantity(cartId, productId, newQuantity) {
    try {
      const cart = await this.cartManager.updateProductQuantity(cartId, productId, newQuantity);
      return { message: 'Cantidad actualizada', cart };
    } catch (error) {
      throw new Error('Error al actualizar la cantidad del producto en el carrito');
    }
  }

  async clearCart(cartId) {
    try {
      const cart = await this.cartManager.clearCart(cartId);
      return { message: 'Se han eliminado todos los productos del carrito', cart };
    } catch (error) {
      throw new Error('Error al vaciar el carrito');
    }
  }

  async getPopulatedCartById(cartId) {
    try {
      const cart = await this.cartManager.getPopulatedCartById(cartId);
      return { success: true, message: 'Carrito obtenido exitosamente', cart };
    } catch (error) {
      throw new Error('Error al obtener el carrito');
    }
  }

  //Nueva función para calcular totalAmount
  async calculateTotalAmount(cart) {
    try {
      const productIds = cart.products.map((item) => item.product);
      const products = await productService.getProductsByIds(productIds);
  
      let totalAmount = 0;
      for (const item of cart.products) {
        const product = products.find((p) => p._id.equals(item.product));
        if (product) {
          totalAmount += product.price * item.quantity;
        }
      }
  
      cart.totalAmount = totalAmount;
      await cart.save();
  
      return cart;
    } catch (error) {
      throw new Error('Error al calcular el totalAmount');
    }
  }

}

export const cartService = new CartService();
