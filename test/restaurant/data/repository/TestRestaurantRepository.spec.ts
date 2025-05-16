import { expect } from "chai";
import dotenv from "dotenv";
import mongoose from "mongoose";
import RestaurantRepository from "../../../../src/restaurant/data/repository/RestaurantRepository";
import { cleanUpDB, prepareDB } from "../helpers/Helpers";
import LocationModel from "../../../../src/restaurant/domain/LocationModel";

dotenv.config();

describe("RestaurantRepository", () => {
  let client: mongoose.Mongoose;
  let sut: RestaurantRepository;

  beforeEach(() => {
    client = new mongoose.Mongoose();
    const connectionStr = encodeURI(process.env.FOOD_RESTAURANT_DB as string);
    client.connect(connectionStr);

    sut = new RestaurantRepository(client);
  });

  afterEach(() => {
    client.disconnect();
  });

  describe("findAll", () => {
    beforeEach(async () => {
      await prepareDB(client);
    });

    afterEach(async () => {
      await cleanUpDB(client);
    });

    it("should return restaurants", async () => {
      const result = await sut.findAll(1, 2);

      expect(result).to.not.be.empty;
      expect(result.data.length).eq(2);
    });
  });

  describe("findOne", () => {
    var insertedId = "";

    beforeEach(async () => {
      const docs = await prepareDB(client);
      insertedId = docs[0].id;
    });

    afterEach(async () => {
      await cleanUpDB(client);
    });

    it("return a promise reject with error message", async () => {
      await sut.findOne("no_id").catch((err) => {
        expect(err).not.be.empty;
      });
    });

    it("should return a found restaurant", async () => {
      const result = await sut.findOne(insertedId);

      expect(result.id).eq(insertedId);
    });
  });

  describe("findByLocation", () => {
    beforeEach(async () => {
      await prepareDB(client);
    });

    afterEach(async () => {
      await cleanUpDB(client);
    });

    it("return a promise reject with error message", async () => {
      const location = new LocationModel(20.33, 73.33);
      await sut.findByLocation(location, 1, 2).catch((err) => {
        expect(err).not.be.empty;
      });
    });

    it("should return a found restaurant", async () => {
      const location = new LocationModel(40.33, 73.23);
      const results = await sut.findByLocation(location, 1, 2);

      expect(results.data.length).eq(2);
    });
  });

  describe("searchRestaurant", () => {
    beforeEach(async () => {
      await prepareDB(client);
    });

    afterEach(async () => {
      await cleanUpDB(client);
    });

    it("returns promise reject with error message when no restaurant is found", async () => {
      const query = "not present";
      await sut.searchRestaurant(1, 2, query).catch((err) => {
        expect(err).to.not.be.empty;
      });
    });

    it("returns restaurants that matches query string", async () => {
      const query = "restaurant name";
      const results = await sut.searchRestaurant(1, 2, query);
      expect(results.data.length).to.eq(2);
    });
  });

  describe("getMenus", () => {
    var insertedId = "";
    beforeEach(async () => {
      const docs = await prepareDB(client);
      insertedId = docs[0].id;
    });

    afterEach(async () => {
      await cleanUpDB(client);
    });

    it("return restaurant menus", async () => {
      const menus = await sut.getMenus(insertedId);
      expect(menus.length).to.eq(1);
      expect(menus[0].items.length).to.eq(2);
    });
  });
});
