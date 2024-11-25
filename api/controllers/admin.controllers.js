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
import { Costsheet } from "../models/Costsheet.js";
import { Inventory } from "../models/Inventory.js";
dotenv.config();
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.AUTH_MAIL,
    pass: process.env.APP_PASSWORD,
  },
});

// SIGN UP
export const AdminSignUpController = async (req, res, next) => {
  try {
    const { name, username, email, password } = req.body;
    if (
      !name ||
      !email ||
      !username ||
      !password ||
      name === "" ||
      username === "" ||
      email === "" ||
      password === ""
    ) {
      return next(errorHandler(400, "All Fields Are Required"));
    }
    if (!validator.isEmail(email)) {
      return next(errorHandler(400, "Email Is Incorrect"));
    }
    const passwordSchema = new PasswordValidator();
    passwordSchema
      .is()
      .min(8)
      .is()
      .max(100)
      .has()
      .uppercase()
      .has()
      .lowercase()
      .has()
      .digits(2)
      .has()
      .not()
      .spaces();
    if (!passwordSchema.validate(password)) {
      return next(errorHandler(400, "Password Not Correct"));
    }

    const existAdmin = await Admin.findOne({ $or: [{ username }, { email }] });

    if (existAdmin) {
      return next(
        errorHandler(400, "Admin With Same Username Or Email Exists")
      );
    }

    // CREATING ADMIN
    const cryptedPassword = bcryptjs.hashSync(password, 10);
    const newadmin = new Admin({
      username,
      name,
      email,
      password: cryptedPassword,
      isAdmin: true,
    });
    newadmin.save();
    res.status(200).json({ success: true, message: "Admin Created" });
  } catch (error) {
    next(error);
  }
};

//SIGN IN
export const AdminSignInController = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(errorHandler(400, "Send All The Details"));
    }
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return next(errorHandler(400, "No Admin Found With This Mail"));
    }
    const correctPassword = bcryptjs.compareSync(password, admin.password);
    if (!correctPassword) {
      return next(errorHandler(400, "Password is not correct"));
    }
    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET);
    res.status(200).json({ success: true, token, type: 1 });
  } catch (error) {
    return next(error);
  }
};

// SEND DETAILS
export const AdminSendDetailsController = async (req, res, next) => {
  try {
    const formData = req.body;
    const mailOptions = {
      from: process.env.AUTH_MAIL,
      to: formData.email,
      subject: "Account Created",
      html: `<div> <h2>Hello, ${
        formData.name
      }</h2><b/> <p>Thank you for joining Alisan. We are excited to have you on board.</p> <p>Your account has been successfully created. Here are your login details:</p><b/><p>
      Email:</strong> ${formData.email}</p> <p><strong>Password:</strong> ${
        formData.password
      }</p><b/><p>If you have any questions or need assistance, please feel free to reach out to our support team.</p></div> ${
        formData.businessCode
          ? `<p>Business Code : ${formData.businessCode}</p>`
          : "<p></p>"
      }`,
    };
    transporter.sendMail(mailOptions);
    res.status(200).json({ success: true });
  } catch (error) {
    next(errorHandler(500, "Internal Server Error"));
  }
};

//GET ALL USERS
export const GetAllUsersController = async (req, res, next) => {
  try {
    const { limit, page } = req.query;
    const dataLimit = parseInt(limit) || 10;
    const skipPage = parseInt(page) || 0;
    const innumDoc = await User.countDocuments();
    const numDoc = innumDoc / 10 + (innumDoc % 10) > 0 ? 1 : 0;
    const user = await User.find({})
      .skip(skipPage * dataLimit)
      .limit(dataLimit);
    res.status(200).json({ success: true, user, numDoc });
  } catch (error) {
    next(error);
  }
};

//GET ALL BUSINESSES
export const GetAllBusinessesController = async (req, res, next) => {
  try {
    const { limit, page } = req.query;
    const dataLimit = parseInt(limit) || 10;
    const skipPage = parseInt(page) || 0;
    const innumDoc = await Business.countDocuments();
    const numDoc = innumDoc / 10 + (innumDoc % 10) > 0 ? 1 : 0;
    const user = await Business.find({})
      .skip(skipPage * dataLimit)
      .limit(dataLimit);
    res.status(200).json({ success: true, user, numDoc });
  } catch (error) {
    next(error);
  }
};

