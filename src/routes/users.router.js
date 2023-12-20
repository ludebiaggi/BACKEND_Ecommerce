import { Router } from 'express';
import userModel from '../DATA/mongoDB/models/user.model.js'


const router = Router();

// RUTA GET LISTADO USUARIOS
router.get('/', async (req, res) => {
    try {
      const users = await userModel.find({}, 'first_name last_name email role');
      res.status(200).json({ users });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});
  
// RUTA ELIMNIAR USUARIOS INACTIVOS
router.delete('/deleteInactive', async (req, res) => {
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

export default router;