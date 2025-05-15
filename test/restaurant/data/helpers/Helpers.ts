import { Mongoose } from "mongoose";
import RestaurantSchema, {
  Restaurant,
  RestaurantDataModel,
} from "../../../../src/restaurant/data/models/RestaurantDataModel";
import MenuSchema, {
  Menu,
  MenuDataModel,
} from "../../../../src/restaurant/data/models/MenuDataModel";
import MenuItemSchema, {
  MenuItem,
  MenuItemDataModel,
} from "../../../../src/restaurant/data/models/MenuItemDataModel";

export const prepareDB = async (client: Mongoose) => {
  const model = client.model<RestaurantDataModel>(
    "Restaurant",
    RestaurantSchema
  ) as Restaurant;

  const menuModel = client.model<MenuDataModel>("Menu", MenuSchema) as Menu;

  const menuItemModel = client.model<MenuItemDataModel>(
    "MenuItem",
    MenuItemSchema
  ) as MenuItem;

  await model.ensureIndexes();
  const restaurantDocs = await model.insertMany(restaurants);

  const menuDocs = await insertMenus(restaurantDocs, menuModel);

  await insertMenuItems(menuDocs, menuItemModel);

  return restaurantDocs;
};

export const cleanUpDB = async (client: Mongoose) => {
  await client.connection.db?.dropCollection("restaurants");
  await client.connection.db?.dropCollection("menus");
  await client.connection.db?.dropCollection("menuitems");
};

const restaurants = [
  {
    name: "Restaurant Name",
    type: "Fast Food",
    rating: 4.5,
    display_img_url: "restaurant.jpg",
    location: {
      coordinates: { longitude: 40.33, latitude: 73.23 },
    },
    address: {
      street: "Road 1",
      city: "City",
      parish: "Parish",
      zone: "Zone",
    },
  },
  {
    name: "Restaurant Name",
    type: "Fast Food",
    rating: 4.5,
    display_img_url: "restaurant.jpg",
    location: {
      coordinates: { longitude: 40.33, latitude: 73.23 },
    },
    address: {
      street: "Road 1",
      city: "City",
      parish: "Parish",
      zone: "Zone",
    },
  },
  {
    name: "Restaurant Name",
    type: "Fast Food",
    rating: 4.5,
    display_img_url: "restaurant.jpg",
    location: {
      coordinates: { longitude: 40.33, latitude: 73.23 },
    },
    address: {
      street: "Road 1",
      city: "City",
      parish: "Parish",
      zone: "Zone",
    },
  },
  {
    name: "Restaurant Name",
    type: "Fast Food",
    rating: 4.5,
    display_img_url: "restaurant.jpg",
    location: {
      coordinates: { longitude: 40.33, latitude: 73.23 },
    },
    address: {
      street: "Road 1",
      city: "City",
      parish: "Parish",
      zone: "Zone",
    },
  },
  {
    name: "Restaurant Name",
    type: "Fast Food",
    rating: 4.5,
    display_img_url: "restaurant.jpg",
    location: {
      coordinates: { longitude: 40.33, latitude: 73.23 },
    },
    address: {
      street: "Road 1",
      city: "City",
      parish: "Parish",
      zone: "Zone",
    },
  },
];

const menus = [
  {
    name: "Lunch",
    description: "a fun menu",
    image_url: "menu.jpg",
  },
];

const menuItems = [
  {
    name: "nuff food",
    description: "awasome!!",
    image_urls: ["url1", "url2"],
    unit_price: 12.99,
  },
  {
    name: "nuff food",
    description: "awasome!!",
    image_urls: ["url1", "url2"],
    unit_price: 12.99,
  },
];

async function insertMenuItems(
  menuDocs: MenuDataModel[],
  menuItemModel: MenuItem
) {
  const items: Array<{}> = [];
  menuDocs.forEach(async (menu) => {
    const itemsWithMenuId = menuItems.map((item) => {
      return { menuId: menu.id, ...item };
    });
    items.push(...itemsWithMenuId);
  });

  await menuItemModel.insertMany(items);
}

async function insertMenus(
  restaurantDocs: RestaurantDataModel[],
  menuModel: Menu
) {
  const restaurantMenus: Array<{}> = [];
  restaurantDocs.forEach((res) => {
    const menu = menus.map((menu) => {
      return { restaurantId: res.id, ...menu };
    });
    restaurantMenus.push(...menu);
  });

  const menuDocs = await menuModel.insertMany(restaurantMenus);
  return menuDocs;
}
