import express from 'express';
import { ProductManager } from '../src/productManager.js';
import productsRouter from '../src/routes/products.router.js'; // Importamos el router de productos
import cartsRouter from '../src/routes/carts.router.js'; //Importamos el router de carritos
import { __dirname } from './utils.js' //Importamos Utils

import handlebars from 'express-handlebars' //Importamos handlebars
import viewsRouter from './routes/views.router.js' //Importamos viewsRouter
import { Server } from 'socket.io' //Importamos socket

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

// HANDLEBARS
app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')

//routes viewRouter
app.use('/api/views', viewsRouter)

const productManagerInstance = new ProductManager('./products.json');

//Mensaje de bienvenida al acceder a la raíz de la app
app.get('/', (req, res) => {
  res.send('¡Bienvenidos a mi aplicación!');
});

//Invocación al productsRouter
app.use('/api/products', productsRouter);

//Invocación al cartsRouter
app.use('/api/carts', cartsRouter);


//Declaración de puerto variable + llamado al puerto + socket
const PORT = 8080

const httpServer = app.listen(PORT, () => {
  console.log(`Escuchando al puerto ${PORT}`)
})

const socketServer = new Server(httpServer);

socketServer.on('connection', (socket) => {
  console.log('Cliente conectado', socket.id);
  socket.on('disconnect', () => {
    console.log(`Cliente desconectado`);
  });

  socket.on('addProduct', (newProduct) => {
    const addedProduct = productManagerInstance.addProduct(newProduct);
    socketServer.emit('addProduct', addedProduct); // Emitir el evento a todos los clientes conectados
  });

  socket.on('deleteProduct', (productId) => {
    productManagerInstance.deleteProduct(productId);
    socketServer.emit('deleteProduct', productId); // Emitir el evento a todos los clientes conectados
  });
});
