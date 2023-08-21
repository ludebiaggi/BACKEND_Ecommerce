//Creamos un nuevo manager de CARRITOS para manejar productos con MONGO/MONGOOSE
import Cart from '../db/models/carts.model.js';

class MongoCartManager {
  constructor() {
    this.loadCarts();
  }
  //Cargamos el carrito
  async loadCarts() {
    try {
      this.carts = await Cart.find();
    } catch (error) {
      throw new Error('Error al cargar carritos: ' + error.message);
    }
  }
  //Guardamos el carrito tras u creación o modificación
  async saveCart(cart) {
    try {
      await cart.save();
      console.log('Se guardó el carrito');
    } catch (error) {
      throw new Error('Error al guardar el carrito: ' + error.message);
    }
  }
  //Creamos los carritos utilizando un ID único de Mongo autogenerado automáticamente.
  async createCart() {
    const newCart = new Cart({
      products: [],
    });
    try {
      const savedCart = await this.saveCart(newCart);
      console.log(`Carrito creado, su ID es: ${savedCart._id}`);
      return savedCart;
    } catch (error) {
      console.log('Error al guardar el carrito', error.message);
      throw error;
    }
  }
  //Obtenemos carritos buscando por su ID de Mongo.
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
  //Agregamos productos al carrito, según el ID de cada uno de ellos (id de cart + id de product)
  async addProductToCart(cartId, productId, quantity) {
    const cart = await this.getCartById(cartId);
    const existingProduct = cart.products.find((p) => p.product.equals(productId));
    // Si no se le pasa una cantidad, se sumarán los productos de a uno.
    if (existingProduct) {
      existingProduct.quantity += quantity || 1;  
    } else {
      cart.products.push({ product: productId, quantity: quantity || 1 });
    }

    try {
      await this.saveCart(cart);
      console.log(`Producto agregado al carrito ${cartId}`);
    } catch (error) {
      throw new Error('Error al guardar el carrito: ' + error.message);
    }

    return cart;
  }
}

export { MongoCartManager };
