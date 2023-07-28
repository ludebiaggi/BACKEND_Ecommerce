import express from 'express';
import { ProductManager } from '../src/productManager.js';
import productsRouter from '../src/routes/products.router.js'; // Importamos el router de productos
import cartsRouter from '../src/routes/carts.router.js'; //Importamos el router de carritos

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const productManagerInstance = new ProductManager('./products.json');

//Mensaje de bienvenida al acceder a la raíz de la app
app.get('/', (req, res) => {
  res.send('¡Bienvenidos a mi aplicación!');
});

//Invocación al productsRouter
app.use('/api/products', productsRouter);

//Invocación al cartsRouter
app.use('/api/carts', cartsRouter);


//Declaración de puerto variable + llamado al puerto
const port = 8080;

app.listen(port, () => {
  console.log(`Servidor Express escuchando en el puerto ${port}`);
});
