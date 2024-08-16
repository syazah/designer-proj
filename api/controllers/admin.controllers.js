import errorHandler from "../utils/errorHandler.js";
import validator from "validator";
import PasswordValidator from "password-validator";
import { Admin } from "../models/Admin.js";
import { User } from "../models/User.js";
import { Business } from "../models/Business.js";
import { NormalPanel } from "../models/NormalPanel.js";
import bcryptjs from "bcryptjs";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.AUTH_MAIL,
    pass: process.env.APP_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false, // Accept self-signed certificates
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
    console.log(error);
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
    console.log(error);
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
