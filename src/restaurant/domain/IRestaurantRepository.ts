import LocationModel from "./LocationModel";
import MenuModel from "./MenuModel";
import PageAbleModel from "./PageAbleModel";
import RestaurantModel from "./RestaurantModel";

export default interface IRestaurantRepository{
    findAll(pageNo : number, limit: number):Promise<PageAbleModel<RestaurantModel>> //find all restaurants from the repo and return in pages
    findOne(id: string): Promise<RestaurantModel> //finds the restaurant with the id
    findByLocation(location: LocationModel, pageNo: number, limit: number):Promise<PageAbleModel<RestaurantModel>> //finds restaurant based on their location and returns a list of res in form of pages
    searchRestaurant(pageNo: number,limit: number, searchQuery: string): Promise<PageAbleModel<RestaurantModel>> //finds rest based on the search term and returns a list of rest
    getMenus(restaurantId: string):Promise<MenuModel[]> // gets menus of the res based on the res Id and returns a list of menus

}