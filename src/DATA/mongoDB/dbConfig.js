import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config()


const URI = 'mongodb+srv://ldebiaggi:Argentina09@cluster0.vlb2rbw.mongodb.net/EcommerceLD?retryWrites=true&w=majority'
mongoose.connect(URI)
  .then(() => console.log('Conectado a la base de datos'))
  .catch((error) => {
    console.error('Error al conectar a la base de datos:', error);
  });
