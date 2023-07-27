import express from 'express';
import { ProductManager } from '../src/productManager.js';
import productsRouter from '../src/routes/products.router.js'; // Import the products router

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const productManagerInstance = new ProductManager('./products.json');

//Mensaje de bienvenida al acceder a la raíz de la app
app.get('/', (req, res) => {
  res.send('¡Bienvenidos a mi aplicación!');
});

// Use the products router at /api/products
app.use('/api/products', productsRouter);

app.listen(8080, () => {
  console.log(`Servidor Express escuchando en el puerto 8080`);
});
