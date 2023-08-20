import express from 'express';
import { ProductManager } from '../src/managers/productManager.js';
import productsRouter from '../src/routes/products.router.js'; // Importamos el router de productos
import cartsRouter from '../src/routes/carts.router.js'; //Importamos el router de carritos
import { __dirname } from './utils.js'//Importamos Utils
import handlebars from 'express-handlebars'//Importamos handlebars
import viewsRouter from './routes/views.router.js' //Importamos viewsRouter
import { Server } from 'socket.io' //Importamos socket
import '../src/db/dbConfig.js';
import { Message } from '../src/db/models/messages.models.js';





//Configs EXPRESS
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));




// Config de HANDLEBARS
app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')


//Routes viewRouter
app.use('/api/views', viewsRouter)
app.use('api/views/delete/:id', viewsRouter)


const productManagerInstance = new ProductManager('./products.json');

//Mensaje de bienvenida al acceder a la raíz de la app
app.get('/', (req, res) => {
  res.send('¡Bienvenidos a mi aplicación!');
});

//Invocación al productsRouter
app.use('/api/products', productsRouter);

//Invocación al cartsRouter
app.use('/api/carts', cartsRouter);

//Ruta chat
app.get('/chat', (req, res) => {
  res.render('chat', { messages: [] }); 
});


//Declaración de puerto variable + llamado al puerto 
const PORT = 8080

const httpServer = app.listen(PORT, () => {
  console.log(`Escuchando al puerto ${PORT}`)
})

//Socket y eventos
const socketServer = new Server(httpServer);

socketServer.on('connection', (socket) => {
  console.log('Cliente conectado', socket.id);
  socket.on('disconnect', () => {
    console.log(`Cliente desconectado`);
  });

  socket.on('addProduct', (newProduct) => {
    const addedProduct = productManagerInstance.addProduct(newProduct);
    socketServer.emit('addProduct', addedProduct); 
  });

  socket.on('deleteProduct', (productId) => {
    productManagerInstance.deleteProduct(Number(productId));
    socketServer.emit('productDeleted', productId); 
    socketServer.emit('updateProductList'); 
  });

  socket.on('chatMessage', async (messageData) => {
    const { user, message } = messageData;
    const newMessage = new Message({ user, message });
    await newMessage.save();

    // Emitir el mensaje a todos los clientes conectados
    socketServer.emit('chatMessage', { user, message });

    console.log(`Mensaje guardado en la base de datos: ${user}: ${message}`);
  });

});

