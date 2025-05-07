import ITokenService from "../services/ITokenService";
import SignInUseCase from "../usecases/SignInUseCase";
import * as express from 'express'

    export default  class AuthController {

        private readonly signInUseCase: SignInUseCase
        private readonly tokenService: ITokenService

        constructor(signInUseCase: SignInUseCase, tokenService: ITokenService){
            this.signInUseCase = signInUseCase
            this.tokenService = tokenService
        }

        public async signIn(req:express.Request, res: express.Response): Promise<any>{
            try{
                const {email,password}= req.body
                console.log(email,password)
                return this.signInUseCase.execute(email,password)
                .then((id: string) => {
                    console.log("User id in controller: ", id);
                    const jwtToken =  this.tokenService.encode(id);
                    console.log("Auth token: ", jwtToken)
                    res.status(200).json({auth_token: jwtToken})
                })
                .catch((err: Error)=> {
                    console.log("Error in authController: ", err);
                    res.status(404).json({error:err.message})
                })

            }
            catch(e){
                return res.status(400).json({error:e})

            }

        }
    }