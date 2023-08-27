//Creamos un nuevo manager de PRODUCTOS para manejar productos con MONGO/MONGOOSE

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
  //async getProducts() {
  //  try {
  //    const products = await Product.find();
  //    return products;
  //  } catch (error) {
  //    console.log('Error al obtener productos', error.message);
  //    throw new Error('Error al obtener productos');
  //  }
  //}

  async getProductsCount(queryOptions = {}) {
    return await Product.countDocuments(queryOptions);
  }
  
  //Se modifca el getProducts para que liste todos los productos únicamente si NO se define un parámetro de filtrado
  async getProducts(queryOptions = {}, sortOptions = {}, limit = 0, skip = 0) {
    let query = Product.find(queryOptions).sort(sortOptions);
  
    if (limit > 0) {
      query = query.limit(limit);
    }
  
    if (skip > 0) {
      query = query.skip(skip);
    }
  
    return await query.exec();
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
