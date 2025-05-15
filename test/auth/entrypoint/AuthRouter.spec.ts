import IAuthRepository from "../../../src/auth/domain/IAuthRepository";
import express from "express";
import FakeRepository from "../helpers/FakeRepository";
import JwtTokenService from "../../../src/auth/data/services/JwtTokenService";
import BcryptPasswordService from "../../../src/auth/data/services/BcryptPasswordService";
import AuthRouter from "../../../src/auth/entrypoint/AuthRouter";
import request from "supertest";
import { expect } from "chai";
import FakePasswordService from "../helpers/FakePasswordService";
import Constants from "../../../constants";
import TokenValidator from "../../../src/auth/helpers/TokenValidator";
import RedisTokenStore from "../../../src/auth/data/services/RedisTokenStore";
import { createClient, RedisClientType } from "redis";

describe("AuthRouter", () => {
  let repository: IAuthRepository;
  let app: express.Application;
  let redisClient: RedisClientType;

  const user = {
    email: "h@gmail.com",
    name: "Abc",
    password: "def",
    type: "google",
  };
  const constants = new Constants();

  beforeEach(async () => {
    repository = new FakeRepository();
    repository.add(user.name, user.email, user.password, user.type);
    let tokenService = new JwtTokenService("privateKey");
    let passwordService = new FakePasswordService();
    redisClient = createClient();
    redisClient.on("error", (err) => console.error("Redis Client Error", err));
    let tokenStore = new RedisTokenStore(redisClient);
    let tokenValidator = new TokenValidator(tokenService, tokenStore);

    app = express();
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(
      "/auth",
      AuthRouter.configure(
        repository,
        tokenService,
        tokenStore,
        passwordService,
        tokenValidator
      )
    );
  });

  it(constants.throw404WhenUserNotFound, async () => {
    await request(app).post("/auth/signin").send({}).expect(404);
  });

  it(constants.return200AndTokenWhenUserIsFound, async () => {
    await request(app)
      .post("/auth/signin")
      .send({ email: user.email, password: user.password })
      .set("Accept", "application/json")
      .expect("Content-type", /json/)
      .expect(200)
      .then((res) => {
        expect(res.body.auth_token).to.not.be.empty;
      });
  });

  it(constants.createUserAndReturnToken, async () => {
    let name = "Haseeb";
    let email = "haseeb@mail.com";
    let password = "12345";
    let type = "email";

    await request(app)
      .post("/auth/signup")
      .send({ email: email, password: password, name: name, type: type })
      .set("Accept", "application/json")
      .expect("Content-type", /json/)
      .expect(200)
      .then((res) => {
        expect(res.body.auth_token).to.not.be.empty;
      });
  });

  it(constants.returnErrors, async () => {
    await request(app)
      .post("/auth/signup")
      .send({
        email: "",
        password: user.password,
        type: "email",
        name: user.name,
      })
      .set("Accept", "application/json")
      .expect("Content-type", /json/)
      .expect(422)
      .then((res) => {
        expect(res.body.errors).to.not.be.empty;
      });
  });
});
