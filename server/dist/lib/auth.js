var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// Passport configuration
import passport from "passport";
import bcrypt from "bcrypt";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as FacebookStrategy } from "passport-facebook";
import DALPhotographer from "../data/photographer";
import { config } from "dotenv";
import logger from "../utils/logger";
// TODO: Figure out why this is needed
config();
export var AUTH_TYPE;
(function (AUTH_TYPE) {
    AUTH_TYPE["LOCAL"] = "local";
    AUTH_TYPE["GOOGLE"] = "google";
    AUTH_TYPE["FACEBOOK"] = "facebook";
})(AUTH_TYPE || (AUTH_TYPE = {}));
// Local strategy
passport.use(new LocalStrategy({
    usernameField: "email",
    passwordField: "password",
    passReqToCallback: false,
}, (email, password, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const photographer = yield DALPhotographer.findByEmail(email);
        if (!photographer) {
            return done(null, false);
        }
        const validate = yield photographer.isValidPassword(password);
        if (!validate) {
            return done(null, false);
        }
        return done(null, photographer, { message: "Logged in Successfully" });
    }
    catch (error) {
        return done(error);
    }
})));
// Google OAuth strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.API_URL}/auth/google/callback`,
}, (_, __, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const email = (profile.emails && profile.emails[0].value) || "";
    try {
        const existingUser = yield DALPhotographer.findByEmail(email);
        if (existingUser) {
            return done(null, existingUser);
        }
        let newUser = {
            email: email,
            authType: AUTH_TYPE.GOOGLE,
            firstName: ((_a = profile.name) === null || _a === void 0 ? void 0 : _a.givenName) || "",
            lastName: ((_b = profile.name) === null || _b === void 0 ? void 0 : _b.familyName) || "",
        };
        yield DALPhotographer.register(newUser, (err, user) => {
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
    }
    catch (error) {
        done(error, false, error.message);
    }
})));
// Facebook OAuth strategy
passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    callbackURL: `${process.env.API_URL}/auth/facebook/callback`,
    profileFields: ["id", "displayName", "photos", "email"],
}, (_, __, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
    var _c, _d;
    const email = (profile.emails && profile.emails[0].value) || "";
    try {
        const existingUser = yield DALPhotographer.findByEmail(email);
        if (existingUser) {
            return done(null, existingUser);
        }
        let newUser = {
            email: email,
            authType: AUTH_TYPE.FACEBOOK,
            firstName: ((_c = profile.name) === null || _c === void 0 ? void 0 : _c.givenName) || "",
            lastName: ((_d = profile.name) === null || _d === void 0 ? void 0 : _d.familyName) || "",
        };
        yield DALPhotographer.register(newUser, (err, user) => {
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
    }
    catch (error) {
        done(error, false, error.message);
    }
})));
passport.deserializeUser((id, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield DALPhotographer.findById(id);
        done(null, user);
    }
    catch (error) {
        done(error, false);
    }
}));
export const hashPassword = (password) => __awaiter(void 0, void 0, void 0, function* () {
    const salt = yield bcrypt.genSalt(10);
    return yield bcrypt.hash(password, salt);
});
export default passport;
