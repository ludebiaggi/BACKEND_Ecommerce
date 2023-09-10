import  userModel  from "../db/models/user.model.js";

class UsersManager {

    async create(user){
        try {
            const newUser = await userModel.create(user)
            return newUser
        } catch (error) {
            return error
        }
    }

    async findUser(username){
        try {
            const user = await userModel.findOne({username})
            return user
        } catch (error) {
            return error
        }
    }
}

export const usersManager = new UsersManager()