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
}

export const userController = new UserController();
