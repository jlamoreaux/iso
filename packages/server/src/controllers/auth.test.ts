import { describe, expect, test } from "@jest/globals";
import { Request, Response, NextFunction } from "express";
import { login, register } from "./auth";
import DALPhotographer from "../data/photographer";
import logger from "../utils/logger";
import passport, { hashPassword, registerUser } from "../lib/auth";

// TODO: LOL fix

// Mocks
jest.mock("../data/photographer");
jest.mock("../utils/logger");
jest.mock("../lib/auth");

// Helper function to create a mock Request object
const createMockRequest = (
  body?: Record<string, any>,
  user?: Record<string, any>,
): Partial<Request> => ({
  body,
  user,
  logIn: jest.fn(),
  login: jest.fn(),
});

// Helper function to create a mock Response object
const createMockResponse = (): Partial<Response> => ({
  redirect: jest.fn(),
  status: jest.fn().mockReturnThis(),
  json: jest.fn().mockReturnThis(),
});

// Helper function to create a mock NextFunction object
const createMockNext = (): NextFunction => jest.fn();

describe("login", () => {
  const username = "test@test.com";
  const password = "password";

  afterEach(() => {
    // Clear all mocks between tests
    jest.clearAllMocks();
  });

  it("should return the id of the logged in user", async () => {
    // Create a mock Request object
    const req = createMockRequest({ username, password }, { id: 1 });

    // Create a mock Response object
    const res = createMockResponse();

    // Create a mock NextFunction object
    const next = createMockNext();

    await login(req as Request, res as Response);

    // Assert that the response status was set to 200
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ id: 1 });
  });

  it("should return a 401 if req.user does not exist", async () => {
    // Create a mock Request object
    const req = createMockRequest();

    // Create a mock Response object
    const res = createMockResponse();

    // Create a mock NextFunction object
    const next = createMockNext();

    await login(req as Request, res as Response);

    // Assert that the response status was set to 401
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Unauthorized" });
  });
});

describe("register", () => {
  afterEach(() => {
    // Clear all mocks between tests
    jest.clearAllMocks();
  });
  const user = {
    email: "test@test.com",
    username: "testuser",
    password: "password",
    firstName: "Test",
    lastName: "User",
    city: "Austin",
    state: "TX",
    zip: "78701",
  };

  it("should return a 400 status code and error message if username or password is missing", async () => {
    // Create a mock Request object without username or password
    const req = createMockRequest();

    // Create a mock Response object
    const res = createMockResponse();

    // Create a mock NextFunction object
    const next = createMockNext();

    await register(req as Request, res as Response, next);

    // Assert that the response status was set to 400
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("should return a 400 status code and error message if the photographer already exists", async () => {
    // Create a mock Request object
    const req = createMockRequest(user);

    // Create a mock Response object
    const res = createMockResponse();

    // Create a mock NextFunction object
    const next = createMockNext();

    // Stub the `DALPhotographer.findByEmail` method to return a photographer
    (DALPhotographer.findByUsernameOrEmail as jest.Mock).mockResolvedValueOnce({});

    await register(req as Request, res as Response, next);

    // Assert that the response status was set to 400
    expect(res.status).toHaveBeenCalledWith(400);

    // Assert that the response body was set to the correct error message
    expect(res.json).toHaveBeenCalledWith({ message: "Photographer already exists" });
  });

  it("should return a 500 status code and error message if an error occurs while registering the photographer", async () => {
    // Create a mock Request object
    const req = createMockRequest(user);

    // Create a mock Response object
    const res = createMockResponse();

    // Create a mock NextFunction object
    const next = createMockNext();

    // Stub the `DALPhotographer.findByEmail` method to return null
    (DALPhotographer.findByUsernameOrEmail as jest.Mock).mockResolvedValueOnce(null);

    (hashPassword as jest.Mock).mockImplementationOnce((password) => {
      return password;
    });

    (registerUser as jest.Mock).mockImplementationOnce((data, callback) => {
      const newUser = { ...user, id: 1 } as unknown as PhotographerDocument;
      return callback(null, newUser);
    });

    // Stub the `DALPhotographer.register` method to throw an error
    (DALPhotographer.register as jest.Mock).mockImplementationOnce((data, callback) => {
      callback(new Error("Error registering photographer"));
    });

    await register(req as Request, res as Response, next);

    // Assert that the response status was set to 500
    expect(res.status).toHaveBeenCalledWith(500);

    // Assert that the response body was set to the correct error message
    expect(res.json).toHaveBeenCalledWith({
      message: "Error when registering photographer",
    });
  });

  it("should add the user id to the request body", async () => {
    // Create a mock Request object
    const req = createMockRequest(user);

    // Create a mock Response object
    const res = createMockResponse();

    // Create a mock NextFunction object
    const mockNext = jest.fn();

    // Stub the `DALPhotographer.findByEmail` method to return null
    (DALPhotographer.findByUsernameOrEmail as jest.Mock).mockResolvedValueOnce(null);

    (hashPassword as jest.Mock).mockImplementationOnce((password) => {
      return password;
    });

    (registerUser as jest.Mock).mockImplementationOnce(() => {
      return { ...user, id: 1 } as unknown as PhotographerDocument;
    });

    // // Stub the passport.authenticate function to return a user object
    // (passport.authenticate as jest.Mock).mockImplementationOnce((strategy, callback) => {
    //   return (req: Request, res: Response, next: NextFunction) => {
    //     // Return a user object if the login is successful
    //     return callback(null, { ...user, id: 1 }, null);
    //   };
    // });

    await register(req as Request, res as Response, mockNext as NextFunction);

    // Assert that the user id was added to the request body
    expect(req.body.id).toEqual(1);
    // Assert that req.user is defined
    expect(req.user).toBeDefined();
    // Assert that the `next` function was called
    expect(mockNext).toHaveBeenCalled();
  });
});
