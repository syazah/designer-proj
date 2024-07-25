import express from "express";
import {
  BusinessSignupController,
  VerifyBusinessOTPController,
  BusinessSignInController,
} from "../controllers/business.controllers.js";

const routes = express.Router();

routes.post("/signup", BusinessSignupController);
routes.post("/verify-otp", VerifyBusinessOTPController);
routes.post("/signin", BusinessSignInController);
export default routes;
