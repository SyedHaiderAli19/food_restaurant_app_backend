import mongoose from "mongoose";
import AuthRepository from "./auth/data/repository/AuthRepository";
import JwtTokenService from "./auth/data/services/JwtTokenService";
import BcryptPasswordService from "./auth/data/services/BcryptPasswordService";
import AuthRouter from "./auth/entrypoint/AuthRouter";
import RedisTokenStore from "./auth/data/services/RedisTokenStore";
import { createClient, RedisClientType } from "redis";
import TokenValidator from "./auth/helpers/TokenValidator";
import RestaurantRepository from "./restaurant/data/repository/RestaurantRepository";
import RestaurantRouter from "./restaurant/entrypoint/RestaurantRouter";

export default class CompositionRoot {
  private static client: mongoose.Mongoose;
  private static redisClient: RedisClientType;

  public static async configure() {
    this.client = new mongoose.Mongoose();

    //Redis Cloud Connection
    this.redisClient = createClient({
      username: process.env.REDIS_USERNAME as string,
      password: process.env.REDIS_PASSWORD as string,
      socket: {
        host: process.env.REDIS_HOST as string,
        port: parseInt(process.env.REDIS_PORT as string, 10),
      },
    });

    this.redisClient.on("error", (err) =>
      console.error("Redis Client Error", err)
    );

    await this.redisClient.connect();

    // MongoDB connection
    const connectionString = encodeURI(process.env.DEV_DB as string);
    await this.client.connect(connectionString);
  }

  public static authRouter() {
    const repository = new AuthRepository(this.client);
    const tokenService = new JwtTokenService(process.env.PRIVATE_KEY as string);
    const passwordService = new BcryptPasswordService();
    const tokenStore = new RedisTokenStore(this.redisClient);
    const tokenValidator = new TokenValidator(tokenService, tokenStore);

    return AuthRouter.configure(
      repository,
      tokenService,
      tokenStore,
      passwordService,
      tokenValidator
    );
  }

  public static restaurantRouter() {
    const repository = new RestaurantRepository(this.client);
    const tokenService = new JwtTokenService(process.env.PRIVATE_KEY as string);
    const tokenStore = new RedisTokenStore(this.redisClient);
    const tokenValidator = new TokenValidator(tokenService, tokenStore);

    return RestaurantRouter.configure(repository, tokenValidator);
  }
}
