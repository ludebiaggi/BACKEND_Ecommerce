import  userModel  from "../mongoDB/models/user.model.js";

class UsersManager {

    async create(user){
        return userModel.create(user);
    } 
    
    async findUserByUsername(username){
        return userModel.findOne({username});
    } 

    async findUserById(id) {
        return userModel.findById(id);
    }

    async findAllUsers() {
        return userModel.find({});
    }

    async deleteManyInactiveUsers(twoDaysAgo) {
        return userModel.deleteMany({ lastConnection: { $lt: twoDaysAgo } });
    }

    async deleteUserById(userId) {
        return userModel.findByIdAndDelete(userId);
    }
}

export const usersManager = new UsersManager()