import { Response, Request, NextFunction } from "express";
import ITokenService from "../services/ITokenService";
import ITokenStore from "../services/ITokenStore";
import Constants from "../../../constants";
import { asyncHandler } from "./AsyncHandler";

export default class TokenValidator {
  constructor(
    private readonly tokenService: ITokenService,
    private readonly tokenStore: ITokenStore
  ) {}

  constants = new Constants();

  public validate = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const authHeader = req.headers.authorization as string;

      if (!authHeader) {
        //if auth header doesn't contain token
        return void res
          .status(401)
          .json({ error: this.constants.authHeaderRequired });
      }

      const decoded = this.tokenService.decode(authHeader);

      if (
        //if the decoded string returns an error or the token is in the redis store (blacklisted)
        decoded instanceof Error ||
        (await this.tokenStore.get(authHeader)) !== ""
      ) {
        return void res
          .status(403)
          .json({ error: this.constants.invalidToken });
      }

      next(); //executes the next middleware on the controller
    }
  );
}
