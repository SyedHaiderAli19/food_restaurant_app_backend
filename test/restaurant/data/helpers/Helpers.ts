import { Mongoose } from "mongoose";
import RestaurantSchema, {
  Restaurant,
  RestaurantDataModel,
} from "../../../../src/restaurant/data/models/RestaurantDataModel";

export const prepareDB = async (client: Mongoose) => {
  const model = client.model<RestaurantDataModel>(
    "Restaurant",
    RestaurantSchema
  ) as Restaurant;

  await model.ensureIndexes();
  const restaurantDocs = await model.insertMany(restaurants);
};

export const cleanUpDB = async (client: Mongoose) => {
  await client.connection.db?.dropCollection("restaurants");
};

const restaurants = [
  {
    name: "Restuarant Name",
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
    name: "Restuarant Name",
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
    name: "Restuarant Name",
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
    name: "Restuarant Name",
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
    name: "Restuarant Name",
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
