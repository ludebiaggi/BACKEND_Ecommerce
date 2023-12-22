import { Router } from 'express';
import userModel from '../DATA/mongoDB/models/user.model.js'
import { transporter } from "../nodemailer.js";


const router = Router();

// RUTA GET LISTADO USUARIOS
router.get('/', async (req, res) => {
    try {
      const users = await userModel.find({}, 'first_name last_name email role lastConnection');
      res.status(200).json({ users });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});
  
// RUTA ELIMINAR USUARIOS INACTIVOS
router.delete('/deleteInactive', async (req, res) => {
  try {
    const twoDaysInactivity = new Date();
    twoDaysInactivity.setDate(twoDaysInactivity.getDate() - 2);
    
    const deletedUsers = await userModel.find({ lastConnection: { $lt: twoDaysInactivity.toISOString() } }, 'email lastConnection');
    console.log('Usuarios eliminados:', deletedUsers);

    const deletedUsersInfo = await userModel.deleteMany({ lastConnection: { $lt: twoDaysInactivity.toISOString() } });
    const deletedCount = deletedUsersInfo.deletedCount;

    for (const user of deletedUsers) {
      const messageOpt = {
        from: "ludebiaggi@gmail.com",
        to: user.email,
        subject: "HEMOS ELIMINADO TU CUENTA POR INACTIVIDAD",
        text: "Eliminamos tu cuenta por ausencia de actividad, deberás crearte un nuevo usuario para continuar accediendo a nuestra plataforma."
      }
      await transporter.sendMail(messageOpt);
    }

    res.status(200).json({ message: 'Usuarios eliminados por inactividad', deletedCount });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
  
//RUTA PARA ELIMINAR USER X SU ID
router.delete('/delete/:uid', async (req, res) => {
    const userId = req.params.uid;
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

// RUTA PARA ACTUALIZAR EL ROL DEL USUARIO POR SU ID
router.put('/:uid/updateRole', async (req, res) => {
    const userId = req.params.uid;
    const { role } = req.body;
  
    try {
      const user = await userModel.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }
  
      user.role = role; 
      await user.save(); 
  
      res.status(200).json({ message: 'Rol de usuario actualizado correctamente', user });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});

export default router;