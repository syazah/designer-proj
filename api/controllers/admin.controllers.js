import errorHandler from "../utils/errorHandler.js";
import validator from "validator";
import PasswordValidator from "password-validator";
import { Admin } from "../models/Admin.js";
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
