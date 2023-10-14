import mongoose from 'mongoose';
import config from '../../config.js';

const URI = config.mongoUrl
mongoose.connect(URI)
  .then(() => console.log('Conectado a la base de datos'))
  .catch((error) => {
    console.error('Error al conectar a la base de datos:', error);
  });
