import { cartService } from '../services/carts.service.js';

class CartController {
  async createCart(req, res) {
    try {
      const newCart = await cartService.createCart();
      res.status(201).json({ cart: newCart });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async addProductToCart(req, res) {
    const { cartId } = req.params;
    const { productId, quantity } = req.body;

    try {
      const cart = await cartService.addProductToCart(cartId, productId, quantity);
      //Calculamos el totalAmount
      const updatedCart = await cartService.calculateTotalAmount(cart);
      res.status(200).json({ cart: updatedCart });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async removeProductFromCart(req, res) {
    const { cartId } = req.params;
    const { productId } = req.body;

    try {
      const cart = await cartService.removeProductFromCart(cartId, productId);
      // Calcula el nuevo totalAmount después de eliminar el producto
      const updatedCart = await cartService.calculateTotalAmount(cart);

    res.status(200).json({ cart: updatedCart });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async updateCart(req, res) {
    const { cartId } = req.params;
    const { newProducts } = req.body;

    try {
      const cart = await cartService.updateCart(cartId, newProducts);
      res.status(200).json({ cart });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async updateProductQuantity(req, res) {
    const { cartId, productId } = req.params;
    const { newQuantity } = req.body;

    try {
      const cart = await cartService.updateProductQuantity(cartId, productId, newQuantity);
      res.status(200).json({ cart });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async clearCart(req, res) {
    const { cartId } = req.params;

    try {
      const cart = await cartService.clearCart(cartId);
      const updatedCart = await cartService.calculateTotalAmount(cart);

      res.status(200).json({ cart: updatedCart });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getPopulatedCartById(req, res) {
    const { cartId } = req.params;

    try {
      const cart = await cartService.getPopulatedCartById(cartId);
      res.status(200).json({ cart });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

export const cartController = new CartController();

