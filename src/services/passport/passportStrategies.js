import passport from "passport"
import  userModel from '../../DATA/mongoDB/models/user.model.js'
import {Strategy as LocalStrategy} from 'passport-local'
import {Strategy as GithubStrategy} from 'passport-github2'
import { compareData } from "../../bcrypt-helper.js"
import { usersManager } from "../../DATA/DAOs/usersMongo.dao.js"


//USER > ID
passport.serializeUser((usuario, done)=>{
    done(null,usuario._id);
});

//ID > USER
passport.deserializeUser(async(id, done)=>{
    try{
        const user = await userModel.findById(id);
        done(null, user);
    } catch (error) {
        done (error);
    }
})

//Estrategia local
passport.use('login', new LocalStrategy(
    async function (username, password, done){
        try {
            const userDB = await usersManager.findUserByUsername(username)
            if(!userDB){
                return done(null, false);
            }
            const isPasswordValid = await compareData(password, userDB.password)
            if(!isPasswordValid){
                return done(null, false);
            }
            userDB.lastConnection = new Date();
            await userDB.save();
            return done (null, userDB);

        } catch (error){
            done(error)
        }
    }
))

//Estrategia GITHUB
passport.use('github', new GithubStrategy({
    clientID: 'Iv1.a41f3f97f67704f7', 
    clientSecret: '713ae38c70edb3a85ac437b1b0b44b739a29a05e',
    callbackURL: 'http://localhost:8080/api/session/githubcallback',
}, 
async function(accesToken, refreshToken, profile, done){
    try {
        // Validamos si existe el user de github, si existe accede a la cuenta.
        const userExists = await usersManager.findUserByUsername(profile.username);
        if (userExists) {
            return done(null, userExists);
        }
        //Si el user no existe, lo crea
        const newUser = {
            first_name: profile.displayName,
            last_name: profile.displayName,
            username: profile.username,
            password: ' ',
            fromGithub: true, // Indica que este usuario viene de GitHub
        }
        const result = await usersManager.create(newUser)
        return done (null,result)
    } catch (error)
    {
    done(error)
    }
}));


