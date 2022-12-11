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
/**
 * @description - gets a photographer with the given id
 * @param {Request} req - request object
 * @param {Response} res - response object
 * @returns {Promise<void>}RE
 */
export const getPhotographerById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const loggerMetadata = {
        function: "getPhotographerById",
        photographerId: id,
    };
    logger.info("Getting photographer by id", loggerMetadata);
    let photographer;
    try {
        photographer = yield DALPhotographer.findById(id);
    }
    catch (error) {
        logger.info("Photographer not found", loggerMetadata);
        return res.status(404).json({ message: "Photographer not found" });
    }
    return res.status(200).json(photographer);
});
export const getPhotographersByRegion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const region = req.params.region;
    const loggerMetadata = {
        function: "getPhotographersByRegion",
        region,
    };
    logger.info("Getting photographers by region", loggerMetadata);
    let photographers;
    try {
        photographers = yield DALPhotographer.findByRegion(region);
    }
    catch (error) {
        logger.info("Photographers not found", loggerMetadata);
        return res.status(404).json({ message: "Photographers not found" });
    }
    return res.status(200).json(photographers);
});
export const getPhotographersByRegionAndAvailability = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const region = req.params.region;
    const date = new Date(req.params.date);
    const loggerMetatada = {
        function: "getPhotographersByRegionAndAvailability",
        region,
        date,
    };
    logger.info("Getting photographers by region and availability", loggerMetatada);
    let photographers;
    try {
        photographers = yield DALPhotographer.findByRegionAndAvailability(region, date);
    }
    catch (error) {
        logger.info("Photographers not found", loggerMetatada);
        return res.status(404).json({ message: "Photographers not found" });
    }
    return res.status(200).json(photographers);
});
/**
 * @description - updates a photographer with the given id
 * @param {Request} req - request object
 * @param {Response} res - response object
 * @returns {Promise<void>}
 */
export const updatePhotographerById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const photographer = req.body;
    const loggerMetadata = {
        function: "updatePhotographerById",
        photographerId: id,
    };
    logger.info("Updating photographer by id", loggerMetadata);
    let updatedPhotographer;
    try {
        updatedPhotographer = yield DALPhotographer.update(id, photographer);
    }
    catch (error) {
        logger.info("Photographer not found", loggerMetadata);
        return res.status(404).json({ message: "Photographer not found" });
    }
    return res.status(200).json(updatedPhotographer);
});
