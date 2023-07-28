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

// Endpoint POST /api/products (Permite adiconar un nuevo producto --- PRUEBA OK X TC)
router.post('/', (req, res) => {
  const { title, description, code, price, stock, category, thumbnails } = req.body;
  const product = {
    title,
    description,
    code,
    price,
    status: true, // Siguiendo el requerimiento se aplica el status TRUE por defecto
    stock: stock,
    category,
    thumbnails: thumbnails ? thumbnails.split(',') : [], 
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
  const updatedTitle = req.body.title; // Obtener el nuevo título del cuerpo de la solicitud
  await productManagerInstance.updateProduct(productId, updatedTitle);
  res.json({ message: 'Producto actualizado exitosamente' });
});


// Endpoint DELETE /api/products/:pid (Eliminará un producto --- PRUEBA OK X TC)
router.delete('/:pid', async (req, res) => {
  const productId = parseInt(req.params.pid);
  await productManagerInstance.deleteProduct(productId);
  res.json({ message: 'Producto eliminado exitosamente' });
});


export default router;
