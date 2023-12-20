import { Router } from 'express';
import userModel from '../DATA/mongoDB/models/user.model.js'
import cartModel from '../DATA/mongoDB/models/carts.model.js'
import passport from 'passport';
import bcrypt from 'bcrypt';
import config from '../config.js';
import UsersDto from '../DATA/DTOs/users.dto.js';

const router = Router();

router.post('/register', async (req, res) =>{
    const {first_name, last_name, email, age, password} = req.body;

    const exist = await userModel.findOne({email});

    if(exist){
        return res.status(400).send({status:"error", error:"El usuario ya existe"});
    }

    const user = {
        first_name, last_name, email, age, password
    };

    const result = await userModel.create(user);
    res.send({status:"succes", message:"Usuario registrado correctamente"});
})

router.post('/login',  async (req,res)=>{
    const { email, password } = req.body; 
     const user = await userModel.findOne({email}) 

    if(!user){
        return res.status(400).send({status:"error", error:"Datos incorrectos"})
    }

   // Verifica la contraseña ingresada por el usuario contra la contraseña hasheada en la base de datos
   const isPasswordValid = await bcrypt.compare(password, user.password);
   // Si la contraseña no coincide, verifica si es la contraseña sin hashear (para poder ingresar con usuarios del desafío anterior, en donde aún no trabajábamos con hasheo)
   if (!isPasswordValid && password === user.password) {   
   } else if (!isPasswordValid) {
       return res.status(400).send({ status: "error", error: "Datos incorrectos" });
   }

    // Verifica si el usuario tiene un carrito asociado
    if (!user.cart) {
        // Si el usuario no tiene un carrito asociado, crea uno nuevo
        const newCart = await cartModel.create({ products: [], productsNotPurchased: [] });
  
        // Actualiza el campo 'cart' del usuario con el ID del nuevo carrito
        user.cart = newCart._id;
        await user.save();
    }

    //Validación usuario ADMIN usando la info del .ENV para ingresar con el SUPERADMIN
    if (email === config.adminEmail && password === config.adminPassword) {
        user.role = 'ADMIN';
      }  
      req.session.user = {
        name: `${user.first_name} ${user.last_name}`,
        email: user.email,
        age: user.age,
        role: user.role, // Se agrega el rol del usuario en la sesión
        cartId: user.cartId,
      }
    res.redirect('/api/views/products');
})

router.get('/logout', (req,res)=>{
    req.session.destroy(err =>{
        if(err) return res.status(500).send({status:"error", error:"No pudo cerrar sesión"})
        res.redirect('/login');
    })
})

//LLAMADO A GITHUB PARA LA REDIRECCIÓN Y PARA EL CALLBACK
router.get('/github', passport.authenticate('github', {scope:['user:email']}), async (req, res)=>{})
router.get('/githubcallback', passport.authenticate('github',{failureRedirect: '/login'}), async (req, res)=>
{
    req.session.user = req.user
    res.redirect('/profile')
})


//Ruta current con la aplicación del DTO que evita mandar datos sensibles
router.get('/current', (req, res) => {
    const userDto = new UsersDto(req.session.user); 
    res.status(200).json({ user: userDto });
});

//Nueva ruta para asignar rol a usuarios API/SESSION/USERS/PREMIUM/userID(UID)
router.put('/users/premium/:uid', async (req, res) => {
    try {
      const uid = req.params.uid;
      const user = await userModel.findOne({ _id: uid });
  
      if (!user) {
        return res.status(404).json({ status: "error", error: "Usuario no encontrado" });
      } 
      // Cambiamos el rol de "usuario" a "premium" o viceversa dependiendo que rol tenga de base
      user.role = user.role === "usuario" ? "premium" : "usuario";
      await user.save();
      return res.status(200).json({ status: "success", message: `Rol del usuario ${user.email} actualizado a ${user.role}` });
    } catch (error) {
      return res.status(500).json({ status: "error", error: "Error al actualizar el rol del usuario" });
    }
});

// RUTA GET LISTADO USUARIOS
router.get('/users', async (req, res) => {
    try {
      const users = await userModel.find({}, 'first_name last_name email role');
      res.status(200).json({ users });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});
  
// RUTA ELIMNIAR USUARIOS INACTIVOS
router.delete('/users/deleteInactive', async (req, res) => {
    try {
      const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000); // Fecha hace dos días
      const deletedUsers = await userModel.deleteMany({ lastConnection: { $lt: twoDaysAgo } });
  
      deletedUsers.forEach(async (user) => {
        const messageOpt = {
          from: 'luu.debiaggi@gmail.com',
          to: user.email,
          subject: 'Eliminación de cuenta por inactividad',
          text: 'Tu cuenta ha sido eliminada por inactividad en nuestra plataforma.',
        };
        await transporter.sendMail(messageOpt);
      });
  
      res.status(200).json({ message: 'Usuarios eliminados por inactividad', deletedCount: deletedUsers.deletedCount });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});
  
//RUTA PARA ELIMNIAR USER X SU ID
router.delete('/users/delete/:uid', async (req, res) => {
    const userId = req.params.id;
    try {
      const deletedUser = await userModel.findByIdAndDelete(userId);
      if (!deletedUser) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }
      res.status(200).json({ message: 'Usuario eliminado correctamente', deletedUser });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});

export default router;