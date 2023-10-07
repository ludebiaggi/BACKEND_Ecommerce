import { MongoProductManager } from '../DAL/DAOs/productsMongo.dao.js';

const productManager = new MongoProductManager();

class ProductController {
  async addProduct(req, res) {
    try {
      const newProduct = await productManager.addProduct(req.body);
      res.status(201).json({ product: newProduct });
    } catch (error) {
      res.status(500).json({ error: 'Error al intentar agregar el producto' });
    }
  }

  async getProductsCount(req, res) {
    try {
      const count = await productManager.getProductsCount();
      res.status(200).json({ count });
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener la cantidad de productos' });
    }
  }

  async getProducts(req, res) {
    const { page, limit } = req.query;
    const pageNumber = parseInt(page) || 1;
    const limitNumber = parseInt(limit) || 10;

    try {
      const products = await productManager.getProducts({}, {}, limitNumber, pageNumber);
      res.status(200).json({ products });
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener los productos' });
    }
  }

  async getProductById(req, res) {
    const { id } = req.params;

    try {
      const product = await productManager.getProductById(id);
      if (product) {
        res.status(200).json({ product });
      } else {
        res.status(404).json({ message: 'Producto no encontrado' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener el producto por ID' });
    }
  }

  async updateProduct(req, res) {
    const { id } = req.params;
    const updatedFields = req.body;

    try {
      const updatedProduct = await productManager.updateProduct(id, updatedFields);
      if (updatedProduct) {
        res.status(200).json({ product: updatedProduct });
      } else {
        res.status(404).json({ message: 'Producto no encontrado' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error al actualizar el producto' });
    }
  }

  async deleteProduct(req, res) {
    const { id } = req.params;

    try {
      const deletedProduct = await productManager.deleteProduct(id);
      if (deletedProduct) {
        res.status(200).json({ product: deletedProduct });
      } else {
        res.status(404).json({ message: 'Producto no encontrado' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar el producto' });
    }
  }
}

export const productController = new ProductController();
