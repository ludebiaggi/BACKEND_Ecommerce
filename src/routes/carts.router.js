//Router para manejar todos los endpoint asociados a los Carritos.
import { Router } from 'express';

//import { CartManager } from '../managers/cartManager.js';  ---COMENTADO PARA OPERAR CON MONGOOSE

////IMPORTANTE - Comentar la siguiente linea para utilizar la persistencia de datos vía FS
import { MongoCartManager } from '../managers/mongoCartManager.js';

const router = Router();

//const cartManagerInstance = new CartManager('./carts.json');   ---COMENTADO PARA QUE FUNCIONE MONGOOSE

////IMPORTANTE - Comentar la siguiente linea para utilizar la persistencia de datos vía FS
const cartManagerInstance = new MongoCartManager();

// Endpoint POST /api/carts (Creará un nuevo carrito)
router.post('/', (req, res) => {
  const newCart = cartManagerInstance.createCart();
  res.status(201).json(newCart);
});

// Endpoint GET /api/carts/:cid (Listará los productos de un carrito, si no hay productos traerá un array vacío)
router.get('/:cid', async (req, res) => {
  const cartId = req.params.cid; //Le saco el parseInt para que me permita buscar el id de mongo
  try {
    const cart = await cartManagerInstance.getCartById(cartId);
    res.json(cart.products);
  } catch (error) {
    res.status(404).json({ error: 'Carrito no encontrado' });
  }
});

// Endpoint POST /api/carts/:cid/product/:pid (Agregará un producto al carrito )
router.post('/:cid/product/:pid', async (req, res) => {
  const cartId = req.params.cid;  //Le saco el parseInt para que me permita buscar el id de mongo
  const productId = req.params.pid; //Le saco el parseInt para que me permita buscar el id de mongo
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

