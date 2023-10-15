import  userModel  from "../mongoDB/models/user.model.js";

class UsersManager {

    async create(user){
        return userModel.create(user);
    } 
    
    async findUserByUsername(username){
        return userModel.findOne({username});
    } 

}

export const usersManager = new UsersManager()