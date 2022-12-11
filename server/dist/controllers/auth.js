var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import DALPhotographer from "../data/photographer";
import logger from "../utils/logger";
import passport, { AUTH_TYPE, hashPassword } from "../lib/auth";
// login a photographer using passport library
export const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const loggerMetadata = {
        function: "login",
    };
    logger.info("Logging in photographer", loggerMetadata);
    return passport.authenticate("local", (err, user) => {
        if (err) {
            logger.warn("Error when logging in", loggerMetadata);
            return res.status(500).json({ message: "Error when logging in" });
        }
        if (!user) {
            logger.info("Photographer not found", loggerMetadata);
            return res.status(404).json({ message: "Photographer not found" });
        }
        req.logIn(user, (err) => {
            if (err) {
                logger.warn("Error when logging in", loggerMetadata);
                return res.status(500).json({ message: "Error when logging in" });
            }
            logger.info("Photographer logged in", loggerMetadata);
            return res.status(200).json({ message: "Photographer successfully logged in" });
        });
        return res.status(200).json({ message: "Photographer logged in" });
    })(req, res);
});
// registers a photographer
export const register = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.body.email || !req.body.password) {
        return res.status(400).json({ message: "Email and password are required" });
    }
    const loggerMetadata = {
        function: "register",
    };
    logger.info("Registering photographer", loggerMetadata);
    const { email } = req.body;
    try {
        const photographer = yield DALPhotographer.findByEmail(email);
        if (photographer) {
            logger.info("Photographer already exists", loggerMetadata);
            return res.status(400).json({ message: "Photographer already exists" });
        }
        const newPhotographerData = req.body;
        newPhotographerData.authType = AUTH_TYPE.LOCAL;
        newPhotographerData.password = yield hashPassword(newPhotographerData.password);
        yield DALPhotographer.register(newPhotographerData, (err, photographer) => __awaiter(void 0, void 0, void 0, function* () {
            if (err) {
                logger.warn("Error when registering photographer", Object.assign(Object.assign({}, loggerMetadata), { error: "Photographer not created" }));
                return res.status(500).json({ message: "Error when registering photographer" });
            }
            logger.info("Photographer registered", loggerMetadata);
            const newPhotographer = yield DALPhotographer.findByEmail(email);
            passport.authenticate("local")(req, res, () => {
                res.redirect(`/photographer/${newPhotographer === null || newPhotographer === void 0 ? void 0 : newPhotographer.id}`);
            });
        }));
    }
    catch (error) {
        logger.warn("Error when registering photographer", Object.assign(Object.assign({}, loggerMetadata), { error }));
        return res.status(500).json({ message: "Error when registering photographer" });
    }
});
