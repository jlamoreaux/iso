// import and initialize express app
import express, { ErrorRequestHandler, NextFunction, Request, Response } from "express";
// import requestId from "express-request-id";
import session from "express-session";
import cors from "cors";
import mongoose from "mongoose";
import { apiRouter, authRouter } from "./routes";
import passport from "passport";
import { config } from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

config();

const inProd = process.env.NODE_ENV === "production";
const port = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(cors({ credentials: true, origin: "http://localhost:5173" }));
app.use(express.static(path.join(__dirname, "public")));
app.use(passport.initialize());
app.use(
  session({
    secret: process.env.SESSION_SECRET as string,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      sameSite: inProd ? "none" : "lax",
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    },
  }),
);
app.use(passport.session());
// app.use(requestId());
app.use(express.json());

// routes
app.use("/api", apiRouter);
app.use("/auth", authRouter);

// connect to mongodb
mongoose
  .set("strictQuery", true)
  .connect(process.env.MONGODB_URI as string)
  .then(() => {
    console.log("MongoDB Connected");
    app.listen(port, () => {
      console.log(`Server started on port ${port}`);
    });
  })
  .catch((err) => console.log(err));
