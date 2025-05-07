import mongoose from "mongoose"
import dotenv from 'dotenv'
import AuthRepository from "../../../../src/auth/data/repository/AuthRepository"
import { expect } from "chai"
import bcrypt from 'bcrypt'


dotenv.config()


describe('AuthRepository' , () =>{
    let client: mongoose.Mongoose
    let sut: AuthRepository

    beforeEach(()=>{
        client = new mongoose.Mongoose
        const connectionString = encodeURI(process.env.FOOD_RESTAURANT_DB as string )
        client.connect(connectionString)

        sut= new AuthRepository(client)
    })

    afterEach(()=>{
        client.disconnect()
    })


    it('should return user when email is found', async ()=>{
        //arrange
        const email = 'h@gmail.com'

        //act
        const result = await sut.find(email)

        //assert

        expect(result).to.not.be.empty

    })


    it('should return user id when user is added to the DB', async ()=>{
        
        //arrange
        const user = {
            name: 'Haider',
            email: 'h@gmail.com',
            password: 'abcd',
            type: 'email'
        }

        //act

        const hashedPass = await bcrypt.hash(user.password,10)
        const result = await sut.add(user.name,user.email,hashedPass,user.type)

        //assert

        expect(result).to.not.be.empty


    })
    
})


