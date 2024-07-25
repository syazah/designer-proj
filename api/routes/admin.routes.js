import express from "express";
import {
  AdminSignUpController,
  AdminSendDetailsController,
} from "../controllers/admin.controllers.js";

const routes = express.Router();

routes.post("/signup", AdminSignUpController);
routes.post("/send-details", AdminSendDetailsController);

export default routes;
