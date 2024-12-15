import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

const app = express();
dotenv.config({
  path: "./.env",
});

const corsOptions = {
  origin: `${process.env.FRONTEND_URL}`,
  credentials: true,
};

const PORT = process.env.PORT;

app.use(express.json());
app.use(cors(corsOptions));
app.use(cookieParser());
connectDB();
// routes
import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import connectionRouter from "./routes/connection.routes.js";
import notificationRouter from "./routes/notification.routes.js";
import matchRouter from "./routes/match.routes.js";
import connectDB from "./lib/db.js";

app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/connection", connectionRouter);
app.use("/api/notifications", notificationRouter);
app.use("/api/match", matchRouter);

app.listen(PORT, () => {
  console.log("Server Listening on PORT " + PORT);
});