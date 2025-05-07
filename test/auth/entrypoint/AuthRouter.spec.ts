import IAuthRepository from "../../../src/auth/domain/IAuthRepository"
import express from 'express'
import FakeRepository from "../helpers/FakeRepository"
import JwtTokenService from "../../../src/auth/data/services/JwtTokenService"
import BcryptPasswordService from "../../../src/auth/data/services/BcryptPasswordService"
import AuthRouter from "../../../src/auth/entrypoint/AuthRouter"
import request from 'supertest'
import { expect } from "chai"
import FakePasswordService from "../helpers/FakePasswordService"


describe('AuthRouter',()=>{
    let repository: IAuthRepository
    let app: express.Application

    const user ={
        email: 'h@gmail.com',
        name: 'Abc',
        password:'def',
        type: 'google'
    }

    

    beforeEach( ()=>{
        repository = new FakeRepository()
        repository.add(user.name,user.email,user.password,user.type)
        let tokenService = new JwtTokenService('privateKey')
        let passwordService = new FakePasswordService()


        app=express()
        app.use(express.json())
        app.use(express.urlencoded({extended: true}))
        app.use('/auth',AuthRouter.configure(repository,tokenService,passwordService))
    })

    it('should return 404 when the user is not found', async ()=>{
        await request(app).post('/auth/signin').send({}).expect(404) 
    })

    it('should return 200 and token when user is found',async()=>{
        await request(app).post('/auth/signin').send({email: user.email,password: user.password}).set('Accept','application/json')
        .expect('Content-type',/json/)
        .expect(200)
        .then((res)=>{
            expect(res.body.auth_token).to.not.be.empty
        })
    })
})