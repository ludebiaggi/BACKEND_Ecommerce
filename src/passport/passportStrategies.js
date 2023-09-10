import passport from "passport"
import  userModel from '../db/models/user.model.js'
import {Strategy as LocalStrategy} from 'passport-local'
import {Strategy as GithubStrategy} from 'passport-github2'
import { compareData } from "../utils.js"
import { usersManager } from "../managers/usersManager.js"


//user => is
passport.serializeUser((usuario, done)=>{
    done(null,usuario._id)
})

//id => user
passport.deserializeUser(async(id, done)=>{
    try{
        const user = await userModel.findById(id)
        done(null, user)
    } catch (error) {
        done (error)
    }
})

//Estrategia local
passport.use('login', new LocalStrategy(
    async function (username, password, done){
        try {
            const userDB = await usersManager.findUser(username)
            if(!userDB){
                return done(null, false)
            }
            const isPasswordValid = await compareData(password, userDB.password)
            if(!isPasswordValid){
                return done(null, false)
            }
            return done (null,userDB)
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
        const userDB = await usersManager.findUser(profile.username)
        if(userDB){
            return done(null, false)
        }
        const newUser = {
            first_name: profile.displayName.split(' ') [0],
            last_name: profile.displayName.split(' ') [1],
            username: profile.username,
            password: ' '
        }
        const result = await usersManager.create(newUser)
        return done (null,result)
    } catch (error)
    {
    done(error)
    }
}
))
