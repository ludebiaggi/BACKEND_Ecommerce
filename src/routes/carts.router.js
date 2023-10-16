import { Router } from 'express';
import { MongoCartManager } from '../DATA/DAOs/cartsMongo.dao.js';
import { isUser } from '../middlewares/auth.middlewares.js';
import { cartService} from '../services/carts.service.js'
import { productService} from '../services/product.service.js'
import { ticketService } from '../services/ticket.service.js';
import { generateUniqueCode } from '../utils/codeGenerator.js';
import UsersDto from '../DATA/DTOs/users.dto.js';




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

// Endpont POST /api/carts/:cid/purchase (Realizar compra)
router.post('/:cid/purchase', async (req, res) => {
  const cartId = req.params.cid;

  try {
    const cart = await cartService.getCartById(cartId);
    if (!cart) {
      return res.status(404).json({ error: 'Carrito no encontrado' });
    }
    const productsNotPurchased = [];
    // Recorremos los productos en el carrito y verificamos stock
    for (const productInfo of cart.products) {
      const product = await productService.getProductById(productInfo.product);
      if (!product) {
        return res.status(404).json({ error: 'No se encontró el producto' });
      }
      if (product.stock < productInfo.quantity) {
        productsNotPurchased.push(productInfo.product);
        continue;
      } else {
      product.stock -= productInfo.quantity;
      await product.save();
      }

    }
    cart.productsNotPurchased = productsNotPurchased;

    await cartService.calculateTotalAmount(cart);

    // Valido user --> CHEQUEAR PORQUE NO FUNCIONA DESDE TC PERO SI X WEB
    //const userDto = req.session.user;
    //if (!userDto || !userDto.email) {
    //return res.status(401).json({ error: 'Usuario no autenticado o falta el correo electrónico' });
    //}

    // Ticket con los datos de la compra
    const ticketData = {
      code: await generateUniqueCode(), 
      purchase_datetime: new Date(),
      amount: cart.totalAmount,  
      purchaser: "LOURDES",
      //purchaser: userDto.email, // VER PORQUÉ NO ME FUNCIONA
    };
    const ticket = await ticketService.createTicket(ticketData);

    await cart.save();

    res.status(201).json({ message: 'Compra exitosa', ticket, notPurchasedProducts: productsNotPurchased });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



export default router;


