import errorHandler from "../utils/errorHandler.js";
import { User } from "../models/User.js";
import { Verification } from "../models/Verification.js";
import { Business } from "../models/Business.js";
import { Admin } from "../models/Admin.js";
import { Panel } from "../models/Panel.js";
import { Collection } from "../models/Collection.js";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bcryptjs from "bcryptjs";
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

// GET USER
export const GetUserGeneral = async (req, res, next) => {
  try {
    const { userType } = req.body;
    const currentUserType = userType.toString();
    const { auth_token } = req.cookies;
    const { id } = await jwt.verify(auth_token, process.env.JWT_SECRET);
    let user;
    if (currentUserType === "6") {
      user = await User.findOne({ _id: id })
        .populate({ path: "collectionsCreated" })
        .select("-password");
    } else if (currentUserType === "5") {
      user = await Admin.findOne({ _id: id }).select("-password");
    } else {
      user = await Business.findOne({ _id: id })
        .select("-password")
        .populate({ path: "collectionsCreated" })
        .select("-password");
    }
    res.status(200).json({ success: true, user });
  } catch (error) {
    next(errorHandler(500, "Internal Server Error"));
  }
};

// GET COLLECTION
export const GetCollectionController = async (req, res, next) => {
  try {
    const { id } = req.body;
    if (!id) {
      return next(errorHandler(400, "Some Unexpected Error"));
    }
    const collection = await Collection.findOne({ _id: id })
      .populate({
        path: "panels",
      })
      .populate({ path: "normalPanels.panelID" });
    res.status(200).json({ success: true, collection });
  } catch (error) {
    return next(error);
  }
};

//CREATE PANEL DETAIL
export const CreatePanelDetailController = async (req, res, next) => {
  try {
    const { panelName, panelType, collectionId } = req.body;
    const { auth_token } = req.cookies;
    const { id } = await jwt.verify(auth_token, process.env.JWT_SECRET);
    if (!panelName || !panelType || !collectionId) {
      return next(errorHandler(400, "All Fields Are Required"));
    }
    if (!id) {
      return next(errorHandler(400, "Something Went Wrong"));
    }
    const collection = await Collection.findOne({ _id: collectionId });
    if (!collection) {
      return next(errorHandler(400, "Collection Not Found"));
    }
    const panelVariant = {
      panelSize: 2,
      panelVariant: [],
      bigPanelVariant: [[], []],
      panelIcons: {},
      panelGlass: "#000",
      panelFrame: "#ddd",
      panelWall: "",
      droppableType: 1,
      droppableColor: "#17c5e2",
      savedSpaceLeft: 12,
      savedUpSpace: 6,
      fanIcon: {
        id: "FN01",
        src: "/ICONS/fans/fan1.png",
      },
      dimmerIcon: { id: "AB04", src: "/ICONS/alphabets/alphabet-d.png" },
      extensionTypeOne: "",
      extensionTypeTwo: "",
    };
    const panel = new Panel({
      parentCollection: collectionId,
      panelName,
      panelType,
      author: id,
      panelData: panelVariant,
    });
    await Collection.findOneAndUpdate(
      { _id: collectionId },
      { $push: { panels: panel._id } }
    );
    await panel.save();

    await User.findOneAndUpdate(
      { _id: id },
      { $push: { panelsCreated: panel._id } }
    );

    res.status(200).json({ success: true, panelId: panel._id });
  } catch (error) {
    return next(error);
  }
};

// GET PANEL CONTROLLER
export const GetPanelDetailController = async (req, res, next) => {
  try {
    const { id } = req.body;
    if (!id) {
      return next(errorHandler(400, "Some Error Occured From Our Side"));
    }
    const panel = await Panel.findOne({ _id: id });
    if (!panel) {
      return next(errorHandler(400, "Panel Not Found"));
    }

    res.status(200).json({ success: true, panel });
  } catch (error) {
    return next(error);
  }
};

// SIGN OUT

export const SignOutController = async (req, res, next) => {
  try {
    res.clearCookie("auth_token");
    res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
};

//DELETE PANEL CONTROLLER
export const DeletePanelController = async (req, res, next) => {
  try {
    const { id, parentId, collectionID } = req.body;
    if (!id || !parentId || !collectionID) {
      return next(errorHandler(400, "No Id Found"));
    }
    await User.findOneAndUpdate(
      { _id: parentId },
      { $pull: { panelsCreated: id } }
    );
    await Collection.findOneAndUpdate(
      { _id: collectionID },
      { $pull: { panels: id } }
    );
    await Panel.findByIdAndDelete(id);
    res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
};

//GET OTP FOR FORGOT PASSWORD
export const HandleGetOTPForgotPassword = async (req, res, next) => {
  try {
    const { email, type } = req.body;
    if (!email) {
      return next(errorHandler(400, "No Email Found"));
    }
    let user;
    if (type === "client") {
      user =
        (await Admin.findOne({ email })) || (await User.findOne({ email }));
    } else {
      user = await Business.findOne({ email });
    }
    await Business.findOne({ email });
    if (!user) {
      return next(errorHandler(400, "User not found"));
    }
    await Verification.deleteMany({ otpFor: email });
    const otp = Math.floor(Math.random() * 999999 + 10000).toString();
    const hashedOTP = bcryptjs.hashSync(otp, 10);
    const verify = new Verification({
      otp: hashedOTP,
      createdAt: Date.now(),
      expiresAt: Date.now() + 300000,
      otpFor: email,
    });
    await verify.save();
    const mailOptions = {
      from: process.env.AUTH_MAIL,
      to: email,
      subject: "Verify Your Email For Account Creation",
      html: `<p>Hello, User
        <br/>
        We Had A request to change your password
        <br/>
        Kindly Verify Your Email With This OTP :- ${otp}
        <br/>
        The OTP is valid only for 5 minutes
        </p>`,
    };
    transporter.sendMail(mailOptions);
    res.status(200).json({ success: true });
  } catch (error) {
    return next(error);
  }
};

//VERIFY PASSWORD
export const HandleVerifyOTP = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return next(errorHandler(400, "Fields Not Provided Correctly"));
    }
    const verification = await Verification.findOne({ otpFor: email });
    if (!verification) {
      return next(errorHandler(400, "No OTP found for this mail"));
    }
    if (verification.expiresAt < Date.now()) {
      return next(errorHandler(400, "OTP expired"));
    }
    const validOTP = await bcryptjs.compareSync(otp, verification.otp);
    if (!validOTP) {
      return next(errorHandler(400, "OTP entered is incorrect"));
    }
    await Verification.deleteMany({ otpFor: email });
    return res.status(200).json({ success: true });
  } catch (error) {
    return next(error);
  }
};

//RESET PASSWORD
export const HandleResetPassword = async (req, res, next) => {
  const { email, password, type } = req.body;
  if (!email || !password) {
    return next(errorHandler(400, "Fields Provided are not correct"));
  }
  const hashedPassword = bcryptjs.hashSync(password, 10);
  if (type === "client") {
    const isAdmin = await Admin.findOne({ email });
    if (isAdmin) {
      await Admin.findOneAndUpdate({ email }, { password: hashedPassword });
    } else {
      await User.findOneAndUpdate({ email }, { password: hashedPassword });
    }
  } else {
    await Business.findOneAndUpdate({ email }, { password: hashedPassword });
  }
  return res.status(200).json({ success: true });
};
