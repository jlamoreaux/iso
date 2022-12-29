import { Request, Response } from "express";
import {
  getPhotographerById,
  getPhotographersByRegion,
  getPhotographersByRegionAndAvailability,
  updatePhotographerById,
} from "./photographers";
import { PhotographerDocument } from "../models/Photographer";
import DALPhotographer from "../data/photographer";

// Mocking the photographer data access layer
jest.mock("../data/photographer");

describe("Photographers Controller", () => {
  let mockResponse: Response;

  const photographer = {
    id: 1,
    firstName: "John",
    lastName: "Doe",
    gear: "",
    regions: [{city: "City 1", state: "State 1"}, {city: "City 2", state: "State 2"}],
    profilePic: "./images/profilePic.jpg",
    isFavorite: false,
    bio: "I am a photographer with 10 years of experience",
    id: 1,
    city: "City 1",
    state: "State 1",
  };

  beforeEach(() => {
    // Creating a mock function for the response
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnValue({}),
    } as unknown as Response;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // Creating a mock function for the request
  const mockRequest = {
    params: {
      id: 1,
      region: "Region 1",
      date: new Date("2024-01-01"),
    },
    body: {},
  } as unknown as Request;

  describe("getPhotographerById", () => {
    it("should return a photographer by id", async () => {
      // Mocking the findById function of the photographer data access layer
      (DALPhotographer.findById as jest.Mock).mockResolvedValue(photographer);

      await getPhotographerById(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(photographer);

    });

    it("should return a 404 error if the photographer is not found", async () => {
      // Mocking the findById function of the photographer data access layer
      (DALPhotographer.findById as jest.Mock).mockResolvedValue(null);

      await getPhotographerById(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "Photographer not found",
      });
    });

    it("should return a 500 error if the findById function throws an error", async () => {
      // Mocking the findById function of the photographer data access layer
      (DALPhotographer.findById as jest.Mock).mockRejectedValue(
        new Error("An error occurred while getting photographer"),
      );

      await getPhotographerById(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "An error occurred while getting photographer",
      });
    });
  });

  describe("getPhotographersByRegion", () => {
    it("should return a list of photographers by region", async () => {
      // Mocking the findByRegion function of the photographer data access layer
      (DALPhotographer.findByRegion as jest.Mock).mockResolvedValue([photographer]);

      await getPhotographersByRegion(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith([photographer]);
    });

    it("should return a 200 and empty array if the photographers are not found", async () => {
      // Mocking the findByRegion function of the photographer data access layer
      (DALPhotographer.findByRegion as jest.Mock).mockResolvedValue([]);

      await getPhotographersByRegion(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith([]);
    });

    it("should return a 500 error if the findByRegion function throws an error", async () => {
      // Mocking the findByRegion function of the photographer data access layer
      (DALPhotographer.findByRegion as jest.Mock).mockRejectedValue(
        new Error("An error occurred while getting photographers"),
      );

      await getPhotographersByRegion(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "An error occurred while getting photographers",
      });
    });
  });

  describe("getPhotographersByRegionAndAvailability", () => {
    it("should return a list of photographers by region and availability", async () => {
      // Mocking the findByRegionAndAvailability function of the photographer data access layer
      (DALPhotographer.findByRegionAndAvailability as jest.Mock).mockResolvedValue([photographer]);

      await getPhotographersByRegionAndAvailability(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith([photographer]);
    });

    it("should return a 200 and empty array if the photographers are not found", async () => {
      // Mocking the findByRegionAndAvailability function of the photographer data access layer
      (DALPhotographer.findByRegionAndAvailability as jest.Mock).mockResolvedValue([]);

      await getPhotographersByRegionAndAvailability(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith([]);
    });

    it("should return a 500 error if the findByRegionAndAvailability function throws an error", async () => {
      // Mocking the findByRegionAndAvailability function of the photographer data access layer
      (DALPhotographer.findByRegionAndAvailability as jest.Mock).mockRejectedValue(
        new Error("An error occurred while getting photographers"),
      );

      await getPhotographersByRegionAndAvailability(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "An error occurred while getting photographers",
      });
    });
  });
});
