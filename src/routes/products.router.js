//Router para manejar todos los endpoint asociados a los productos.
import { Router } from "express";
import { MongoProductManager } from '../DATA/DAOs/productsMongo.dao.js';
import { isAdmin} from '../middlewares/auth.middlewares.js'

const router = Router();

const productManagerInstance = new MongoProductManager();

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

    const productsPaginated = await productManagerInstance.getProducts(queryOptions, sortOptions, limit, page);

    const response = {
      status: 'success',
      payload: productsPaginated.docs, 
      totalPages: productsPaginated.totalPages,
      prevPage: productsPaginated.hasPrevPage ? productsPaginated.prevPage : null,
      nextPage: productsPaginated.hasNextPage ? productsPaginated.nextPage : null,
      page: productsPaginated.page,
      hasPrevPage: productsPaginated.hasPrevPage,
      hasNextPage: productsPaginated.hasNextPage,
      prevLink: productsPaginated.hasPrevPage ? `/api/products?limit=${limit}&page=${productsPaginated.prevPage}&query=${query}&sort=${sort}` : null,
      nextLink: productsPaginated.hasNextPage ? `/api/products?limit=${limit}&page=${productsPaginated.nextPage}&query=${query}&sort=${sort}` : null,
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
// Se aplica validación isAdmin
router.post('/', isAdmin, (req, res) => {
  const { title, description, code, price, stock, category, thumbnails } = req.body;
  const product = {
    title,
    description,
    code,
    price,
    status: true, 
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
// Se aplica validación isAdmin
router.put('/:pid', isAdmin, async (req, res) => {
  const productId = req.params.pid; 
  const updatedFields = req.body; 
  await productManagerInstance.updateProduct(productId, updatedFields);
  res.json({ message: 'Producto actualizado exitosamente' });
});


// Endpoint DELETE /api/products/:pid (Eliminará un producto )
// Se aplica validación isAdmin
router.delete('/:pid', isAdmin, async (req, res) => {
  const productId = req.params.pid; 
  await productManagerInstance.deleteProduct(productId);
  res.json({ message: 'Producto eliminado exitosamente' });
});




export default router;
