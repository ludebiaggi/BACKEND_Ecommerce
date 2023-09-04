import mongoose from 'mongoose';

const collection = 'User';

const schema = new mongoose.Schema({
    first_name: String,
    last_name:String,
    email:String,
    age:Number,
    password:String,
    role: {
        type: String,
        default: 'usuario', //Valor por default para usuarios comunes
      },
});

const userModel = mongoose.model(collection, schema);

export default userModel;