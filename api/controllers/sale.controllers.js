import errorHandler from "../utils/errorHandler.js";
import validator from "validator";
import PasswordValidator from "password-validator";
import { Admin } from "../models/Admin.js";
import { User } from "../models/User.js";
import { Order } from "../models/Order.js";
import { Business } from "../models/Business.js";
import { Manufacturer } from "../models/Manufacturer.js";
import { Customer, Sale } from "../models/Sale.js";
import { NormalPanel } from "../models/NormalPanel.js";
import bcryptjs from "bcryptjs";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
dotenv.config();

export const SalesSignInController = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(errorHandler(400, "Send All The Details"));
    }
    const sale = await Sale.findOne({ email });
    if (!sale) {
      return next(errorHandler(400, "No Salesman Found With This Mail"));
    }
    const correctPassword = bcryptjs.compareSync(password, sale.password);
    if (!correctPassword) {
      return next(errorHandler(400, "Password is not correct"));
    }
    const token = jwt.sign({ id: sale._id }, process.env.JWT_SECRET);
    res.status(200).json({ success: true, token, type: 2 });
  } catch (error) {
    return next(error);
  }
};

// SALES MAN GET DETAILS CONTROLLER
export const SalesManGetDetailsController = async (req, res, next) => {
  try {
    const { token } = req.body;
    if (!token) {
      return next(errorHandler(400, "Admin Token Not Found"));
    }
    const { id } = await jwt.verify(token, process.env.JWT_SECRET);
    if (!id) {
      return next(
        errorHandler(
          400,
          "Something went wrong while getting correct id of admin"
        )
      );
    }
    const salesman = await Sale.findOne({ _id: id }).select(
      "name username email"
    );
    const orders = await Order.find({ currentStage: "Sale" }).sort({
      updatedAt: -1,
    });
    const history = await Order.find({ detailedStage: "sales-to-admin" }).sort({
      updatedAt: -1,
    });
    if (!salesman) {
      return next(errorHandler(400, "No Salesman found"));
    }
    res.status(200).json({ success: true, salesman, orders, history });
  } catch (error) {
    return next(error);
  }
};

//SALES MAN EDIT QUOTATION CONTROLLER
export const SalesManEditQuotationCostController = async (req, res, next) => {
  try {
    const { id, cost } = req.body;
    if (!id || !cost) {
      return next(errorHandler(400, "Your credentials are not correct"));
    }
    const order = await Order.findOneAndUpdate(
      { _id: id },
      { quotationCost: cost }
    );
    if (!order) {
      return next(errorHandler(400, "Order not found"));
    }
    return res.status(200).json({ success: true, cost });
  } catch (error) {
    return next(error);
  }
};

//SALES MAN SEND TO ADMIN
export const SalesManSendToAdmin = async (req, res, next) => {
  try {
    const { id } = req.body;
    if (!id) {
      return next(
        errorHandler(400, "Could not find an id linked to the order")
      );
    }

    await Order.findOneAndUpdate(
      { _id: id },
      {
        currentStage: "Admin",
        detailedStage: "sales-to-admin",
      }
    );
    return res.status(200).json({ success: true });
  } catch (error) {
    return next(error);
  }
};

//SALES ADD CUSTOMER
export const SalesAddCustomerController = async (req, res, next) => {
  try {
    const { name, email, phone, address, city, state, panelData, token } =
      req.body;
    if (!name || !email || !phone || !address || !city || !state || !token) {
      return next(errorHandler(400, "Required Fields Not Provided"));
    }
    if (panelData.length === 0) {
      return next(errorHandler(400, "Panel data not provided"));
    }
    const { id } = await jwt.verify(token, process.env.JWT_SECRET);
    const newCustomer = new Customer({
      name,
      email,
      phone,
      address,
      city,
      state,
      panelData,
      createdBy: id,
    });
    await newCustomer.save();
    await Sale.findOneAndUpdate(
      { _id: id },
      { $addToSet: { customers: newCustomer._id } }
    );
    if (!newCustomer) {
      return next(errorHandler(500, "Adding data to database sent error"));
    }
    return res.status(200).json({ success: true, newCustomer });
  } catch (error) {
    return next(error);
  }
};

//SALES GET CUSTOMER CONTROLLER
export const SalesGetCustomerController = async (req, res, next) => {
  try {
    const { token } = req.body;
    if (!token) {
      return next(errorHandler(400, "Token not found"));
    }
    const { id } = await jwt.verify(token, process.env.JWT_SECRET);
    if (!id) {
      return next(errorHandler(500, "Something went wrong while getting id"));
    }
    const salesman = await Sale.findOne({ _id: id });
    if (!salesman) {
      return next(500, "No salesman exists with given token");
    }
    const data = await Customer.find({ createdBy: id });
    if (!data) {
      return next(
        errorHandler(500, " Something went wrong while fetching customers")
      );
    }
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return next(error);
  }
};

// SALES GET PANELS
export const SalesGetPanelsController = async (req, res, next) => {
  try {
    const { id } = req.body;
    if (!id) {
      return next(errorHandler(400, "Required ID not provided"));
    }
    const customer = await Customer.findOne({ _id: id });
    if (!customer) {
      return next(errorHandler(400, "Panels Not found for this id"));
    }
    return res.status(200).json({ success: true, data: customer });
  } catch (error) {
    return next(error);
  }
};

export const SalesCreateOrderController = async (req, res, next) => {
  try {
    const { panelData, token } = req.body;
    if (!panelData) {
      return next(errorHandler(400, "Required Fields Not Provided"));
    }
    if (!token) {
      return next(errorHandler(400, "Admin Token Not Found"));
    }
    const { id } = await jwt.verify(token, process.env.JWT_SECRET);
    if (!id) {
      return next(
        errorHandler(
          400,
          "Something went wrong while getting correct id of admin"
        )
      );
    }
    const newOrder = new Order({
      panelData,
      raisedBy: id,
      referenceNumber: "ALI-" + Math.random().toString(36).substring(2, 15),
      currentStage: "Admin",
      detailedStage: "sales-to-admin",
      pdfLink: null,
    });
    await newOrder.save();
    return res.status(200).json({ success: true, newOrder });
  } catch (error) {
    return next(error);
  }
};
