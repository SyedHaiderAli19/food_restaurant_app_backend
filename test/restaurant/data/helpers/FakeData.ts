import dotenv from "dotenv";
import { faker } from "@faker-js/faker";
import mongoose from "mongoose";
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

const addFakeRestaurantsToDev = async () => {
  dotenv.config();
  const connectionStr = encodeURI(process.env.DEV_DB as string);
  let client = new mongoose.Mongoose();
  client.connect(connectionStr);

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
  //console.log(restaurants())
  const restaurantDocs = await model.insertMany(restaurants());
  console.log(menus());
  const menuDocs = await insertMenus(restaurantDocs, menuModel);

  await insertMenuItems(menuDocs, menuItemModel);

  //   return restaurantDocs
  console.log("done");
  return;
};

function restaurants() {
  return Array(10)
    .fill(10)
    .map((_, idx) => {
      const img_ids = [292, 492, 835, 999];

      return {
        name: faker.company.name(),
        type: faker.commerce.productName(),
        rating: faker.number.float({ min: 1.0, max: 5.0 }),
        display_img_url: `https://picsum.photos/id/${
          img_ids[faker.number.int({ min: 0, max: 3 })]
        }/300`,
        location: {
          coordinates: {
            longitude: faker.location.longitude(),
            latitude: faker.location.latitude(),
          },
        },
        address: {
          street: faker.location.street(),
          city: faker.location.city(),
          parish: faker.location.county(),
          zone: faker.location.state(),
        },
      };
    });
}

function menus() {
  const size = faker.number.int({ min: 3, max: 5 });
  return Array(size)
    .fill(size)
    .map((_, idx) => {
      const img_ids = [292, 492, 835, 999];

      return {
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        image_url: `https://picsum.photos/id/${
          img_ids[faker.number.int({ min: 0, max: 3 })]
        }/300`,
      };
    });
}

function menuItems() {
  const size = faker.number.int({ max: 15, min: 5 });
  return Array(size)
    .fill(size)
    .map((_, idx) => {
      const imgids = [292, 492, 835, 999];
      return {
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        image_urls: [
          `https://picsum.photos/id/${
            imgids[faker.number.int({ min: 0, max: 3 })]
          }/300`,
        ],
        unit_price: faker.commerce.price({ min: 400, max: 6000 }),
      };
    });
}

async function insertMenuItems(
  menuDocs: MenuDataModel[],
  menuItemModel: MenuItem
) {
  const items: Array<{}> = [];
  menuDocs.forEach(async (menu) => {
    const itemsWithMenuId = menuItems().map((item) => {
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
    const menu = menus().map((menu) => {
      return { restaurantId: res.id, ...menu };
    });
    restaurantMenus.push(...menu);
  });

  const menuDocs = await menuModel.insertMany(restaurantMenus);
  return menuDocs;
}

addFakeRestaurantsToDev();
