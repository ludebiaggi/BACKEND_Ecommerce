import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const collection = 'User';

const schema = new mongoose.Schema({
  first_name: String,
  last_name: String,
  email: {
    type: String,
    unique: true, 
  },
  age: Number,
  password: String,
  username: String,
  cart: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cart',
  },
  role: {
    type: String,
    default: 'usuario', 
  },
  fromGithub: {
    type: Boolean,
    default: false, 
  },
  lastConnection: {
    type: Date,
    default: Date.now,
  }
});

// Método para hashear la contraseña antes de guardarla en la base de datos
schema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});

const userModel = mongoose.model(collection, schema);

export default userModel;
