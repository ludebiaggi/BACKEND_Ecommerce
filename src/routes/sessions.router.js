import { Router } from 'express';
import userModel from '../db/models/user.model.js'

const router = Router();

router.post('/api/session/register', async (req, res) =>{

    const {first_name, last_name, email, age, password} = req.body;

    const exist = await userModel.findOne({email});
    if(exist){
        return res.status(400).send({status:"error", error:"El usuario ya existe"});
    }
    const user = {
        first_name, last_name, email, age, password
    };

    const result = await userModel.create(user);
    res.send({status:"succes", message:"Usuario registrado exitosamente"});

})

router.post('/api/sessions/login', async (req,res)=>{
    const { email, password } = req.body;
    const user = await userModel.findOne({email,password})

    if(!user){
        return res.status(400).send({status:"error", error:"Datos incorrectos"})
    }
  
    req.session.user = {
        name: `${user.first_name} ${user.last_name}`,
        email: user.email,
        age: user.age
    }
    res.send({status:"success", payload:req.res.user, message:"Bienvenido a tu primer logueo!"})
    
})

router.get('api/sessions/logout', (req,res)=>{
    req.session.destroy(err =>{
        if(err) return res.status(500).send({status:"error", error:"No se pudo cerrar la sesión"})
        res.redirect('/login');
    })
})

export default router;