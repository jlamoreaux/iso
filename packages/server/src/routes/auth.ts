import { Router } from "express";
import passport from "passport";
import { register, login, logout, authTest } from "../controllers/auth";
import { catchErrors } from "../utils/catchErrors";

const authRouter = Router();

// Auth routes
authRouter.post("/register", catchErrors(register), catchErrors(login));
authRouter.post(
  "/login",
  passport.authenticate("local", {
    failureMessage: "Invalid credentials",
    successMessage: "Logged in user",
  }),
  catchErrors(login),
);
authRouter.post("/logout", catchErrors(logout));
authRouter.get("/authtest", catchErrors(authTest));

export default authRouter;
