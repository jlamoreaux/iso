import { Router } from "express";
import passport from "passport";
import { PhotographerDocument } from "../models/Photographer";
import { register, login, logout } from "../controllers/auth";
import { catchErrors } from "../utils/catchErrors";

const authRouter = Router();

// Auth routes
authRouter.post("/register", catchErrors(register), (req, res) =>
  req.login(req.body, (err) => {
    const user = req.user as PhotographerDocument;
    if (err) {
      return res.status(500).json({ message: "Error logging in" });
    }
    res.status(200).json({ userId: user?.id });
  }),
);
authRouter.post(
  "/login",
  passport.authenticate("local", {
    failureMessage: "Invalid credentials",
    successMessage: "Logged in user",
  }),
  catchErrors(login),
);
authRouter.post("/logout", catchErrors(logout));

export default authRouter;
