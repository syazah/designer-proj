import errorHandler from "../utils/errorHandler.js";
import { User } from "../models/User.js";
import { Business } from "../models/Business.js";
import { Admin } from "../models/Admin.js";
import { Panel } from "../models/Panel.js";
import { Collection } from "../models/Collection.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

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
      user = await Business.findOne({ _id: id }).select("-password");
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
    const collection = await Collection.findOne({ _id: id }).populate({
      path: "panels",
    });
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
    const panel = new Panel({
      parentCollection: collectionId,
      panelName,
      panelType,
      author: id,
    });
    await panel.save();

    await Collection.findOneAndUpdate(
      { _id: collectionId },
      { $push: { panels: panel._id } }
    );
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
    const { id, parentId } = req.body;
    if (!id) {
      return next(errorHandler(400, "No Id Found"));
    }
    await User.findOneAndUpdate(
      { _id: parentId },
      { $pull: { panelsCreated: id } }
    );
    await Panel.findByIdAndDelete(id);
    res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
};
