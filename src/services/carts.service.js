import { MongoCartManager } from '../DATA/DAOs/cartsMongo.dao.js';
import { productService } from './product.service.js';
import CustomError from '../errors/customErrors.js';
import { ErrorMessages } from '../errors/errorNum.js';



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
      CustomError.createError(ErrorMessages.CART_NOT_FOUND);
    }
  }

  async addProductToCart(cartId, productId, quantity) {
    try {
      const cart = await this.cartManager.addProductToCart(cartId, productId, quantity);
      return this.calculateTotalAmount(cart);
    } catch (error) {
      CustomError.createError(ErrorMessages.ADD_TO_CART_ERROR);
    }
  }


  async removeProductFromCart(cartId, productId) {
    try {
      const cart = await this.cartManager.removeProductFromCart(cartId, productId);
      return { message: 'Producto eliminado del carrito', cart };
    } catch (error) {
      CustomError.createError(ErrorMessages.REMOVE_FROM_CART_ERROR);
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
      CustomError.createError(ErrorMessages.CLEAR_CART_ERROR);
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

  async calculateTotalAmount(cart) {
    try {
      if (!cart) {
        throw new Error('Carrito no encontrado');
      }
  
      let totalAmount = 0;
  
      for (const productInfo of cart.products) {
        const product = await productService.getProductById(productInfo.product);
        if (product) {
          totalAmount += product.price * productInfo.quantity;
        }
      }
  
      cart.totalAmount = totalAmount;
      await this.cartManager.saveCart(cart);
  
      return cart;
    } catch (error) {
      throw new Error('Error al calcular el total: ' + error.message);
    }
  }
  

}

export const cartService = new CartService();
