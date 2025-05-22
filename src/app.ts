// src/app.ts
import express from "express";
import dotenv from "dotenv";
import CompositionRoot from "./CompositionRoot";
const cors = require("cors");

dotenv.config();

CompositionRoot.configure();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/auth", CompositionRoot.authRouter());
app.use("/restaurant", CompositionRoot.restaurantRouter());

export default app; 
