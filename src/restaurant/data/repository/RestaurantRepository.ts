import IRestaurantRepository from "../../domain/IRestaurantRepository";
import LocationModel from "../../domain/LocationModel";
import MenuModel from "../../domain/MenuModel";
import PageAbleModel from "../../domain/PageAbleModel";
import RestaurantModel from "../../domain/RestaurantModel";

export default class RestaurantRepository implements IRestaurantRepository{
    findAll(pageNo: number, limit: number): Promise<PageAbleModel<RestaurantModel>> {
        throw new Error("Method not implemented.");
    }
    findOne(id: string): Promise<RestaurantModel> {
        throw new Error("Method not implemented.");
    }
    findByLocation(location: LocationModel, pageNo: number, limit: number): Promise<PageAbleModel<RestaurantModel>> {
        throw new Error("Method not implemented.");
    }
    searchRestaurant(pageNo: number, limit: number, searchQuery: string): Promise<PageAbleModel<RestaurantModel>> {
        throw new Error("Method not implemented.");
    }
    getMenus(restaurantId: string): Promise<MenuModel[]> {
        throw new Error("Method not implemented.");
    }

}