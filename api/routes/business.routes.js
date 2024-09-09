import express from "express";
import {
  BusinessSignupController,
  VerifyBusinessOTPController,
  BusinessSignInController,
  BusinessViewUsersController,
  BusinessUserSearchController,
} from "../controllers/business.controllers.js";

const routes = express.Router();

routes.post("/signup", BusinessSignupController);
routes.post("/verify-otp", VerifyBusinessOTPController);
routes.post("/signin", BusinessSignInController);
routes.get("/search", BusinessUserSearchController);
routes.post("/get-users", BusinessViewUsersController);
export default routes;
