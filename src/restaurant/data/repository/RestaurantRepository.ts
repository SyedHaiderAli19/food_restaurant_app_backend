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
import MenuSchema, { Menu, MenuDataModel } from "../models/MenuDataModel";
import MenuItemSchema, {
  MenuItem,
  MenuItemDataModel,
} from "../models/MenuItemDataModel";
import MenuItemModel from "../../domain/MenuItemModel";

export default class RestaurantRepository implements IRestaurantRepository {
  constructor(private readonly client: mongoose.Mongoose) {}
  
  public async findOne(id: string): Promise<RestaurantModel> {
    //model set-up
    const model = this.client.model<RestaurantDataModel>(
      "Restaurant",
      RestaurantSchema
    ) as Restaurant;

    const results = await model.findById(id); //Mongo DB built in method to find by id

    if (results === null) {
      throw new Error(this.constants.restaurantsNotFound);
    }

    return new RestaurantModel( // returns that restaurant
      results.id,
      results.name,
      results.type,
      results.rating,
      results.display_img_url,
      results.location.coordinates,
      results.address
    );
  }
  public async findByLocation(
    location: LocationModel,
    pageNo: number,
    limit: number
  ): Promise<PageAbleModel<RestaurantModel>> {
    //model set-up
    const model = this.client.model<RestaurantDataModel>(
      "Restaurant",
      RestaurantSchema
    ) as Restaurant;

    const pageOptions = { page: pageNo, limit: limit, forceCountFn: true };
    const geoQuery = {
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [location.longitude, location.latitude],
          },
          $maxDistance: 2,
        },
      },
    };

    const pageResults = await model
      .paginate(geoQuery, pageOptions)
      .catch((_) => null);

    return this.restaurantsFromPageResults(pageResults);
  }

  public async searchRestaurant(
    pageNo: number,
    limit: number,
    searchQuery: string
  ): Promise<PageAbleModel<RestaurantModel>> {
    //model set-up
    const model = this.client.model<RestaurantDataModel>(
      "Restaurant",
      RestaurantSchema
    ) as Restaurant;

    const pageOptions = { page: pageNo, limit: limit };

    const textQuery = { $text: { $search: searchQuery } };

    const pageResults = await model
      .paginate(textQuery, pageOptions)
      .catch((err) => null);

    return this.restaurantsFromPageResults(pageResults);
  }

  public async getMenus(restaurantId: string): Promise<MenuModel[]> {
    const menuModel = this.client.model<MenuDataModel>(
      "Menu",
      MenuSchema
    ) as Menu;

    const menuItemModel = this.client.model<MenuItemDataModel>(
      "MenuItem",
      MenuItemSchema
    ) as MenuItem;

    const menus = await menuModel.find({ restaurantId: restaurantId });

    if (menus === null) {
      throw new Error(this.constants.noMenuFound);
    }

    const menuIds = menus.map((m) => m.id);

    const items = await menuItemModel.find({ menuId: { $in: menuIds } });

    return this.menusWithMenuItems(menus, items);
  }

  private menusWithMenuItems(
    menus: MenuDataModel[],
    items: MenuItemDataModel[]
  ): MenuModel[] {
    return menus.map(
      (menu) =>
        new MenuModel(
          menu.id,
          menu.restaurantId,
          menu.name,
          menu.image_url,
          menu.description,
          items
            .filter((item) => item.menuId === menu.id)
            .map(
              (menuItem) =>
                new MenuItemModel(
                  menuItem.id,
                  menuItem.menuId,
                  menuItem.description,
                  menuItem.image_url,
                  menuItem.name,
                  menuItem.unit_price
                )
            )
        )
    );
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
