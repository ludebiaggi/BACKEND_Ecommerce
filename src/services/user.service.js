import { usersManager } from '../DAL/DAOs/usersMongo.dao.js';

class UserService {
  async createUser(user) {
    try {
      const newUser = await usersManager.create(user);
      return newUser;
    } catch (error) {
      throw new Error('Error al intentar crear usuario');
    }
  }

  async findUserByUsername(username) {
    try {
      const user = await usersManager.findUser(username);
      return user;
    } catch (error) {
      throw new Error('Error al intentar buscar usuario');
    }
  }
}

export const userService = new UserService();
