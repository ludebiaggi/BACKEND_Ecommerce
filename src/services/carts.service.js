import { MongoCartManager } from '../DAL/DAOs/cartsMongo.dao.js';

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

  async addProductToCart(cartId, productId, quantity) {
    try {
      const cart = await this.cartManager.addProductToCart(cartId, productId, quantity);
      return { message: 'Producto agregado al carrito', cart };
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
}

export const cartService = new CartService();
