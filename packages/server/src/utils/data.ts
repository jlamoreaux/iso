import { Types } from "mongoose";

/**
 * @description - converts a MongoDB ObjectId to a string
 * @param objectId - the ObjectId to convert to a string
 * @returns {string} - the string representation of the ObjectId
 */
export const convertObjecIdToString = (objectId: Types.ObjectId) => {
  return objectId.toString();
};
