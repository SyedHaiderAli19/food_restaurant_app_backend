import MenuItemModel from "./MenuItemModel";

export default class MenuModel{
    constructor(
        public readonly id: string,
        public readonly restaurantId: string,
        public readonly name: string,
        public readonly imageUrl: string,
        public readonly description: string,
        public readonly items: Array<MenuItemModel>
    ){}
}