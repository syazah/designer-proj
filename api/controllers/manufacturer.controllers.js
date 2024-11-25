import { Manufacturer } from "../models/Manufacturer.js";
import { Order } from "../models/Order.js";
import { Worker } from "../models/Worker.js";
import errorHandler from "../utils/errorHandler.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
// SIGN IN  MANUFACTURER
export const ManufacturerSignInController = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(errorHandler(400, "Proper credentials not provided"));
    }
    const manufact = await Manufacturer.findOne({ email });
    if (!manufact) {
      return next(errorHandler(400, "Manufacturer with this email not found"));
    }
    const correctPassword = bcryptjs.compareSync(password, manufact.password);
    if (!correctPassword) {
      return next(errorHandler(400, "Password is not correct"));
    }
    const token = jwt.sign({ id: manufact._id }, process.env.JWT_SECRET);
    res.status(200).json({ success: true, token, type: 3 });
  } catch (error) {
    return next(error);
  }
};

// GET MANUFACTURER DETAIL
export const ManufacturerDetailsController = async (req, res, next) => {
  try {
    const { token } = req.body;
    if (!token) {
      return next(errorHandler(400, "Manufacturer Token Not Found"));
    }
    const { id } = await jwt.verify(token, process.env.JWT_SECRET);
    if (!id) {
      return next(
        errorHandler(
          400,
          "Something went wrong while getting correct id of manufacturer"
        )
      );
    }
    const man = await Manufacturer.findOne({ _id: id }).select(
      "name username email"
    );
    const orders = await Order.find({ currentStage: "Manufacturer" }).sort({
      updatedAt: -1,
    });
    if (!man) {
      return next(errorHandler(400, "No Manufacturer found"));
    }
    res.status(200).json({ success: true, manufacturer: man, orders });
  } catch (error) {
    return next(error);
  }
};

//ADD WORKER
export const AddWorkerController = async (req, res, next) => {
  try {
    const { token, name, phone, email, password } = req.body;

    if (!name || !phone || !email || !password || !token) {
      return next(errorHandler(400, "Required Field Not Provided"));
    }
    const existWorker = await Worker.findOne({ $or: [{ phone }, { email }] });
    if (existWorker) {
      return next(errorHandler(400, "A worker with this phone already exists"));
    }
    const { id } = await jwt.verify(token, process.env.JWT_SECRET);
    const hashedPassword = bcryptjs.hashSync(password, 10);
    const worker = new Worker({
      name,
      phone,
      password: hashedPassword,
      email,
      createdBy: id,
    });
    await worker.save();
    return res.status(200).json({ success: true });
  } catch (error) {
    return next(error);
  }
};

//GET WORKERS
export const GetWorkerController = async (req, res, next) => {
  try {
    const workers = await Worker.find({}).populate({ path: "orders" });
    if (!workers) {
      return next(
        errorHandler(400, "Something went wrong while getting worker data")
      );
    }
    return res.status(200).json({ success: true, workers });
  } catch (error) {
    return next(error);
  }
};
//ASSIGN WORKERS
export const AssignWorkerController = async (req, res, next) => {
  try {
    const { workerId, orderID } = req.body;
    if (!workerId || !orderID) {
      return next(errorHandler(400, "No id found for the worker"));
    }

    const worker = await Worker.findOneAndUpdate(
      {
        _id: workerId,
      },
      { $addToSet: { orders: orderID } }
    );
    const order = await Order.findOneAndUpdate(
      {
        _id: orderID,
      },
      { $addToSet: { worker: workerId } }
    );
    if (!worker || !order) {
      return next(
        errorHandler(400, "Something went wrong while updating worker")
      );
    }
    return res.status(200).json({ success: true });
  } catch (error) {
    return next(error);
  }
};

//WORKER DETAIL
export const GetWorkerDetailController = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      return next(errorHandler(400, "Id not found"));
    }
    const worker = await Worker.findOne({ _id: id }).populate({
      path: "orders",
    });
    if (!worker) {
      return next(errorHandler(400, "worker not found"));
    }
    return res.status(200).json({ success: true, worker });
  } catch (error) {
    return next(error);
  }
};

//DELETE WORKER CONTROLLER
export const DeleteWorkerController = async (req, res, next) => {
  try {
    const { id } = req.body;

    if (!id) {
      return next(errorHandler(400, "Required Fields Are Not Provided"));
    }

    const worker = await Worker.findOne({ _id: id }).populate(
      "orders createdBy"
    );

    if (!worker) {
      return next(errorHandler(404, "Worker not found"));
    }

    const { orders, createdBy } = worker;

    for (const order of orders) {
      await Order.findOneAndUpdate(
        { _id: order._id },
        {
          currentStage: "Manufacturer",
          assignedTo: createdBy._id,
          detailedStage: null,
        }
      );
    }

    await Worker.findByIdAndDelete(id);

    res
      .status(200)
      .json({ success: true, message: "Worker deleted successfully" });
  } catch (error) {
    return next(error);
  }
};