// DELETE USER CONTROLLER
export const DeleteUserController = async (req, res, next) => {
  try {
    const { id } = req.body;
    if (!id) {
      return next(errorHandler(400, "Some Internal Error"));
    }
    await User.findOneAndDelete({ _id: id });
    res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
};

//GET USER DETAIL CONTROLLER
export const GetUserDetailController = async (req, res, next) => {
  try {
    const { id } = req.body;
    if (!id) {
      return next(errorHandler(400, "User Details Not Found"));
    }
    const data = await User.findOne({ _id: id })
      .populate({ path: "createdBy" })
      .populate({ path: "collectionsCreated", populate: { path: "panels" } });

    if (!data) {
      return next(errorHandler(400, "User Details Not Found"));
    }
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(errorHandler(error));
  }
};

//GET SEARCHED USER
export const SearchUserController = async (req, res, next) => {
  try {
    const { query } = req.query;
    if (!query) {
      return next(errorHandler(400, "Some Error Occurred"));
    }
    const regex = new RegExp(query, "i");
    const searchCriteria = {
      $or: [{ name: { $regex: regex } }, { username: { $regex: regex } }],
    };

    const user = await User.find(searchCriteria);
    res.status(200).json({ success: true, user });
  } catch (error) {
    next(error);
  }
};
//GET SEARCHED Business
export const SearchBusinessController = async (req, res, next) => {
  try {
    const { query } = req.query;
    if (!query) {
      return next(errorHandler(400, "Some Error Occurred"));
    }
    const regex = new RegExp(query, "i");
    const searchCriteria = {
      $or: [{ name: { $regex: regex } }, { username: { $regex: regex } }],
    };

    const user = await Business.find(searchCriteria);
    res.status(200).json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

// ADD NORMAL PANEL
export const AddNormalPanelController = async (req, res, next) => {
  try {
    const { name, size, glass, frame, variant } = req.body;

    if (!name || !variant || !size)
      return next(errorHandler(400, "Panel Data Is Required"));

    const newNormalPanel = new NormalPanel({
      name,
      glass,
      frame,
      variant,
      size,
    });
    await newNormalPanel.save();

    res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
};

//GET BUSINESS CONTROLLER
export const GetBusinessDetailController = async (req, res, next) => {
  try {
    const { id } = req.body;
    if (!id) {
      return next(errorHandler(400, "User Details Not Found"));
    }
    const data = await Business.findOne({ _id: id }).populate({
      path: "clientsCreated",
    });

    // if (!data) {
    //   return next(errorHandler(400, "User Details Not Found"));
    // }
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(errorHandler(error));
  }
};

//! APP
//ADMIN GET ADMIN DETAILS
export const AdminGetAdminDetailsController = async (req, res, next) => {
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
    const admin = await Admin.findOne({ _id: id }).select(
      "name username email"
    );
    const orders = await Order.find({}).sort({ createdAt: -1 }).limit(5);
    if (!admin) {
      return next(errorHandler(400, "No admin found"));
    }
    res.status(200).json({ success: true, admin, orders });
  } catch (error) {
    return next(error);
  }
};

//ADMIN ADD SALES PERSON
export const AdminAddSalesPersonController = async (req, res, next) => {
  try {
    const { email, name, password, phoneNumber } = req.body;
    if (!email || !name || !password || !phoneNumber) {
      return next(errorHandler(400, "All the fields are required"));
    }
    if (password.length < 8) {
      return next(
        errorHandler(400, "Password must be having at least 8 characters")
      );
    }
    if (phoneNumber.length < 10) {
      return next(errorHandler(400, "Wrong Phone Number Please Check"));
    }
    const hashedPassword = bcryptjs.hashSync(password, 10);
    const salesman = new Sale({
      email,
      password: hashedPassword,
      name,
      phoneNumber,
    });
    await salesman.save();
    res.status(200).json({ success: true, message: "Salesman is created" });
  } catch (error) {
    return next(error);
  }
};

export const AdminGetSalesTeamController = async (req, res, next) => {
  try {
    const salesTeam = await Sale.find({});
    res.status(200).json({ success: true, salesTeam });
  } catch (error) {
    return next(error);
  }
};
// GET MANUFACTURING TEAM
export const AdminGetManufacturingTeamController = async (req, res, next) => {
  try {
    const manTeam = await Manufacturer.find({});
    res.status(200).json({ success: true, manTeam });
  } catch (error) {
    return next(error);
  }
};

// ADD MANUFACTURER CONTROLLER
export const AdminAddManufacturerController = async (req, res, next) => {
  try {
    const { email, name, password, phoneNumber } = req.body;
    if (!email || !name || !password || !phoneNumber) {
      return next(errorHandler(400, "All the fields are required"));
    }
    if (password.length < 8) {
      return next(
        errorHandler(400, "Password must be having at least 8 characters")
      );
    }
    if (phoneNumber.length < 10) {
      return next(errorHandler(400, "Wrong Phone Number Please Check"));
    }
    const hashedPassword = bcryptjs.hashSync(password, 10);
    const salesman = new Manufacturer({
      email,
      password: hashedPassword,
      name,
      phoneNumber,
    });
    await salesman.save();
    res.status(200).json({ success: true, message: "Manufacturer is created" });
  } catch (error) {
    return next(error);
  }
};

//DELETE SALESMAN
export const AdminDeleteSalesManController = async (req, res, next) => {
  try {
    const { _id } = req.body;
    if (!_id) {
      return next(errorHandler(400, "Request ID not found"));
    }
    await Sale.findOneAndDelete({ _id });
    return res.status(200).json({ success: true });
  } catch (error) {
    return next(error);
  }
};
//DELETE Manufacturer
export const AdminDeleteManufacturerController = async (req, res, next) => {
  try {
    const { _id } = req.body;
    if (!_id) {
      return next(errorHandler(400, "Request ID not found"));
    }
    await Manufacturer.findOneAndDelete({ _id });
    return res.status(200).json({ success: true });
  } catch (error) {
    return next(error);
  }
};

//GET ADMIN ORDERS
export const AdminGetAdminOrdersController = async (req, res, next) => {
  try {
    const AdminOrders = await Order.find({
      currentStage: "Admin",
      detailedStage: null,
    });
    const SalesOrders = await Order.find({ detailedStage: "sales-to-admin" });
    const CompletedOrders = await Order.find({ detailedStage: "completed" });
    return res
      .status(200)
      .json({ success: true, AdminOrders, SalesOrders, CompletedOrders });
  } catch (error) {
    return next(error);
  }
};
//GET SALES CONTROLLER
export const AdminGetSalesOrdersController = async (req, res, next) => {
  try {
    const SalesOrders = await Order.find({ currentStage: "Sale" }).populate({
      path: "assignedTo",
    });
    return res.status(200).json({ success: true, SalesOrders });
  } catch (error) {
    return next(error);
  }
};

//GET SPECIFIC ORDER
export const AdminGetSpecificOrderController = async (req, res, next) => {
  try {
    const { _id } = req.body;
    if (!_id) {
      return next(
        errorHandler(400, "The order id is not present in the request")
      );
    }
    let order = await Order.findOne({ _id })
      .populate({
        path: "raisedBy worker",
        populate: { path: "createdBy" },
      })
      .populate({ path: "assignedTo" });

    if (!order) {
      return next(errorHandler(400, "Cannot find the order by this id"));
    }
    return res.status(200).json({ success: true, order });
  } catch (error) {
    return next(error);
  }
};

//ASSIGN ORDER
export const AdminAssignOrderSalesmanController = async (req, res, next) => {
  try {
    const { orderID, salesManID } = req.body;
    if (!orderID || !salesManID) {
      return next(errorHandler(400, "No Proper IDs found"));
    }
    await Order.findOneAndUpdate(
      { _id: orderID },
      { currentStage: "Sale", assignedTo: salesManID }
    );
    await Sale.findOneAndUpdate(
      { _id: salesManID },
      { $push: { orders: orderID } }
    );
    res.status(200).json({ success: true });
  } catch (error) {
    return next(error);
  }
};

//Admin view salesman controller
export const AdminViewSalesmanController = async (req, res, next) => {
  try {
    const { id } = req.body;
    if (!id) {
      return next(errorHandler(400, "No id found"));
    }
    const salesman = await Sale.findOne({ _id: id }).populate("orders");
    if (!salesman) {
      return next(errorHandler(400, "No Salesman with this id found"));
    }
    return res.status(200).json({ success: true, salesman });
  } catch (error) {
    return next(error);
  }
};

//ADMIN UPDATE SHEET CONTROLLER
export const AdminUpdateCostSheetController = async (req, res, next) => {
  try {
    const { ms1, pc1, tsb, pcb, cse, ps, esp, scr, _id } = req.body;
    const costSheet = await Costsheet.find({});
    if (costSheet.length === 0) {
      const sheet = new Costsheet({
        ms1,
        pc1,
        tsb,
        pcb,
        cse,
        ps,
        esp,
        scr,
      });
      await sheet.save();
    }
    const newSheet = await Costsheet.findOneAndUpdate(
      { _id: _id },
      {
        ms1,
        pc1,
        tsb,
        pcb,
        cse,
        ps,
        esp,
        scr,
      },
      { new: true }
    );
    res.status(200).json({ success: true, costSheet: newSheet });
  } catch (error) {
    return next(error);
  }
};

//ADMIN GET COST SHEET
export const AdminGetCostSheetController = async (req, res, next) => {
  try {
    const costSheet = await Costsheet.find({});
    return res.status(200).json({ success: true, costSheet: costSheet[0] });
  } catch (error) {
    return next(error);
  }
};

//ADMIN GET MANUFACTURING TEAM
export const AdminAssignOrderManufacturer = async (req, res, next) => {
  try {
    const { orderID, manufacturerID } = req.body;
    if (!orderID || !manufacturerID) {
      return next(errorHandler(400, "No Proper IDs found"));
    }
    await Order.findOneAndUpdate(
      { _id: orderID },
      {
        currentStage: "Manufacturer",
        assignedTo: manufacturerID,
        detailedStage: null,
      }
    );
    await Sale.findOneAndUpdate(
      { _id: manufacturerID },
      { $push: { orders: orderID } }
    );
    res.status(200).json({ success: true });
  } catch (error) {
    return next(error);
  }
};

//GET MANUFACTURER ASSIGNED ORDERS
export const AdminGetManufacturerOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ currentStage: "Manufacturer" }).populate({
      path: "assignedTo panelData",
    });
    if (!orders) {
      return next(errorHandler(400, "No orders found for manufacturers"));
    }
    return res.status(200).json({ success: true, orders });
  } catch (error) {
    return next(error);
  }
};

