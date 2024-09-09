import errorHandler from "../utils/errorHandler.js";
import { Business } from "../models/Business.js";
import { User } from "../models/User.js";
import { Verification } from "../models/Verification.js";
import bcryptjs from "bcryptjs";
import validator from "validator";
import PasswordValidator from "password-validator";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";

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

export const BusinessSignupController = async (req, res, next) => {
  try {
    const { name, email, businessCode, password, address, number, tier } =
      req.body;
    if (
      !name ||
      !email ||
      !businessCode ||
      !number ||
      !tier ||
      !address ||
      !password
    ) {
      return next(errorHandler(400, "All Fields Are Required"));
    }

    const existBusiness = await Business.findOne({
      $or: [{ email }, { businessCode }, { name }],
    });
    if (existBusiness) {
      return next(
        errorHandler(
          400,
          "A business with same email, businessCode or name exists"
        )
      );
    }
    if (!validator.isEmail(email)) {
      return next(errorHandler(400, "Check Your Email"));
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
    const hashedPassword = await bcryptjs.hashSync(password, 10);
    const newBusiness = new Business({
      name,
      email,
      businessCode,
      password: hashedPassword,
      address,
      tier,
      number,
    });
    await newBusiness.save();
    //OTP GENERATION AND VERIFICATION
    GenerateOTP(res, name, email, next);
  } catch (error) {
    next(error);
  }
};

const GenerateOTP = async (res, name, email, next) => {
  try {
    const otp = Math.floor(Math.random() * 999999 + 10000).toString();
    const hashOtp = bcryptjs.hashSync(otp, 10);
    const mailOptions = {
      from: process.env.AUTH_MAIL,
      to: email,
      subject: "Verify Your Email For Account Creation",
      html: `<p>Hello, <b>
        ${name}
        </b>
        <br/>
        Kindly Verify Your Email With This OTP :- ${otp}
        <br/>
        The OTP is valid only for 5 minutes
        </p>`,
    };
    const newOTP = new Verification({
      otp: hashOtp,
      createdAt: Date.now(),
      expiresAt: Date.now() + 300000,
    });
    await newOTP.save();
    transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, id: newOTP._id });
  } catch (error) {
    next(error);
  }
};

// VERIFY OTP
export const VerifyBusinessOTPController = async (req, res, next) => {
  try {
    const { id, otp, businessCode } = req.body;
    if (!otp || !id || !businessCode) {
      return next(errorHandler(400, "All Fields Are Required"));
    }
    const existOTP = await Verification.findOne({ _id: id });
    if (!existOTP) {
      return next(errorHandler(400, "OTP Not Found"));
    }
    const otpCorrect = await bcryptjs.compare(otp, existOTP.otp);

    if (!otpCorrect) {
      return next(errorHandler(400, "OTP is not correct"));
    }
    if (otpCorrect.expiresAt < Date.now()) {
      await Verification.deleteMany({ _id: id });
      return next(errorHandler(400, "OTP is Expired"));
    }
    await Verification.deleteMany({ _id: id });
    const business = await Business.findOneAndUpdate(
      { businessCode },
      { verified: true },
      { new: true }
    );
    res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
};

// BUSINESS SIGNIN
export const BusinessSignInController = async (req, res, next) => {
  try {
    const { code, password } = req.body;
    if (!code || !password) {
      return next(errorHandler(400, "All Fields Are Required"));
    }
    const user = await Business.findOne({ businessCode: code });
    if (!user) {
      return next(errorHandler(400, "User Not Found"));
    }
    const correctPassword = bcryptjs.compareSync(password, user.password);
    if (!correctPassword) {
      return next(errorHandler(400, "Password is not correct"));
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET); // Consider adding an expiration
    const { _id, name, email, isAdmin, isBusiness } = user.toObject();
    const userData = { _id, name, email, isAdmin, isBusiness };
    res
      .status(200)
      .cookie("auth_token", token, {
        httpOnly: true,
        sameSite: "Strict",
      })
      .json({ success: true, userData });
  } catch (error) {
    next(error);
  }
};

//! VIEW USERS BUSINESS
export const BusinessViewUsersController = async (req, res, next) => {
  try {
    const { businessID } = req.body;
    const data = await User.find({ createdBy: businessID }).select(
      "_id username email name"
    );
    if (!data) {
      return next(errorHandler(400, "No Data Found"));
    }
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const BusinessUserSearchController = async (req, res, next) => {
  try {
  } catch (error) {
    return next(error);
  }
};
