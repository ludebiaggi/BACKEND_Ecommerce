import { usersManager } from '../DATA/DAOs/usersMongo.dao.js';

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
  
  async findUserById(id) {
    try {
        const user = await usersManager.findUserById(id);
        return user;
    } catch (error) {
        throw new Error('Error al intentar encontrar usuario por ID');
    }
}

async findAllUsers() {
    try {
        const users = await usersManager.findAllUsers();
        return users;
    } catch (error) {
        throw new Error('Error al intentar obtener todos los usuarios');
    }
}

async deleteInactiveUsers(twoDaysAgo) {
    try {
        const deletedUsers = await usersManager.deleteManyInactiveUsers(twoDaysAgo);
        return deletedUsers;
    } catch (error) {
        throw new Error('Error al intentar eliminar usuarios inactivos');
    }
}

async deleteUserById(userId) {
    try {
        const deletedUser = await usersManager.deleteUserById(userId);
        return deletedUser;
    } catch (error) {
        throw new Error('Error al intentar eliminar usuario por ID');
    }
}

}

export const userService = new UserService();
