import { MongoProductManager } from '../DATA/DAOs/productsMongo.dao.js';
import CustomError from '../errors/customErrors.js';
import { ErrorMessages } from '../errors/errorNum.js';

class ProductService {
  constructor() {
    this.productManager = new MongoProductManager();
  }

  async addProduct(product) {
    try {
      const newProduct = await this.productManager.addProduct(product);
      return newProduct;
    } catch (error) {
      const customError = CustomError.createError(ErrorMessages.ADD_PRODUCT_ERROR);
      return res.status(customError.status).json(customError);
    }
  }

  async getProducts(queryOptions = {}, sortOptions = {}, limit = 10, page = 1) {
    try {
      const products = await this.productManager.getProducts(queryOptions, sortOptions, limit, page);
      return products;
    } catch (error) {
      const customError = CustomError.createError(ErrorMessages.GET_PRODUCTS_ERROR)
      return res.status(customError.status).json(customError);
    }
  }

  async getProductById(id) {
    try {
      const product = await this.productManager.getProductById(id);
      return product;
    } catch (error) {
      const customError = CustomError.createError(ErrorMessages.PRODUCT_NOT_FOUND)
      return res.status(customError.status).json(customError);
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

}


export const productService = new ProductService();
