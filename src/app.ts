import express from "express";
import dotenv from "dotenv";
import Constants from "../constants";
import CompositionRoot from "./CompositionRoot";
const cors = require("cors");

dotenv.config();

CompositionRoot.configure();

const PORT = process.env.PORT;
const constants = new Constants();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/auth", CompositionRoot.authRouter());
app.use("/restaurant", CompositionRoot.restaurantRouter());

app.listen(PORT, () => console.log(constants.listeningPort, PORT));
