import { MongoCartManager } from '../DAL/DAOs/cartsMongo.dao.js';

const cartManager = new MongoCartManager();

class CartController {
  async createCart(req, res) {
    try {
      const newCart = await cartManager.createCart();
      res.status(201).json({ cart: newCart });
    } catch (error) {
      res.status(500).json({ error: 'Error al intentar crear el carrito' });
    }
  }

  async addProductToCart(req, res) {
    const { cartId } = req.params;
    const { productId, quantity } = req.body;

    try {
      const cart = await cartManager.addProductToCart(cartId, productId, quantity);
      res.status(200).json({ cart });
    } catch (error) {
      res.status(500).json({ error: 'Error al agregar el producto al carrito' });
    }
  }

  async removeProductFromCart(req, res) {
    const { cartId } = req.params;
    const { productId } = req.body;

    try {
      const cart = await cartManager.removeProductFromCart(cartId, productId);
      res.status(200).json({ cart });
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar el producto del carrito' });
    }
  }

  async updateCart(req, res) {
    const { cartId } = req.params;
    const { newProducts } = req.body;

    try {
      const cart = await cartManager.updateCart(cartId, newProducts);
      res.status(200).json({ cart });
    } catch (error) {
      res.status(500).json({ error: 'Error al actualizar el carrito' });
    }
  }

  async updateProductQuantity(req, res) {
    const { cartId, productId } = req.params;
    const { newQuantity } = req.body;

    try {
      const cart = await cartManager.updateProductQuantity(cartId, productId, newQuantity);
      res.status(200).json({ cart });
    } catch (error) {
      res.status(500).json({ error: 'Error al actualizar la cantidad del producto en el carrito' });
    }
  }

  async clearCart(req, res) {
    const { cartId } = req.params;

    try {
      const cart = await cartManager.clearCart(cartId);
      res.status(200).json({ cart });
    } catch (error) {
      res.status(500).json({ error: 'Error al vaciar el carrito' });
    }
  }

  async getPopulatedCartById(req, res) {
    const { cartId } = req.params;

    try {
      const cart = await cartManager.getPopulatedCartById(cartId);
      res.status(200).json({ cart });
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener el carrito poblado por su ID' });
    }
  }
}

export const cartController = new CartController();
