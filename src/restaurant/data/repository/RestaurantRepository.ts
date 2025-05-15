import mongoose from "mongoose";
import IRestaurantRepository from "../../domain/IRestaurantRepository";
import LocationModel from "../../domain/LocationModel";
import MenuModel from "../../domain/MenuModel";
import PageAbleModel from "../../domain/PageAbleModel";
import RestaurantModel from "../../domain/RestaurantModel";
import RestaurantSchema, {
  Restaurant,
  RestaurantDataModel,
} from "../models/RestaurantDataModel";
import { PaginateResult } from "mongoose";
import Constants from "../../../../constants";

export default class RestaurantRepository implements IRestaurantRepository {
  constructor(private readonly client: mongoose.Mongoose) {}
  findOne(id: string): Promise<RestaurantModel> {
    throw new Error("Method not implemented.");
  }
  findByLocation(
    location: LocationModel,
    pageNo: number,
    limit: number
  ): Promise<PageAbleModel<RestaurantModel>> {
    throw new Error("Method not implemented.");
  }
  searchRestaurant(
    pageNo: number,
    limit: number,
    searchQuery: string
  ): Promise<PageAbleModel<RestaurantModel>> {
    throw new Error("Method not implemented.");
  }
  getMenus(restaurantId: string): Promise<MenuModel[]> {
    throw new Error("Method not implemented.");
  }

  constants = new Constants();

  async findAll(
    pageNo: number,
    limit: number
  ): Promise<PageAbleModel<RestaurantModel>> {
    //model set-up
    const model = this.client.model<RestaurantDataModel>(
      "Restaurant",
      RestaurantSchema
    ) as Restaurant;

    const pageOptions = { page: pageNo, limit: limit };

    const pageResults = await model
      .paginate({}, pageOptions)
      .catch((err) => null); // paginate the DB based upon the pagination options

    return this.restaurantsFromPageResults(pageResults);
  }

  private restaurantsFromPageResults(
    pageResults: PaginateResult<RestaurantDataModel> | null
  ) {
    if (pageResults === null || pageResults.docs.length === 0) {
      throw new Error(this.constants.restaurantsNotFound);
    }

    const results = pageResults.docs.map<RestaurantModel>((model) => {
      return new RestaurantModel(
        model.id,
        model.name,
        model.type,
        model.rating,
        model.display_img_url,
        model.location.coordinates,
        model.address
      );
    });

    return new PageAbleModel<RestaurantModel>(
      pageResults.page ?? 0,
      pageResults.limit,
      pageResults.totalPages,
      results
    );
  }
}
