//Router para manejar todos los endpoint asociados a los Carritos.
import { Router } from 'express';
import { MongoCartManager } from '../DATA/DAOs/cartsMongo.dao.js';
import { isUser } from '../middlewares/auth.middlewares.js';
import { cartService} from '../services/carts.service.js'
import { productService} from '../services/product.service.js'
import { ticketService } from '../services/ticket.service.js';
import { generateUniqueCode } from '../utils/codeGenerator.js';


const router = Router();

const cartManagerInstance = new MongoCartManager();

// Endpoint POST /api/carts (Creará un nuevo carrito) 
router.post('/', (req, res) => {
  const newCart = cartManagerInstance.createCart();
  res.status(201).json(newCart);
});


//Endpoint GET usando el POPULATE de mongoose (/api/carts/:cid)  
router.get('/:cid', async (req, res) => {
  const cartId = req.params.cid;
  try {
    const cart = await cartManagerInstance.getPopulatedCartById(cartId);
    res.json(cart.products);
  } catch (error) {
    res.status(404).json({ error: 'Carrito no encontrado' });
  }
});

// Endpoint POST /api/carts/:cid/product/:pid (Agregará un producto al carrito )
// Se aplica validación isUser
router.post('/:cid/product/:pid', isUser, async (req, res) => {
  const cartId = req.params.cid;  
  const productId = req.params.pid; 
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

// Endpoint DELETE /api/carts/:cid/product/:pid (Eliminará un producto pasando su ID) 
router.delete('/:cid/product/:pid', async (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;

  try {
    const cart = await cartManagerInstance.removeProductFromCart(cartId, productId);
    if (!cart) {
      return res.status(404).json({ error: 'Carrito no encontrado' });
    }
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el producto del carrito' });
  }
});

// Endpoint DELETE /api/carts/:cid (Eliminará TODOS los productos de un carrito)
router.delete('/:cid', async (req, res) => {
  const cartId = req.params.cid;

  try {
    const cart = await cartManagerInstance.clearCart(cartId);
    if (!cart) {
      return res.status(404).json({ error: 'Carrito no encontrado' });
    }
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar todos los productos del carrito' });
  }
});

// Endpoint PUT /api/carts/:cid (Actualizará todo el carrito con un nuevo arreglo de productos) 
router.put('/:cid', async (req, res) => {
  const cartId = req.params.cid;
  const newProducts = req.body.products;

  try {
    console.log(' Nuevos productos recibidos:', newProducts);
    
    const cart = await cartManagerInstance.updateCart(cartId, newProducts);

    console.log('Carrito actualizado:', cart);
    res.json(cart);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error al actualizar el carrito' });
  }
});


// Endpoint PUT /api/carts/:cid/product/:pid (Actualizará sólo la cantidad de un producto específico del carrito) 
router.put('/:cid/product/:pid', async (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;
  const newQuantity = req.body.quantity;

  try {
    const cart = await cartManagerInstance.updateProductQuantity(cartId, productId, newQuantity);
    if (!cart) {
      return res.status(404).json({ error: 'Carrito no encontrado' });
    }
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar la cantidad de productos en el carrito' });
  }
});

// Agrega la nueva ruta para realizar la compra
router.post('/:cid/purchase', async (req, res) => {
  const cartId = req.params.cid;

  try {
    // Obtén el carrito actual
    const cart = await cartService.getCartById(cartId);

    if (!cart) {
      return res.status(404).json({ error: 'Carrito no encontrado' });
    }

    // Recorre los productos en el carrito y verifica el stock
    for (const productInfo of cart.products) {
      const product = await productService.getProductById(productInfo.product);
      if (!product) {
        return res.status(404).json({ error: 'Producto no encontrado' });
      }

      if (product.stock < productInfo.quantity) {
        return res.status(400).json({ error: 'No hay suficiente stock para el producto ' + product.name });
      }

      // Actualiza el stock del producto
      product.stock -= productInfo.quantity;
      await product.save();
    }

    // Genera un ticket con los datos de la compra
    const ticketData = {
      // Puedes agregar más detalles según tus necesidades
      code: await generateUniqueCode(), 
      purchase_datetime: new Date(),
      amount: cart.totalAmount, 
      purchaser: 'LOURDES',
    };

    const ticket = await ticketService.createTicket(ticketData);

    // Elimina el carrito después de la compra
    await cartService.clearCart(cartId);

    res.status(201).json({ message: 'Compra exitosa', ticket });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



export default router;

