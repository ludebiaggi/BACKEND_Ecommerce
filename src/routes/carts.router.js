//Router para manejar todos los endpoint asociados a los Carritos.
import { Router } from 'express';
import { CartManager } from '../managers/cartManager.js';

const router = Router();
const cartManagerInstance = new CartManager('./carts.json');

// Endpoint POST /api/carts (Creará un nuevo carrito)
router.post('/', (req, res) => {
  const newCart = cartManagerInstance.createCart();
  res.status(201).json(newCart);
});

// Endpoint GET /api/carts/:cid (Listará los productos de un carrito, si no hay productos traerá un array vacío)
router.get('/:cid', async (req, res) => {
  const cartId = parseInt(req.params.cid);
  const cart = await cartManagerInstance.getCartById(cartId);

  if (!cart) {
    return res.status(404).json({ error: 'Carrito no encontrado' });
  }

  res.json(cart.products);
});

// Endpoint POST /api/carts/:cid/product/:pid (Agregará un producto al carrito )
router.post('/:cid/product/:pid', async (req, res) => {
  const cartId = parseInt(req.params.cid);
  const productId = parseInt(req.params.pid);
  const { quantity } = req.body;

  if (!quantity || isNaN(quantity)) {
    return res.status(400).json({ error: 'Cantidad no válida' });
  }

  const cart = cartManagerInstance.addProductToCart(cartId, productId, quantity);
  if (!cart) {
    return res.status(404).json({ error: 'Carrito no encontrado' });
  }

  res.json(cart);
});

export default router;

