import { productService } from '../services/products.service.js';

class ProductController {
  async addProduct(req, res) {
    try {
      const newProduct = await productService.addProduct(req.body);
      res.status(201).json({ product: newProduct });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getProducts(req, res) {
    const { page, limit } = req.query;
    const pageNumber = parseInt(page) || 1;
    const limitNumber = parseInt(limit) || 10;

    try {
      const products = await productService.getProducts({}, {}, limitNumber, pageNumber);
      res.status(200).json({ products });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getProductById(req, res) {
    const { id } = req.params;

    try {
      const product = await productService.getProductById(id);
      if (product) {
        res.status(200).json({ product });
      } else {
        res.status(404).json({ message: 'Producto no encontrado' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async updateProduct(req, res) {
    const { id } = req.params;
    const updatedFields = req.body;

    try {
      const updatedProduct = await productService.updateProduct(id, updatedFields);
      if (updatedProduct) {
        res.status(200).json({ product: updatedProduct });
      } else {
        res.status(404).json({ message: 'Producto no encontrado' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async deleteProduct(req, res) {
    const { id } = req.params;

    try {
      const deletedProduct = await productService.deleteProduct(id);
      if (deletedProduct) {
        res.status(200).json({ product: deletedProduct });
      } else {
        res.status(404).json({ message: 'Producto no encontrado' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

export const productController = new ProductController();
