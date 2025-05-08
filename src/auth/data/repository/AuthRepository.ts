import { Mongoose } from "mongoose";
import IAuthRepository from "../../domain/IAuthRepository";
import User from "../../domain/User";
import { UserModel, UserSchema } from "../models/UserModel";
import Constants from "../../../../constants";

export default class AuthRepository implements IAuthRepository {
    constructor(private readonly client: Mongoose){}

   public async find(email: string): Promise<User> {
        const users = this.client.model<UserModel>('user',UserSchema) //User Document (collection) from the database

        const user = await users.findOne({email: email.toLowerCase()}) //finds the user with their email in lower case

        if(!user){ //if user doesn't exists
            return Promise.reject(new Constants().userNotFound)
        }

        return new User(user.id, user.name, user.email,user.password ?? '',user.type) //returns the found user
    }


    public async add(name: string, email: string, type: string, passwordHash?: string): Promise<string> { //saves user to the DB
        const userModel = this.client.model<UserModel>('user',UserSchema) //creates a model schema of user

        const savedUser = new userModel({ 
            type: type,
            name: name,
            email: email.toLowerCase(),
        })

        if(passwordHash){
            savedUser.password = passwordHash
        }

        savedUser.save()

        return savedUser.id

    }

}