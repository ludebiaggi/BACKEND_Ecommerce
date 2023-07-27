//Router para manejar todos los endpoint asociados a los productos.
import { Router } from "express";
import { ProductManager } from "../productManager.js";

const router = Router();
const productManagerInstance = new ProductManager('./products.json');

// Endpoint GET /api/products (Traerá listados todos los productos---PRUEBA OK X TC)
router.get('/', async (req, res) => {
  try {
    const products = await productManagerInstance.getProducts();
    const limit = req.query.limit ? parseInt(req.query.limit) : null;
    const response = limit ? products.slice(0, limit) : products;
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener listado de productos' });
  }
});

// Endpoint GET /api/products/:pid (Traerá listado el producto por ID único --- PRUEBA OK X TC)
router.get('/:pid', async (req, res) => {
  try {
    const productId = parseInt(req.params.pid);
    const product = await productManagerInstance.getProductById(productId);

    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el producto solicitado' });
  }
});

// Endpoint POST /api/products (Permite adiconar un nuevo producto --- REVISAR ME DA QUE FALTAN CAMPOS OBLIGATORIOS CUANDO SE COMPLETAN TODOS)
router.post('/', (req, res) => {
    const product = {
      title: req.query.title,
      description: req.query.description,
      code: req.query.code,
      price: req.query.price,
      status: true, // Siguiendo el requerimiento se aplica el status TRUE por defecto
      stock: req.query.stock,
      category: req.query.category,
      thumbnails: req.query.thumbnails ? req.query.thumbnails.split(',') : [], 
    };
  
    const newProduct = productManagerInstance.addProduct(product);
    if (newProduct) {
      res.status(201).json(newProduct);
    } else {
      res.status(400).json({ error: 'No se pudo agregar el producto' });
    }
  });

// Endpoint PUT /api/products/:pid   (Actualizará un producto) (REVISAR PORQUE ME VOLÓ EL CAMPO)
router.put('/:pid', async (req, res) => {
  const productId = parseInt(req.params.pid);
  await productManagerInstance.updateProduct(productId);
  res.json({ message: 'Producto actualizado exitosamente' });
});

// Endpoint DELETE /api/products/:pid (Eliminará un producto --- PRUEBA OK X TC)
router.delete('/:pid', async (req, res) => {
  const productId = parseInt(req.params.pid);
  await productManagerInstance.deleteProduct(productId);
  res.json({ message: 'Producto eliminado exitosamente' });
});


export default router;
