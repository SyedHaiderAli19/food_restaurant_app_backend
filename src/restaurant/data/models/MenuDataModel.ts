import mongoose from "mongoose";

export interface MenuDataModel extends mongoose.Document {
  name: string;
  restaurantId: string;
  image_url: string;
  description: string;
}

export interface Menu extends mongoose.Model<MenuDataModel> {}

const MenuSchema = new mongoose.Schema({
  name: { type: String, required: true },
  restaurantId: { type: String, required: true },
  description: { type: String, required: true },
  image_url: { type: String },
});

export default MenuSchema;
