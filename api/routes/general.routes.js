import express from "express";
import {
  GetUserGeneral,
  GetCollectionController,
  CreatePanelDetailController,
  GetPanelDetailController,
  SignOutController,
  DeletePanelController,
  HandleGetOTPForgotPassword,
  HandleVerifyOTP,
  HandleResetPassword,
} from "../controllers/general.controllers.js";

const routes = express.Router();

routes.post("/get-user", GetUserGeneral);
routes.post("/get-collection", GetCollectionController);
routes.post("/basic-panel-detail", CreatePanelDetailController);
routes.post("/get-panel-detail", GetPanelDetailController);
routes.post("/delete-panel", DeletePanelController);
routes.post("/forgot-password/get-otp", HandleGetOTPForgotPassword);
routes.post("/forgot-password/verify-otp", HandleVerifyOTP);
routes.post("/forgot-password/reset-password", HandleResetPassword);
routes.get("/signout", SignOutController);

export default routes;
