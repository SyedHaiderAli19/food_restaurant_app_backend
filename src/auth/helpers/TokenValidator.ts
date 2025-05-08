import { Response,Request,NextFunction } from "express";
import ITokenService from "../services/ITokenService";
import ITokenStore from "../services/ITokenStore";
import Constants from "../../../constants";
import { asyncHandler } from "./AsyncHandler";

export default class TokenValidator{
    constructor(private readonly tokenService: ITokenService, private readonly tokenStore: ITokenStore){}

    constants = new Constants()

    public validate  = asyncHandler(
       async (req: Request, res: Response, next: NextFunction) => {
           
        const authHeader = req.headers.authorization

        if(!authHeader){ //if auth header doesn't contain token
            return res.status(401).json({error:this.constants.authHeaderRequired })
        }

        if(this.tokenService.decode(authHeader)=== '' || (await this.tokenStore.get(authHeader) !== '')){ // if the auth header is empty or that token is already in the token store (blacklisted)
            return res.status(403).json({error: this.constants.invalidToken})
        }

        next() //executes the next middleware on the controller

       }
   ) 
}