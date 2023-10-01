import { usersManager } from "../DAL/usermanager.js";

//Ejemplo de controller en donde usamos dos funciones para disparar dos solicitudes Crear usario y Encontrar usaurio

//Crear usuario en la BBDD a partir de los datos ingresados por el cliente
export const createUser = async (req, res) => {
  try {
    const newUser = await usersManager.create(req.body);
    res.status(201).json({ user: newUser });
  } catch (error) {
    res.status(500).json({ error: "Error al intentar crear usuario" });
  }
};

//Buscar usuario mediante su nombre
export const findUserByUsername = async (req, res) => {
  const { username } = req.params;
  try {
    const user = await usersManager.findUser(username);
    if (user) {
      res.status(200).json({ user });
    } else {
      res.status(404).json({ message: "Usuario no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error al buscar usuario" });
  }
};
