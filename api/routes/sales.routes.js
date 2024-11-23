import express from "express";
const route = express.Router();
import {
  SalesSignInController,
  SalesManGetDetailsController,
  SalesManEditQuotationCostController,
  SalesManSendToAdmin,
  SalesAddCustomerController,
  SalesGetCustomerController,
  SalesGetPanelsController,
} from "../controllers/sale.controllers.js";
route.post("/signin", SalesSignInController);
route.post("/salesman-details", SalesManGetDetailsController);
route.post("/quotation-cost", SalesManEditQuotationCostController);
route.post("/send-admin", SalesManSendToAdmin);
route.post("/add-customer", SalesAddCustomerController);
route.post("/get-customer", SalesGetCustomerController);
route.post("/get-panels", SalesGetPanelsController);
export default route;
