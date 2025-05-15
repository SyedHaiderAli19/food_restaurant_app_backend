import * as mongoose from "mongoose";

export interface MenuItemDataModel extends mongoose.Document {
  name: string;
  menuId: string;
  description: string;
  image_url: string[];
  unit_price: number;
}

export interface MenuItem extends mongoose.Model<MenuItemDataModel> {}

const MenuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  menuId: { type: String, required: true },
  description: { type: String, required: true },
  image_urls: { type: [String] },
  unit_price: { type: Number, required: true },
});

export default MenuItemSchema;
