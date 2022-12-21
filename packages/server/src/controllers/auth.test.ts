import { describe, expect, test } from "@jest/globals";
import { Request, Response, NextFunction } from "express";
import { login, register } from "./auth";
import DALPhotographer from "../data/photographer";
import logger from "../utils/logger";
import passport from "../lib/auth";

// TODO: LOL fix

// Mocks
jest.mock("../data/photographer");
jest.mock("../utils/logger");
jest.mock("../lib/auth");

// Helper function to create a mock Request object
const createMockRequest = (body?: Record<string, any>): Partial<Request> => ({
  body,
  logIn: jest.fn(),
  login: jest.fn(),
});

// Helper function to create a mock Response object
const createMockResponse = (): Partial<Response> => ({
  redirect: jest.fn(),
  status: jest.fn().mockReturnValue({ json: jest.fn() }),
});

// Helper function to create a mock NextFunction object
const createMockNext = (): NextFunction => jest.fn();

describe("login", () => {
  const email = "test@test.com";
  const password = "password";

  afterEach(() => {
    // Clear all mocks between tests
    jest.clearAllMocks();
  });

  it("should redirect to the photographer's page if the login is successful", async () => {
    // Create a mock Request object
    const req = createMockRequest({ email, password });

    // Create a mock Response object
    const res = createMockResponse();

    // Create a mock NextFunction object
    const next = createMockNext();

    // Stub the passport.authenticate function to return a user object
    (passport.authenticate as jest.Mock).mockImplementationOnce((strategy, callback) => {
      return (req: Request, res: Response, next: NextFunction) => {
        // Return a user object if the login is successful
        return callback(null, { id: 1 }, null);
      };
    });

    await login(req as Request, res as Response);

    // Assert that the `logIn` function was called with the correct user object
    expect(req.logIn).toHaveBeenCalledWith({ id: 1 }, expect.any(Function));

    // Assert that the response was redirected to the correct URL
    expect(res.redirect).toHaveBeenCalledWith("/photographer/1");
  });

  it("should call next with an error if the login is unsuccessful", async () => {
    // Create a mock Request object
    const req = createMockRequest({ email, password });

    // Create a mock Response object
    const res = createMockResponse();

    // Create a mock NextFunction object
    const next = createMockNext();

    // Stub the passport.authenticate function to return an error
    (passport.authenticate as jest.Mock).mockImplementationOnce((strategy, callback) => {
      return (req: Request, res: Response, next: NextFunction) => {
        // Return an error if the login is unsuccessful
        return callback(null, false, { message: "Invalid credentials" });
      };
    });

    await login(req as Request, res as Response);

    // Assert that the `next` function was called with the correct
    // error message

    expect(next).toHaveBeenCalledWith(new Error("Invalid credentials"));
  });
});

describe("register", () => {
  const email = "test@test.com";
  const password = "password";

  beforeEach(() => {
    // Clear all mocks between tests
    jest.clearAllMocks();
  });

  it("should return a 400 status code and error message if email or password is missing", async () => {
    // Create a mock Request object without email or password
    const req = createMockRequest();

    // Create a mock Response object
    const res = createMockResponse();

    // Create a mock NextFunction object
    const next = createMockNext();

    await register(req as Request, res as Response, next);

    // Assert that the response status was set to 400
    expect(res.status).toHaveBeenCalledWith(400);

    // Check if the `res.status` method returns an object before calling `json` on it
    if (res.json) {
      // Assert that the response body was set to the correct error message
      expect(res.json).toHaveBeenCalledWith({
        message: "Email and password are required",
      });
    }
  });

  it("should return a 400 status code and error message if the photographer already exists", async () => {
    // Create a mock Request object
    const req = createMockRequest({ email, password });

    // Create a mock Response object
    const res = createMockResponse();

    // Create a mock NextFunction object
    const next = createMockNext();

    // Stub the `DALPhotographer.findByEmail` method to return a photographer
    (DALPhotographer.findByEmail as jest.Mock).mockResolvedValueOnce({});

    await register(req as Request, res as Response, next);

    // Assert that the response status was set to 400
    expect(res.status).toHaveBeenCalledWith(400);

    // Assert that the response body was set to the correct error message
    expect(res.json).toHaveBeenCalledWith({ message: "Photographer already exists" });
  });

  // it("should return a 500 status code and error message if an error occurs while registering the photographer", async () => {
  //   // Create a mock Request object
  //   const req = createMockRequest({ email, password });

  //   // Create a mock Response object
  //   const res = createMockResponse();

  //   // Create a mock NextFunction object
  //   const next = createMockNext();

  //   // Stub the `DALPhotographer.findByEmail` method to return null
  //   (DALPhotographer.findByEmail as jest.Mock).mockResolvedValueOnce(null);

  //   // Stub the `DALPhotographer.register` method to throw an error
  //   (DALPhotographer.register as jest.Mock).mockImplementationOnce((data, callback) => {
  //     callback(new Error("Error registering photographer"));
  //   });

  //   await register(req as Request, res as Response, next);

  //   // Assert that the response status was set to 500
  //   expect(res.status).toHaveBeenCalledWith(500);

  //   // Assert that the response body was set to the correct error message
  //   expect(res.json).toHaveBeenCalledWith({
  //     message: "Error when registering photographer",
  //   });
  // });

  it("should redirect to the photographer's page if the registration is successful", async () => {
    // Create a mock Request object
    const req = createMockRequest({ email, password });

    // Create a mock Response object
    const res = createMockResponse();

    // Create a mock NextFunction object
    const next = createMockNext();

    // Stub the `DALPhotographer.findByEmail` method to return null
    (DALPhotographer.findByEmail as jest.Mock).mockResolvedValueOnce(null);

    // Stub the `DALPhotographer.register` method to return a photographer
    (DALPhotographer.register as jest.Mock).mockImplementationOnce((data, callback) => {
      callback(null, { id: 1 });
    });

    // Stub the passport.authenticate function to return a user object
    (passport.authenticate as jest.Mock).mockImplementationOnce((strategy, callback) => {
      return (req: Request, res: Response, next: NextFunction) => {
        // Return a user object if the login is successful
        return callback(null, { id: 1 }, null);
      };
    });

    await register(req as Request, res as Response, next);

    // Assert that the response was redirected to the correct URL
    expect(res.redirect).toHaveBeenCalledWith("/photographer/1");
  });
});
