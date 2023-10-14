import { MongoProductManager } from '../DATA/DAOs/productsMongo.dao.js';

class ProductService {
  constructor() {
    this.productManager = new MongoProductManager();
  }

  async addProduct(product) {
    try {
      const newProduct = await this.productManager.addProduct(product);
      return newProduct;
    } catch (error) {
      throw new Error('Error al intentar agregar el producto');
    }
  }

  async getProducts(queryOptions = {}, sortOptions = {}, limit = 10, page = 1) {
    try {
      const products = await this.productManager.getProducts(queryOptions, sortOptions, limit, page);
      return products;
    } catch (error) {
      throw new Error('Error al obtener los productos');
    }
  }

  async getProductById(id) {
    try {
      const product = await this.productManager.getProductById(id);
      return product;
    } catch (error) {
      throw new Error('Error al obtener el producto por ID');
    }
  }

  async updateProduct(id, updatedFields) {
    try {
      const updatedProduct = await this.productManager.updateProduct(id, updatedFields);
      return updatedProduct;
    } catch (error) {
      throw new Error('Error al actualizar el producto');
    }
  }

  async deleteProduct(id) {
    try {
      const deletedProduct = await this.productManager.deleteProduct(id);
      return deletedProduct;
    } catch (error) {
      throw new Error('Error al eliminar el producto');
    }
  }
  
  //Obtenemos multiples productos
  async getProductsByIds(productIds) {
    try {
      const products = await Product.find({ _id: { $in: productIds } });
      return products;
    } catch (error) {
      throw new Error('Error al obtener productos por IDs');
    }
  }
  
}

export const productService = new ProductService();