//ADMIN ADD INVENTORY
export const AdminAddInventoryDetail = async (req, res, next) => {
  try {
    const { name, minimum, objectID } = req.body;
    if (!name || !minimum) {
      return next(errorHandler(400, "Required fields are not provided"));
    }
    const existInventory = await Inventory.findOne({ objectID });
    if (existInventory) {
      return next(
        errorHandler(400, "An object with this object ID already exists")
      );
    }
    const inventory = new Inventory({
      name,
      objectID,
      minimum: Number(minimum),
    });

    await inventory.save();
    return res.status(200).json({ success: true, inventory });
  } catch (error) {
    return next(error);
  }
};

//ADMIN GET INVENTORY
export const AdminGetInventory = async (req, res, next) => {
  try {
    const inventory = await Inventory.find({});
    if (!inventory) {
      return next(errorHandler(500, "Inventory not found"));
    }
    return res.status(200).json({ success: true, inventory });
  } catch (error) {
    return next(error);
  }
};

//ADMIN UPDATE INVENTORY
export const AdminUpdateInventoryController = async (req, res, next) => {
  try {
    const { name, minimum, objectID, id, current } = req.body;
    if (!id) {
      return next(errorHandler(400, "Required fields are not provided"));
    }
    const inventory = await Inventory.findOneAndUpdate({
      name,
      minimum,
      objectID,
      id,
      current,
    });
    if (!inventory) {
      return next(errorHandler(500, "Something broke internally"));
    }
    return res.status(200).json({ success: true });
  } catch (error) {
    return next(error);
  }
};

//ADMIN DELETE INVENTORY
export const AdminDeleteInventoryController = async (req, res, next) => {
  try {
    const { id } = req.body;
    if (!id) {
      return next(errorHandler(400, "Required Id Not Found"));
    }
    await Inventory.delete({ _id: id });
    return res.status(200).json({ success: true });
  } catch (error) {
    return next(error);
  }
};
