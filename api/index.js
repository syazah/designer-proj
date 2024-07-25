import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import adminRouter from "./routes/admin.routes.js";
import userRouter from "./routes/user.routes.js";
import businessRouter from "./routes/business.routes.js";
import generalRouter from "./routes/general.routes.js";
dotenv.config();
const app = express();

//INITIAL CONFIGURATIONS
app.use(express.json());
app.use(cookieParser());

//ROUTES
app.use("/api/v1/general/", generalRouter);
app.use("/api/v1/admin/", adminRouter);
app.use("/api/v1/user/", userRouter);
app.use("/api/v1/business/", businessRouter);
// ERROR HANDLING
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(statusCode).json({ success: false, statusCode, message });
});
//SERVER
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`Server Is Listening On PORT ${process.env.PORT}`);
    });
  })
  .catch((err) => console.log(err));
