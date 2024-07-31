import express from "express";
import {
  AdminSignUpController,
  AdminSendDetailsController,
  GetAllUsersController,
  GetAllBusinessesController,
  DeleteUserController,
  GetUserDetailController,
  SearchUserController,
  SearchBusinessController,
} from "../controllers/admin.controllers.js";

const routes = express.Router();

routes.post("/signup", AdminSignUpController);
routes.post("/send-details", AdminSendDetailsController);
routes.post("/user-detail-complete", GetUserDetailController);
routes.post("/delete-user", DeleteUserController);
routes.get("/search", SearchUserController);
routes.get("/search/business", SearchBusinessController);
routes.get("/get-users", GetAllUsersController);
routes.get("/get-businesses", GetAllBusinessesController);

export default routes;
