// import and initialize express app
import express from "express";
import requestId from "express-request-id";
import cors from "cors";
import mongoose from "mongoose";
import router from "./routes";
import passport from "passport";
import path from "path";
import { config } from "dotenv";

config();

const port = process.env.PORT || 3001;

const app = express();
app.use(requestId());
app.use(passport.initialize());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(router);

// connect to mongodb
mongoose
  .connect(process.env.MONGODB_URI as string)
  .then(() => {
    console.log("MongoDB Connected");
    app.listen(port, () => {
      console.log(`Server started on port ${port}`);
    });
  })
  .catch((err) => console.log(err));
