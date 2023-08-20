//Creamos un nuevo manager para manejar productos con MONGO

import { Product } from '../db/models/products.model.js';


class MongoProductManager {
  //Agregar productos
  async addProduct(product) {
    try {
      const newProduct = new Product(product);
      await newProduct.save();
      return newProduct;
    } catch (error) {
      console.log('Error al agregar producto', error.message);
      throw new Error('Error al agregar producto');
    }
  }
  //Obtener productos
  async getProducts() {
    try {
      const products = await Product.find();
      return products;
    } catch (error) {
      console.log('Error al obtener productos', error.message);
      throw new Error('Error al obtener productos');
    }
  }
  //Obtener productos por ID
  async getProductById(id) {
    try {
      const product = await Product.findById(id);
      return product;
    } catch (error) {
      console.log('Error al obtener producto por ID', error.message);
      throw new Error('Error al obtener producto por ID');
    }
  }
  //Actualizar producto
  async updateProduct(id, updatedFields) {
    try {
      const product = await Product.findByIdAndUpdate(id, updatedFields, { new: true });
      return product;
    } catch (error) {
      console.log('Error al actualizar producto', error.message);
      throw new Error('Error al actualizar producto');
    }
  }
  //Eliminar producto por id
  async deleteProduct(id) {
    try {
      const deletedProduct = await Product.findByIdAndDelete(id);
      return deletedProduct;
    } catch (error) {
      console.log('Error al eliminar producto', error.message);
      throw new Error('Error al eliminar producto');
    }
  }
}

export {MongoProductManager} ;
