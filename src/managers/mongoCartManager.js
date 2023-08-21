import Cart from '../db/models/carts.model.js';

class MongoCartManager {
  constructor() {
    this.carts = [];
    this.lastCartId = 0;
    this.loadCarts();
  }

  async loadCarts() {
    try {
      this.carts = await Cart.find();
    } catch (error) {
      throw new Error('Error al cargar carritos: ' + error.message);
    }
  }

  async saveCarts() {
    try {
      await Cart.insertMany(this.carts);
      console.log('Se guardaron los carritos');
    } catch (error) {
      throw new Error('Error al guardar los carritos: ' + error.message);
    }
  }
  
  async createCart() {
    const newCart = new Cart({
      products: [],
    });
  
    try {
      const savedCart = await newCart.save();
      console.log(`Carrito creado, su ID es: ${savedCart._id}`);
      this.carts.push(savedCart);
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
      await this.saveCarts();
      console.log(`Producto agregado al carrito ${cartId}`);
    } catch (error) {
      throw new Error('Error al guardar los carritos: ' + error.message);
    }

    return cart;
}

}

export { MongoCartManager };
