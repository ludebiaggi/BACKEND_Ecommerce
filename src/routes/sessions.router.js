import { Router } from 'express';
import userModel from '../db/models/user.model.js'
import passport from 'passport';
// import { hashData } from '../utils.js';
import bcrypt from 'bcrypt';



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

router.post('/login', async (req,res)=>{
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

    //Validación usuario ADMIN indicado en las diapos Entregable
    if (email === 'adminCoder@coder.com' && password === 'adminCod3r123') {
        user.role = 'ADMIN';
      }
    
      req.session.user = {
        name: `${user.first_name} ${user.last_name}`,
        email: user.email,
        age: user.age,
        role: user.role, // Se agrega el rol del usuario en la sesión
      }
    
    //res.send({status:"success", payload:req.res.user, message:"Bienvenido"})
    res.redirect('/api/views/products');
})

router.get('/logout', (req,res)=>{
    req.session.destroy(err =>{
        if(err) return res.status(500).send({status:"error", error:"No pudo cerrar sesion"})
        res.redirect('/login');
    })
})

//LLAMADO A GITHUB PARA LA REDIRECCIÓN Y PARA EL CALLBACK

router.get('/github', passport.authenticate('github', {scope:['user:email']}), async (req, res)=>{})

router.get('/githubcallback', passport.authenticate('github',{failureRedicrect: '/login'}), async (req, res)=>
{
    req.session.user = req.user
    res.redirect('/profile')
})

export default router;