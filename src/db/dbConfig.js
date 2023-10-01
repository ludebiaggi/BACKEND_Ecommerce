import dotenv from 'dotenv'; // Importo dotenv para que me tome la variable del .env
dotenv.config(); // Cargar las variable del entorno desde el .env
import mongoose from 'mongoose';


const URI = process.env.MONGO_URL;
mongoose.connect(URI)
  .then(() => console.log('Conectado a la base de datos'))
  .catch((error) => {
    console.error('Error al conectar a la base de datos:', error);
  });
