import { userService } from '../services/user.service.js';

class UserController {
  async createUser(req, res) {
    try {
      const newUser = await userService.createUser(req.body);
      res.status(201).json({ user: newUser });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async findUserByUsername(req, res) {
    const { username } = req.params;
    try {
      const user = await userService.findUserByUsername(username);
      if (user) {
        res.status(200).json({ user });
      } else {
        res.status(404).json({ message: 'Usuario no encontrado' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async findUserById(req, res) {
    const { id } = req.params;
    try {
        const user = await userService.findUserById(id);
        if (user) {
            res.status(200).json({ user });
        } else {
            res.status(404).json({ message: 'Usuario no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
  }

  async findAllUsers(req, res) {
    try {
        const users = await userService.findAllUsers();
        res.status(200).json({ users });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
  }

  async deleteInactiveUsers(req, res) {
    const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000); 
    try {
        const deletedUsers = await userService.deleteInactiveUsers(twoDaysAgo);
        res.status(200).json({ message: 'Usuarios eliminados por inactividad', deletedCount: deletedUsers.deletedCount });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
  }

  async deleteUserById(req, res) {
    const { userId } = req.params;
    try {
        const deletedUser = await userService.deleteUserById(userId);
        if (!deletedUser) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.status(200).json({ message: 'Usuario eliminado correctamente', deletedUser });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
  }

}

export const userController = new UserController();
