import { usersManager } from "../DAL/DAOs/usersMongo.dao.js";

class UserController {
  async createUser(req, res) {
    try {
      const newUser = await usersManager.create(req.body);
      res.status(201).json({ user: newUser });
    } catch (error) {
      res.status(500).json({ error: "Error al intentar crear usuario" });
    }
  }

  async findUserByUsername(req, res) {
    const { username } = req.params;
    try {
      const user = await usersManager.findUser(username);
      if (user) {
        res.status(200).json({ user });
      } else {
        res.status(404).json({ message: "Usuario no encontrado" });
      }
    } catch (error) {
      res.status(500).json({ error: "Error al intentar buscar usuario" });
    }
  }
}

export const userController = new UserController();
