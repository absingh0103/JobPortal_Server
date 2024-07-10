import express from "express";
import { dbConnection } from "./database/dbConnection.js";
import jobRouter from "./routes/jobRoutes.js";
import userRouter from "./routes/userRoutes.js";
import applicationRouter from "./routes/applicationRoutes.js";
import { config } from "dotenv";
// to share Resource to different origin (Cross Origin Resource Sharing)
import cors from "cors";
import { errorMiddleware } from "./middlewares/error.js";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";

const app = express();
config({ path: "./config/config.env" });

app.use(
  cors({
    // Here we Can provide Multiple Origin Or Frontend Url that Can Communicate And Share Resource with Backend
    // origin: [process.env.FRONTEND_URL],
    // Allowed Methods
    method: ["GET", "POST", "DELETE", "PUT"],
    // Send The Credentials With Reesponse 
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// can be done with Muter
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);
// ! here we Use Routes Like This To make it standard so that in feture if we updated something we can change v1 to v2
app.use("/api/v1/user", userRouter);
app.use("/api/v1/job", jobRouter);
app.use("/api/v1/application", applicationRouter);

dbConnection();

// Here we Use Error Middleware In last So that It will Gets Exextued In Last
app.use(errorMiddleware);
export default app;
