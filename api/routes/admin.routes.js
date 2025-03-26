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
  AddNormalPanelController,
  GetBusinessDetailController,
  AdminSignInController,
  AdminGetAdminDetailsController,
  AdminAddSalesPersonController,
  AdminGetSalesTeamController,
  AdminGetManufacturingTeamController,
  AdminAddManufacturerController,
  AdminDeleteManufacturerController,
  AdminDeleteSalesManController,
  AdminGetAdminOrdersController,
  AdminGetSpecificOrderController,
  AdminAssignOrderSalesmanController,
  AdminGetManufacturerOrders,
  AdminGetSalesOrdersController,
  AdminUpdateCostSheetController,
  AdminViewSalesmanController,
  AdminGetCostSheetController,
  AdminAssignOrderManufacturer,
  AdminAddInventoryDetail,
  AdminGetInventory,
  AdminUpdateInventoryController,
  AdminDeleteInventoryController,
  AdminUpdateBOMUpdate,
} from "../controllers/admin.controllers.js";

const routes = express.Router();

//!APP
routes.post("/admin-details", AdminGetAdminDetailsController);
routes.get("/admin-orders", AdminGetAdminOrdersController);
routes.get("/get-cost-sheet", AdminGetCostSheetController);
routes.post("/get-specific-order", AdminGetSpecificOrderController);
routes.post("/assign-order-salesman", AdminAssignOrderSalesmanController);
routes.post("/update-cost-sheet", AdminUpdateCostSheetController);
routes.post("/add-inventory", AdminAddInventoryDetail);
routes.get("/get-inventory", AdminGetInventory);
routes.put("/update-inventory", AdminUpdateInventoryController);
routes.delete("/delete-inventory", AdminDeleteInventoryController);
routes.put("/update-order-inventory", AdminUpdateBOMUpdate);
//Sales
routes.post("/add-sales-person", AdminAddSalesPersonController);
routes.post("/delete-salesman", AdminDeleteSalesManController);
routes.get("/sales-team", AdminGetSalesTeamController);
routes.get("/sales-orders", AdminGetSalesOrdersController);
routes.post("/view-salesman", AdminViewSalesmanController);
//Manufacturer
routes.post("/assign-order-manufacturer", AdminAssignOrderManufacturer);
routes.get("/manufacturer-orders", AdminGetManufacturerOrders);
routes.post("/add-manufacturer", AdminAddManufacturerController);
routes.post("/delete-manufacturer", AdminDeleteManufacturerController);
routes.get("/manufacturing-team", AdminGetManufacturingTeamController);

//!WEBSITE
routes.post("/signup", AdminSignUpController);
routes.post("/signin", AdminSignInController);
routes.post("/send-details", AdminSendDetailsController);
routes.post("/user-detail-complete", GetUserDetailController);
routes.post("/business-detail-complete", GetBusinessDetailController);
routes.post("/delete-user", DeleteUserController);
routes.post("/normal-panel", AddNormalPanelController);
routes.get("/search", SearchUserController);
routes.get("/search/business", SearchBusinessController);
routes.get("/get-users", GetAllUsersController);
routes.get("/get-businesses", GetAllBusinessesController);

export default routes;
