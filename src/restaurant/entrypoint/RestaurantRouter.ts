import TokenValidator from "../../auth/helpers/TokenValidator";
import RestaurantRepository from "../data/repository/RestaurantRepository";
import * as express from "express";
import RestaurantController from "./RestaurantController";

export default class RestaurantRouter {
  public static configure(
    repository: RestaurantRepository,
    tokenValidator: TokenValidator
  ): express.Router {
    const router = express.Router();

    let controller = new RestaurantController(repository);

    router.get(
      "/",
      (req, res, next) => tokenValidator.validate(req, res, next),
      (req: express.Request, res: express.Response) =>
        controller.findAll(req, res)
    );

    router.get(
      "/restaurant/:id",
      (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
      ) => tokenValidator.validate(req, res, next),
      (req: express.Request, res: express.Response) =>
        controller.findOne(req, res)
    );

    router.get(
      "/location",
      (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
      ) => tokenValidator.validate(req, res, next),
      (req: express.Request, res: express.Response) =>
        controller.findRestaurantByLocation(req, res)
    );

    router.get(
      "/search",
      (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
      ) => tokenValidator.validate(req, res, next),
      (req: express.Request, res: express.Response) =>
        controller.searchRestaurant(req, res)
    );

    router.get(
      "/restaurant/menu/:id",
      (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
      ) => tokenValidator.validate(req, res, next),
      (req: express.Request, res: express.Response) =>
        controller.getMenus(req, res)
    );
    return router;
  }
}
