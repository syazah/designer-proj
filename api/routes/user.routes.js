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
  AddNormalPanelCollection,
  HandleRaiseOrderController,
  UploadOrderController,
  GetOrderHistoryController,
} from "../controllers/user.controller.js";
import multer from "multer";
const routes = express.Router();

// MULTER CONFIG
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Ensure the 'uploads' directory exists
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`); // Create a unique filename
  },
});
const upload = multer({ storage });

// ROUTES
routes.post("/signup", UserSignUpController);
routes.post("/signin", UserSignInController);
routes.post("/verify-otp", VerifyUserOTPController);
routes.post("/create-collection", CreateCollectionController);
routes.post("/delete-collection", DeleteCollectionController);
routes.put("/update-panel-data", UpdatePanelDataController);
routes.post("/normal-panel", GetSingleNormalPanel);
routes.post("/add-normal-panel", AddNormalPanelCollection);

// ORDER
routes.post("/upload-order/:id", upload.single("file"), UploadOrderController);
routes.post("/raise-order", HandleRaiseOrderController);
routes.post("/get-order-history", GetOrderHistoryController);

routes.get("/get-normal-panel", GetNormalPanelController);
export default routes;
