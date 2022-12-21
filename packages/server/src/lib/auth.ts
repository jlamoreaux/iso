// Passport configuration
import passport from "passport";
import bcrypt from "bcrypt";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as FacebookStrategy } from "passport-facebook";
import DALPhotographer from "../data/photographer";
import { IPhotographer } from "../models/Photographer";
import { config } from "dotenv";
import logger from "../utils/logger";

// TODO: Figure out why this is needed
config();

export enum AUTH_TYPE {
  LOCAL = "local",
  GOOGLE = "google",
  FACEBOOK = "facebook",
}

// Local strategy
passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: false,
    },
    async (email, password, done) => {
      try {
        const photographer = await DALPhotographer.findByEmailForAuthenticating(email);
        if (!photographer) {
          return done(null, false);
        }
        const validate = await photographer.isValidPassword(password);
        if (!validate) {
          return done(null, false);
        }
        return done(null, photographer, { message: "Logged in Successfully" });
      } catch (error) {
        return done(error);
      }
    },
  ),
);

// Google OAuth strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.API_URL}/auth/google/callback`,
    },
    async (_, __, profile, done) => {
      const email = ((profile.emails && profile.emails[0].value) as string) || "";
      try {
        const existingUser = await DALPhotographer.findByEmail(email);
        if (existingUser) {
          return done(null, existingUser);
        }
        let newUser: IPhotographer = {
          email: email,
          authType: AUTH_TYPE.GOOGLE,
          firstName: profile.name?.givenName || "",
          lastName: profile.name?.familyName || "",
        };
        await DALPhotographer.register(newUser, (err, user) => {
          if (err) {
            logger.error({
              message: "Error registering new user",
              authType: AUTH_TYPE.GOOGLE,
              error: err,
            });
            return done(err);
          }
          return done(null, user);
        });
        done(null, newUser);
      } catch (error: any) {
        done(error, false, error.message);
      }
    },
  ),
);

// Facebook OAuth strategy
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      callbackURL: `${process.env.API_URL}/auth/facebook/callback`,
      profileFields: ["id", "displayName", "photos", "email"],
    },
    async (_, __, profile, done) => {
      const email = (profile.emails && profile.emails[0].value) || "";
      try {
        const existingUser = await DALPhotographer.findByEmail(email);
        if (existingUser) {
          return done(null, existingUser);
        }
        let newUser: IPhotographer = {
          email: email,
          authType: AUTH_TYPE.FACEBOOK,
          firstName: profile.name?.givenName || "",
          lastName: profile.name?.familyName || "",
        };
        await DALPhotographer.register(newUser, (err, user) => {
          if (err) {
            logger.error({
              message: "Error registering new user",
              authType: AUTH_TYPE.FACEBOOK,
              error: err,
            });
            return done(err);
          }
          return done(null, user);
        });
        done(null, newUser);
      } catch (error: any) {
        done(error, false, error.message);
      }
    },
  ),
);

passport.serializeUser((user: any, done) => {
  done(null, {
    id: user.id,
    username: user.username,
    picture: user.picture,
  });
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await DALPhotographer.findById(id);
    done(null, user);
  } catch (error) {
    done(error, false);
  }
});

export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

export default passport;
