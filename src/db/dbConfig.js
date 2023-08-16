import mongoose from 'mongoose'

//CONFIG MONGOOSE
const URI = 'mongodb+srv://ldebiaggi:Argentina09@cluster0.vlb2rbw.mongodb.net/EcommerceLD?retryWrites=true&w=majority'
mongoose.connect(URI)
.then(()=> console.log('conectado a la base de datos'))
.catch(error=>console.log(error))