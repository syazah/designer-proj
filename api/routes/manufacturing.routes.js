import express from "express";
const routes = express.Router();
import {
ManufacturerSignInController,
  ManufacturerDetailsController,
  AddWorkerController,
  GetWorkerController,
  GetWorkerDetailController,
  AssignWorkerController,
  DeleteWorkerController,
} from "../controllers/manufacturer.controllers.js";

routes.post("/signin", ManufacturerSignInController);
routes.post("/manufacturer-details", ManufacturerDetailsController);
routes.post("/add-worker", AddWorkerController);
routes.delete("/delete-worker", DeleteWorkerController);
routes.get("/get-worker", GetWorkerController);
routes.get("/get-worker-detail/:id", GetWorkerDetailController);
routes.post("/assign-worker", AssignWorkerController);


export default routes;
