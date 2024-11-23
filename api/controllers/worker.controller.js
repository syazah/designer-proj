import bcryptjs from "bcryptjs";
import { Worker } from "../models/Worker.js";
import jwt from "jsonwebtoken";
import { Order } from "../models/Order.js";
import {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytesResumable,
} from "firebase/storage";

//SIGNIN
export const WorkerSignInController = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(errorHandler(400, "Proper credentials not provided"));
    }
    const worker = await Worker.findOne({ email });
    if (!worker) {
      return next(errorHandler(400, "Worker with this email not found"));
    }
    const correctPassword = bcryptjs.compareSync(password, worker.password);
    if (!correctPassword) {
      return next(errorHandler(400, "Password is not correct"));
    }
    const token = jwt.sign({ id: worker._id }, process.env.JWT_SECRET);
    res.status(200).json({ success: true, token, type: 3 });
  } catch (error) {
    return next(error);
  }
};

//GET WORKER DETAILS
export const GetWorkerDetailsController = async (req, res, next) => {
  try {
    const { token } = req.body;
    if (!token) {
      return next(errorHandler(400, "Worker Token Not Found"));
    }
    const { id } = await jwt.verify(token, process.env.JWT_SECRET);
    if (!id) {
      return next(
        errorHandler(
          400,
          "Something went wrong while getting correct id of worker"
        )
      );
    }
    const man = await Worker.findOne({ _id: id }).select("name username email");
    const orders = await Order.find({
      $and: [{ worker: id }, { detailedStage: { $ne: "completed" } }],
    }).sort({
      updatedAt: -1,
    });
    if (!man) {
      return next(errorHandler(400, "No Manufacturer found"));
    }
    res.status(200).json({ success: true, worker: man, orders });
  } catch (error) {
    return next(error);
  }
};

//MARK ORDER COMPLETE
export const AddImageMarkOrderCompleteController = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id) {
      return next(
        erroraHandler(
          400,
          "Something went wrong while fetching the order id for the file"
        )
      );
    }
    const firebaseStorage = getStorage();
    const storageRef = ref(
      firebaseStorage,
      `CompletedOrders/${id}/${req.file.originalname}`
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
export const MarkOrderCompleteController = async (req, res, next) => {
  try {
    const { downloadURL, orderID } = req.body;
    if (!downloadURL || !orderID) {
      return next(errorHandler(400, "Required fields not provided"));
    }
    await Order.findOneAndUpdate(
      { _id: orderID },
      {
        orderCompletedImage: downloadURL,
        detailedStage: "completed",
        currentStage: "Admin",
      }
    );
    return res.status(200).json({ success: true });
  } catch (error) {
    return next(error);
  }
};
