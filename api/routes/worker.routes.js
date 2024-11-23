import express from "express";
import {
  AddImageMarkOrderCompleteController,
  GetWorkerDetailsController,
  MarkOrderCompleteController,
  WorkerSignInController,
} from "../controllers/worker.controller.js";
import multer from "multer";

const routes = express.Router();
const upload = multer({ storage: multer.memoryStorage() });
routes.post("/signin", WorkerSignInController);
routes.post(
  "/upload-image/:id",
  upload.single("file"),
  AddImageMarkOrderCompleteController
);
routes.post("/complete-order", MarkOrderCompleteController);
routes.post("/worker-details", GetWorkerDetailsController);

export default routes;
