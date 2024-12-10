import { Admin } from "../models/Admin.js";
import errorHandler from "../utils/errorHandler.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { User } from "../models/User.js";
import { Verification } from "../models/Verification.js";
import { Collection } from "../models/Collection.js";
import validator from "validator";
import PasswordValidator from "password-validator";
import nodemailer from "nodemailer";
import { Panel } from "../models/Panel.js";
import { Business } from "../models/Business.js";
import { NormalPanel } from "../models/NormalPanel.js";
import {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytesResumable,
} from "firebase/storage";
import { Order } from "../models/Order.js";
dotenv.config();

const canCreate = [100, 10, 25];

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
// USER SIGN UP
export const UserSignUpController = async (req, res, next) => {
  try {
    const {
      name,
      username,
      email,
      number,
      password,
      country,
      city,
      parentId,
      userType,
    } = req.body;
    if (
      !username ||
      !email ||
      !number ||
      !password ||
      !country ||
      !city ||
      !parentId ||
      !userType
    ) {
      return next(errorHandler(400, "All Fields Are Required"));
    }
    const existUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existUser) {
      return next(errorHandler(400, "User with same email or password exists"));
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
    const hashedPassword = bcryptjs.hashSync(password, 10);
    const createdByModel = userType === 8 ? "Business" : "Admin";
    if (userType === 8) {
      const business = await Business.findOne({ _id: parentId });

      if (business.clientsCreated.length >= canCreate[business.tier - 1]) {
        return next(
          errorHandler(400, "You've reached your client creation limit")
        );
      }
    }
    const newUser = new User({
      username,
      email,
      name,
      number,
      country,
      city,
      password: hashedPassword,
      createdBy: parentId,
      createdByModel,
    });
    await newUser.save();
    if (userType === 8) {
      await Business.findOneAndUpdate(
        { _id: parentId },
        { $push: { clientsCreated: newUser._id } }
      );
    } else {
      await Admin.findOneAndUpdate(
        { _id: parentId },
        { $push: { createdUsers: newUser._id } }
      );
    }
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

export const VerifyUserOTPController = async (req, res, next) => {
  try {
    const { id, otp, username } = req.body;
    if (!otp || !id || !username) {
      return next(errorHandler(400, "All Fields Are Required"));
    }
    const existOTP = await Verification.findOne({ _id: id });
    if (!existOTP) {
      return next(errorHandler(400, "OTP Not Found"));
    }
    const otpCorrect = await bcryptjs.compare(otp, existOTP.otp);

    if (!otpCorrect || otpCorrect.expiresAt < Date.now()) {
      return next(errorHandler(400, "OTP is not correct"));
    }
    await Verification.deleteMany({ _id: id });
    const user = await User.findOneAndUpdate(
      { username },
      { verified: true },
      { new: true }
    );
    res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
};

// USER SIGN IN
export const UserSignInController = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    // BASIC VALIDATIONS
    if (!username || !password) {
      return next(errorHandler(400, "All fields are required"));
    }

    const user =
      (await Admin.findOne({
        $or: [{ username }, { email: username }],
      })) ||
      (await User.findOne({
        $or: [{ username }, { email: username }],
      }));
    if (!user) {
      return next(errorHandler(400, "User not found"));
    }
    // Check password
    const isPasswordCorrect = bcryptjs.compareSync(password, user.password);
    if (!isPasswordCorrect) {
      return next(errorHandler(400, "Password is not correct"));
    }

    // FINAL STEPS
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

// CREATE COLLECTION
export const CreateCollectionController = async (req, res, next) => {
  try {
    const { _id, name, description } = req.body;
    if (!_id || !name) {
      return next(errorHandler(400, "All Fields Are Required"));
    }

    const newCollection = new Collection({
      name,
      description,
      author: _id,
    });
    await newCollection.save();
    await User.findOneAndUpdate(
      { _id },
      { $push: { collectionsCreated: newCollection._id } }
    );
    res.status(200).json({ success: true, collectionId: newCollection._id });
  } catch (error) {
    next(errorHandler(500, "Internal Server Error"));
  }
};

//DELETE COLLECTION CONTROLLER
export const DeleteCollectionController = async (req, res, next) => {
  try {
    const { id, parentId } = req.body;
    if (!id) {
      return next(errorHandler(400, "Collection Not Found"));
    }
    const panelIdsToDelete = await Panel.find({ parentCollection: id }).select(
      "_id"
    );
    const panelDeleted = await Panel.deleteMany({
      _id: { $in: panelIdsToDelete },
    });
    await User.updateOne(
      { _id: parentId },
      { $pull: { panelsCreated: { $in: panelIdsToDelete } } }
    );
    if (panelDeleted) {
      await Collection.findOneAndDelete({ _id: id });
    }
    res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
};

//UPDATE COLLECTION CONTROLLER
export const UpdatePanelDataController = async (req, res, next) => {
  try {
    const { panelSpecs, id } = req.body;
    await Panel.findOneAndUpdate({ _id: id }, { panelData: panelSpecs });
    res.status(200).json({ success: true, panelSpecs });
  } catch (error) {
    next(error);
  }
};

//GET NORMAL PANEL
export const GetNormalPanelController = async (req, res, next) => {
  try {
    const panels = await NormalPanel.find({});
    res.status(200).json({ success: true, panels });
  } catch (error) {
    next(error);
  }
};

// GET SINGLE NORMAL PANEL
export const GetSingleNormalPanel = async (req, res, next) => {
  try {
    const { userID, panelID } = req.body;
    if (!userID || !panelID)
      return next(errorHandler(400, "Something Went Wrong"));

    const collections = await User.findOne({ _id: userID })
      .select("collectionsCreated")
      .populate({ path: "collectionsCreated", populate: { path: "panels" } });
    const panel = await NormalPanel.findOne({ _id: panelID });
    if (!collections || !panel)
      return next(errorHandler(400, "Something Went Wrong, Try Again Later"));

    res.status(200).json({ success: true, collections, panel });
  } catch (error) {
    next(error);
  }
};

// ADD NORMAL PANEL COLLECTION
export const AddNormalPanelCollection = async (req, res, next) => {
  try {
    const { collectionId, panelGlass, panelFrame, panelWall, panelId } =
      req.body;
    if (!collectionId) {
      return next(errorHandler(400, "No Collection ID Found"));
    }
    const collection = await Collection.findOne({ _id: collectionId });
    if (!collection) return next(errorHandler(400, "Collection Not Present"));
    const panelPresent = collection.normalPanels.filter((item) =>
      item.panelID.equals(panelId)
    );
    if (panelPresent.length > 0)
      return next(errorHandler(400, "Panel Already Present"));
    await Collection.findOneAndUpdate(
      { _id: collectionId },
      {
        $push: {
          normalPanels: {
            panelID: panelId,
            panelFrame,
            panelGlass,
            panelWall,
          },
        },
      }
    );

    res.status(200).json({ success: true });
  } catch (error) {
    return next(error);
  }
};

// HANDLE RAISE ORDER
export const UploadOrderController = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      return next(
        erroraHandler(
          400,
          "Something went wrong while fetching the id for the file"
        )
      );
    }
    const firebaseStorage = getStorage();
    const storageRef = ref(
      firebaseStorage,
      `OrderPdfs/${id}/${req.file.originalname}`
    );
    const metadata = { contentType: req.file.mimetype };
    if (!req.file.buffer) {
      return next(errorHandler(400, "No data found in pdf"));
    }
    const snapshot = await uploadBytesResumable(
      storageRef,
      req.file.buffer,
      metadata
    );
    const downloadURL = await getDownloadURL(snapshot.ref);
    return res.status(200).json({ success: true, downloadURL });
  } catch (error) {
    return next(error);
  }
};
export const HandleRaiseOrderController = async (req, res, next) => {
  try {
    const { panels, userID, pdfLink } = req.body;
    if (!panels || panels.length === 0 || !userID) {
      return next(errorHandler(400, "Data Is Needed to raise order"));
    }
    if (!pdfLink) {
      return next(errorHandler(400, "Pdf not found in the request"));
    }
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let referenceNumber = "";

    for (let i = 0; i < 8; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      referenceNumber += chars[randomIndex];
    }
    const orderData = new Order({
      raisedBy: userID,
      panelData: panels,
      referenceNumber,
      currentStage: "Admin",
      pdfLink,
    });
    await orderData.save();
    const user = await User.findOneAndUpdate(
      { _id: userID },
      { $addToSet: { ordersRaised: orderData._id } },
      { new: true }
    );
    const mailOptions = {
      from: process.env.AUTH_MAIL,
      to: [
        "fttinnovationsproduction@gmail.com",
        "sanchit.sehgal@alisan.co.in",
        "alisanpartner@gmail.com",
        "thesyazah@gmail.com",
      ],
      subject: `Order Raised - ${referenceNumber}`,
      html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2 style="color: #333;">Order Confirmation</h2>
        <p>Hello,</p>
        <p>A new order has been raised by user with ID: <strong>${userID}</strong>. username: <strong>${user?.username}</strong> Email: <strong>${user?.email}</strong></p>
        <p>You can download the order details as a PDF using the link below:</p>
        <p>
          <a
            href="${pdfLink}"
            style="color: #0066cc; text-decoration: none;"
          >
            Download Order PDF
          </a>
        </p>
        <p>Thank you for your order!</p>
        <p>Best regards,<br>Your Company Team</p>
      </div>
    `,
    };
    transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, referenceNumber });
  } catch (error) {
    return next(error);
  }
};

export const GetOrderHistoryController = async (req, res, next) => {
  try {
    const { userID } = req.body;
    if (!userID) return next(errorHandler(400, "User Not Found"));
    const user = await User.findOne({ _id: userID }).populate({
      path: "ordersRaised",
    });
    if (!user)
      return next(
        errorHandler(400, "Something went wrong, Could Not Find User data")
      );
    res.status(200).json({ success: true, data: user.ordersRaised });
  } catch (error) {
    return next(error);
  }
};
