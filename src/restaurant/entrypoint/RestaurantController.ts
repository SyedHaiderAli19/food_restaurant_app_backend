import IRestaurantRepository from "../domain/IRestaurantRepository";
import * as express from "express";
import LocationModel from "../domain/LocationModel";

export default class RestaurantController {
  constructor(private readonly repository: IRestaurantRepository) {}

  public async findAll(req: express.Request, res: express.Response) {
    try {
      const { page, limit } = req.query as { page: string; limit: string };

      return this.repository
        .findAll(parseInt(page), parseInt(limit))
        .then(
          (pageable) =>
            void res.status(200).json({
              metadata: {
                page: pageable.pageNo,
                limit: pageable.limit,
                total_pages: pageable.totalPages,
              },

              restaurants: pageable.data,
            })
        )
        .catch((err: Error) => void res.status(404).json({ error: err }));
    } catch (err: any) {
      if (err.status || (err.status >= 400 && err.status <= 499)) {
        return void res.status(err.status).json({ error: err.message });
      }
      return void res.status(500).json({ error: err.message });
    }
  }

  public async findOne(req: express.Request, res: express.Response) {
    try {
      const { id } = req.params;

      return this.repository
        .findOne(id)
        .then((restaurant) => void res.status(200).json(restaurant))
        .catch((e) => void res.status(404).json({ error: e }));
    } catch (e: any) {
      if (e.status || (e.status >= 400 && e.status <= 499)) {
        return void res.status(e.status).json({ error: e.message });
      }
      return void res.status(500).json({ error: e.message });
    }
  }

  public async findRestaurantByLocation(
    req: express.Request,
    res: express.Response
  ) {
    try {
      const { page, limit, longitude, latitude } = req.query as {
        page: string;
        limit: string;
        longitude: string;
        latitude: string;
      };

      const location = new LocationModel(
        parseFloat(longitude),
        parseFloat(latitude)
      );

      return this.repository
        .findByLocation(location, parseInt(page), parseInt(limit))
        .then(
          (pageable) =>
            void res.status(200).json({
              metadata: {
                page: pageable.pageNo,
                limit: pageable.limit,
                total_pages: pageable.totalPages,
              },

              restaurants: pageable.data,
            })
        )
        .catch((e: any) => void res.status(404).json({ error: e.message }));
    } catch (e: any) {
      if (e.status || (e.status >= 400 && e.status <= 499)) {
        return void res.status(e.status).json({ error: e.message });
      }
      return void res.status(500).json({ error: e.message });
    }
  }

  public async searchRestaurant(req: express.Request, res: express.Response) {
    try {
      const { page, limit, query } = req.query as {
        page: string;
        limit: string;
        query: string;
      };

      return this.repository
        .searchRestaurant(parseInt(page), parseInt(limit), query)
        .then(
          (pageable) =>
            void res.status(200).json({
              metadata: {
                page: pageable.pageNo,
                limit: pageable.limit,
                total_pages: pageable.totalPages,
              },
              restaurants: pageable.data,
            })
        )
        .catch((e) => void res.status(404).json({ error: e }));
    } catch (e: any) {
      if (e.status || (e.status >= 400 && e.status <= 499)) {
        return void res.status(e.status).json({ error: e.message });
      }
      return void res.status(500).json({ error: e.message });
    }
  }

  public async getMenus(req: express.Request, res: express.Response) {
    try {
      const { id } = req.params;

      return this.repository
        .getMenus(id)
        .then(
          (menus) =>
            void res.status(200).json({
              menu: menus,
            })
        )
        .catch((e) => void res.status(404).json({ error: e }));
    } catch (e: any) {
      if (e.status || (e.status >= 400 && e.status <= 499)) {
        return void res.status(e.status).json({ error: e.message });
      }
      return void res.status(500).json({ error: e.message });
    }
  }
}
