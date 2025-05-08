import ITokenService from "../services/ITokenService";
import SignInUseCase from "../usecases/SignInUseCase";
import * as express from 'express'
import SignUpUseCase from "../usecases/SignUpUseCase";
import SignOutUseCase from "../usecases/SignOutUseCase";

    export default  class AuthController {

        private readonly signInUseCase: SignInUseCase
        private readonly signUpUseCase: SignUpUseCase
        private readonly signOutUseCase: SignOutUseCase
        private readonly tokenService: ITokenService

        constructor(signInUseCase: SignInUseCase, signUpUseCase: SignUpUseCase, signOutUseCase: SignOutUseCase, tokenService: ITokenService){
            this.signInUseCase = signInUseCase
            this.signUpUseCase = signUpUseCase
            this.signOutUseCase = signOutUseCase
            this.tokenService = tokenService
        }
        //sign in controller
        public async signIn(req:express.Request, res: express.Response): Promise<any>{
            try{
                const {email,password,type,name}= req.body
                return this.signInUseCase.execute(name,email,password,type)
                .then((id: string) => {
                    const jwtToken =  this.tokenService.encode(id);
                    res.status(200).json({auth_token: jwtToken})
                })
                .catch((err: Error)=> {
                    res.status(404).json({error:err.message})
                })

            }
            catch(e : any){
                if(e.status ||  e.status >= 400 && e.status <=499){
                    return res.status(e.status).json({error:e.message})
                }
                return res.status(500).json({error: e.message})
            }

        }


        //signup controller

        public async signUp(req:express.Request, res: express.Response): Promise<any>{
            try{
                const {name,email,password,type}= req.body
                return this.signUpUseCase.execute(name,password,type,email)
                .then((id: string) => {
                    const jwtToken =  this.tokenService.encode(id);
                    res.status(200).json({auth_token: jwtToken})
                })
                .catch((err: Error)=> {
                    res.status(404).json({error:err.message})
                })

            }
            catch(e : any){
                if(e.status ||  e.status >= 400 && e.status <=499){
                    return res.status(e.status).json({error:e.message})
                }
                return res.status(500).json({error: e.message})
            }

        }

        //sign out controller
        public async signOut(req:express.Request, res: express.Response): Promise<any>{
            try{
                const token = req.headers.authorization!
                return this.signOutUseCase.execute(token)
                .then((result) => {
                    res.status(200).json({message: result})
                })
                .catch((err: Error)=> {
                    res.status(404).json({error:err.message})
                })

            }
            catch(e : any){
                if(e.status ||  e.status >= 400 && e.status <=499){
                    return res.status(e.status).json({error:e.message})
                }
                return res.status(500).json({error: e.message})
            }

        }
    }