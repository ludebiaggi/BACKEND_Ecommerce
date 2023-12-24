import express from 'express';
import { MongoProductManager } from './DATA/DAOs/productsMongo.dao.js';
import productsRouter from '../src/routes/products.router.js'; // Importamos el router de productos
//import cartsRouter from '../src/routes/newCart.router.js'; //Importamos el router de carritos
import cartsRouter from '../src/routes/carts.router.js';
import crypto from 'crypto';
import { __dirname } from './bcrypt-helper.js'//Importamos Utils
import handlebars from 'express-handlebars'//Importamos handlebars
import viewsRouter from './routes/views.router.js' //Importamos viewsRouter
import { Server } from 'socket.io' //Importamos socket
import './DATA/mongoDB/dbConfig.js';
import { Message } from './DATA/mongoDB/models/messages.models.js';
import sessionRouter from '../src/routes/sessions.router.js'; //Importamos router de sesiones
import cookieParser from 'cookie-parser'; //Importamos cookie parse
import passport from 'passport'; //Importamos Passport
import './services/passport/passportStrategies.js'
import { isUser } from './middlewares/auth.middlewares.js'
import session from 'express-session';
import FileStore  from 'session-file-store';
import MongoStore from 'connect-mongo';
import config from './config.js';
import mailsRouter from '../src/routes/mails.router.js'
import { generateFakeProducts } from './mocks/productsMock.js';
import logger from '../src/winston.js';
import { transporter } from './nodemailer.js';
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUiExpress from "swagger-ui-express";
import userModel from './DATA/mongoDB/models/user.model.js';
import userRouter from '../src/routes/users.router.js'
//import path from 'path';
import mongoose from 'mongoose';


//CONFIGURACIONES SESSION - CONECTAR SESSION CON NUESTRO FILESTORE
const fileStorage = FileStore(session);
//CONFIG DE EXPRESS
const app = express();

//CONFIG RAILWAY
mongoose.connect('mongodb+srv://ldebiaggi:Argentina09@cluster0.vlb2rbw.mongodb.net/EcommerceLD?retryWrites=true&w=majority');

//CONNFIG COOKIE PARSER + SESSIONS
app.use(cookieParser());
app.use(session({
  store:MongoStore.create({
    mongoUrl: 'mongodb+srv://ldebiaggi:Argentina09@cluster0.vlb2rbw.mongodb.net/EcommerceLD?retryWrites=true&w=majority',
    mongoOptions: {useNewUrlParser: true, useUnifiedTopology: true},
    ttl:50000,
  }),
  secret : 'qwerty123456',
  resave: false,
  saveUninitialized: false
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

//CONFIGS PASSPORT
app.use(passport.initialize());
app.use(passport.session());

// CONFIGURACIONES DE HANDLEBARS
app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')

//Routes viewRouter
app.use('/api/views', viewsRouter)
app.use('/api/views/delete/:id', viewsRouter)

//IMPORTANTE! Comentar la siguiente línea si se quiere trabajar con persistencia a través de FS.
const productManagerInstance = new MongoProductManager();



//Ruta LoggerTest 
app.get('/loggerTest', (req, res) => {
  logger.debug('Probando mensaje nivel debug');
  logger.http('Probando mensaje nivel http');
  logger.info('Probando mensaje nivel info');
  logger.warning('Probando mensaje nivel warning');
  logger.error('Probando mensaje nivel error');
  logger.fatal('Probando mensaje nivel fatal');
  res.send('Logs generados desde el endpoint /loggerTest');
});

app.get('/generarError', (req, res) => {
  throw new Error('Éste es un error de prueba intencional');
});

//Mensaje de bienvenida al acceder a la raíz de la app
app.get('/', (req, res) => {
  res.send('¡Bienvenidos a mi aplicación!');
});

//Invocación al productsRouter
app.use('/api/products', productsRouter);
app.use ('/api/views/products', productsRouter);

//Ruta Mock de productos
app.get('/api/mockingproducts', (req, res) => {
  const fakeProducts = [];
  for (let i = 0; i < 100; i++) {
      const productMock = generateFakeProducts(); 
      fakeProducts.push(productMock);
  }
  res.json(fakeProducts);
});


//Invocación al cartsRouter
app.use('/api/carts', cartsRouter);

//Ruta chat (Se aplica validación isUser para que sólo un rol USUARIO pueda acceder a la ruta)
app.get('/chat', isUser, (req, res) => {
  res.render('chat', { messages: [] }); 
});

//Ruta al api/sessions
app.use("/api/session", sessionRouter);
app.use("/api/session/current", sessionRouter);
app.use("/api/session/users/premium", sessionRouter);

app.use("/api/users", userRouter);
app.use("/api/users/delete" , userRouter);
app.use("/api/users/deleteInactive" , userRouter);


//Vista ADMIN de usuarios
app.get('/api/views/admin/users', async (req, res) => {
  try {
    const users = await userModel.find({}, 'first_name last_name email role');
    res.render('adminViews', { users }); 
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//MAIL
app.use('/api/mail', mailsRouter);


//RESTABLECER PASS (Desafio complementario clase 37)
app.get('/api/views/forgot-pwd', (req, res) => {
  res.render('forgotPwd');
});

app.get('/api/views/forgot-pwd-sent', (req, res) => {
  res.render('forgotPwdSent');
});

app.get('/api/views/reset-pwd-ok', (req, res) => {
  res.render('resetPwdOk');
});

app.get('/api/views/reset-pwd-expired', (req, res) => {
  res.render('resetPwdExpired');
});

app.post('/api/forgot-pwd', async (req, res) => {
  const { email } = req.body;
  const token = crypto.randomBytes(20).toString('hex');
  const expirationTime = Date.now() + 3600000; 
  global.passwordResetToken = { email, token, expirationTime };
  const resetURL = `http://localhost:8080/api/views/reset-pwd/${token}`;
  await transporter.sendMail({
    from: config.gmail_user,
    to: email,
    subject: 'Solicitud de recupero de Contraseña',
    html: `Clickea <a href="${resetURL}">aquí</a> para recuperar tu contraseña.`,
  });
  res.redirect('/api/views/forgot-pwd-sent');
});



// Rutas para login, register y profile
app.get('/login', (req, res) => {
  res.render('login'); 
});

app.get('/register', (req, res) => {
  res.render('register'); 
});

app.get('/profile', (req, res) => {
  res.render('profile', {
    user: req.session.user,
  }); 
});



//CONFIG SWAGGER
const swaggerOptions = {
  definition: {
    openapi: "3.0.1",
    info: {
      title: "Documentación de LD ECOMMERCE",
      description: "Infomación de métodos/funcionalidades aplicados en LD ECOMMERCE",
    },
  },
  apis: [`${__dirname}/docs/**/*.yaml`],  
};
const specs = swaggerJSDoc(swaggerOptions);

app.use("/api/docs", swaggerUiExpress.serve, swaggerUiExpress.setup(specs));

//Declaración de puerto variable + llamado al puerto (tomamos la info variable desde el .env)
//const PORT = config.port
const PORT = config.port||8080
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