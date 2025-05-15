import mongoose from "mongoose";
import RestaurantRepository from "../../../../src/restaurant/data/repository/RestaurantRepository";
import dotenv from "dotenv";
import { cleanUpDB, prepareDB } from "../helpers/Helpers";
import { expect } from "chai";

dotenv.config();

describe("Test Restaurant Repository ", () => {
  let client: mongoose.Mongoose;
  let sut: RestaurantRepository;

  beforeEach(() => {
    client = new mongoose.Mongoose();
    const connectionString = encodeURI(
      process.env.FOOD_RESTAURANT_DB as string
    );
    client.connect(connectionString);
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
});
