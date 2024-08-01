import express from "express";
import {
  UserSignInController,
  UserSignUpController,
  VerifyUserOTPController,
  CreateCollectionController,
  DeleteCollectionController,
  UpdatePanelDataController,
  GetNormalPanelController,
  GetSingleNormalPanel,
} from "../controllers/user.controller.js";
const routes = express.Router();
routes.post("/signup", UserSignUpController);
routes.post("/signin", UserSignInController);
routes.post("/verify-otp", VerifyUserOTPController);
routes.post("/create-collection", CreateCollectionController);
routes.post("/delete-collection", DeleteCollectionController);
routes.put("/update-panel-data", UpdatePanelDataController);
routes.post("/normal-panel", GetSingleNormalPanel);

routes.get("/get-normal-panel", GetNormalPanelController);
export default routes;
