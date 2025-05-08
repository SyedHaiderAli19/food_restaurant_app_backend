import mongoose from "mongoose"
import AuthRepository from "./auth/data/repository/AuthRepository"
import JwtTokenService from "./auth/data/services/JwtTokenService"
import BcryptPasswordService from "./auth/data/services/BcryptPasswordService"
import AuthRouter from "./auth/entrypoint/AuthRouter"
import RedisTokenStore from "./auth/data/services/RedisTokenStore"
import redis from "redis"
import TokenValidator from "./auth/helpers/TokenValidator"

export default class CompositionRoot{

    private static client: mongoose.Mongoose
    private static redisClient : redis.RedisClientType

    public static configure(){
        this.client = new mongoose.Mongoose()
        this.redisClient = redis.createClient()
        const connectionString = encodeURI(process.env.FOOD_RESTAURANT_DB as string)
        this.client.connect(connectionString)
    }

    public static authRouter(){
        const repository = new AuthRepository(this.client)
        const tokenService = new JwtTokenService(process.env.PRIVATE_KEY as string)
        const passwordService = new BcryptPasswordService()
        const tokenStore = new RedisTokenStore(this.redisClient)
        const tokenValidator = new TokenValidator(tokenService, tokenStore)

        return AuthRouter.configure(repository,tokenService,tokenStore,passwordService,tokenValidator)
    }

    
}