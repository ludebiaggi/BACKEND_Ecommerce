import { Product } from '../mongoDB/models/products.model.js';

class MongoProductManager {
  async addProduct(product) {
    const newProduct = new Product(product);
    await newProduct.save();
    return newProduct;
  }

  async getProductsCount(queryOptions = {}) {
    return await Product.countDocuments(queryOptions);
  }

  async getProducts(queryOptions = {}, sortOptions = {}, limit = 10, page = 1) {
    const options = {
      sort: sortOptions,
      page: page,
      limit: limit,
      lean: true,
    };

    const result = await Product.paginate(queryOptions, options);
    return result;
  }

  async getProductById(id) {
    return await Product.findById(id);
  }

  async updateProduct(id, updatedFields) {
    const updatedProduct = await Product.findByIdAndUpdate(id, updatedFields, { new: true });
    return updatedProduct;
  }

  async deleteProduct(id) {
    const deletedProduct = await Product.findByIdAndDelete(id);
    return deletedProduct;
  }
}

export { MongoProductManager };
