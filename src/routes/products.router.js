//Router para manejar todos los endpoint asociados a los productos.
import { Router } from "express";
import { MongoProductManager } from '../managers/MongoProductManager.js';

const router = Router();

const productManagerInstance = new MongoProductManager();

// Endpoint GET /api/products (Traerá listados todos los productos)
//router.get('/', async (req, res) => {
//  try {
//    const products = await productManagerInstance.getProducts();
//    const limit = req.query.limit ? req.query.limit: null;
//    const response = limit ? products.slice(0, limit) : products;
//    res.json(response);
//  } catch (error) {
//    res.status(500).json({ error: 'Error al obtener listado de productos' });
//  }
//});

//GET modificado para cumplir con los métodos de búsqueda según requerimiento api/products
router.get('/', async (req, res) => {
  try {
    const { limit = 10, page = 1, query, sort } = req.query;

    let queryOptions = {};
    if (query) {
      queryOptions = {
        $or: [
          { title: { $regex: query, $options: 'i' } }, // Búsqueda por título (NO casesensitive)
          { category: { $regex: query, $options: 'i' } }, // Búsqueda por categoría (NO case sensitive)
        ],
      };
    }

    const sortOptions = {};
    if (sort === 'asc') {
      sortOptions.price = 1; // Orden ascendente por precio
    } else if (sort === 'desc') {
      sortOptions.price = -1; // Orden descendente por precio
    }

    const totalProducts = await productManagerInstance.getProductsCount(queryOptions);
    const totalPages = Math.ceil(totalProducts / limit);

    const skip = (page - 1) * limit;
    const products = await productManagerInstance.getProducts(queryOptions, sortOptions, limit, skip);

    const response = {
      status: 'success',
      payload: products,
      totalPages,
      prevPage: page > 1 ? +page - 1 : null,
      nextPage: page < totalPages ? +page + 1 : null,
      page: +page,
      hasPrevPage: page > 1,
      hasNextPage: page < totalPages,
      prevLink: page > 1 ? `/api/products?limit=${limit}&page=${page - 1}&query=${query}&sort=${sort}` : null,
      nextLink: page < totalPages ? `/api/products?limit=${limit}&page=${page + 1}&query=${query}&sort=${sort}` : null,
    };

    res.json(response);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener listado de productos' });
  }
});


// Endpoint GET /api/products/:pid (Traerá listado el producto por ID único)
router.get('/:pid', async (req, res) => {
  try {
    const productId = req.params.pid; //Quitamos el parseint para que funcione Mongoose
    const product = await productManagerInstance.getProductById(productId);

    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el producto solicitado' });
  }
});

// Endpoint POST /api/products (Permite adicionar un nuevo producto)
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


// Endpoint PUT /api/products/:pid   (Actualizará un producto)
router.put('/:pid', async (req, res) => {
  const productId = req.params.pid; //Quitamos el parseInt para operar con los ID de Mongoose
  const updatedFields = req.body; 
  await productManagerInstance.updateProduct(productId, updatedFields);
  res.json({ message: 'Producto actualizado exitosamente' });
});


// Endpoint DELETE /api/products/:pid (Eliminará un producto Entregable 3)
router.delete('/:pid', async (req, res) => {
  const productId = req.params.pid; //Quitamos el parseInt para operar con el ID de Mongoose
  await productManagerInstance.deleteProduct(productId);
  res.json({ message: 'Producto eliminado exitosamente' });
});


export default router;
