import { getMessage, createMessage, updateMessage, deleteMessage } from "./messages";
import { Request, Response } from "express";
import { IMessageDocument } from "../models/Message";
import DALMessage from "../data/message";

jest.mock("../data/message");

describe("getMessage", () => {
  let mockResponse: Response;

  // Reset the mocks after each test
  beforeEach(() => {
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnValue({}),
    } as unknown as Response;
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  // Mock the request and response objects
  const mockRequest = {
    params: {
      id: "123",
    },
    user: {
      id: "456",
    },
  } as unknown as Request;

  it("should return a 200 response and the message with the given id", async () => {
    const message = {
        id: "123",
        message: "Hello world!",
        sender: {
          id: "456",
        },
    } as unknown as IMessageDocument;
    (DALMessage.findById as jest.Mock).mockResolvedValue(message);

    const response = await getMessage(mockRequest, mockResponse);
    expect(response).toEqual({});
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({message, thread: []});
  });

  it("should return a 404 response if the message is not found", async () => {
    (DALMessage.findById as jest.Mock).mockResolvedValue(null);
    const response = await getMessage(mockRequest, mockResponse);
    expect(response).toEqual({});
    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: "Message not found" });
  });
});

describe("createMessage", () => {
  // Reset the mocks after each test
  let mockResponse: Response;

  beforeEach(() => {
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnValue({}),
    } as unknown as Response;
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  // Mock the request and response objects
  const mockRequest = {
    body: {
      message: "Hello world!",
    },
    user: {
      id: "456",
    },
  } as unknown as Request;

  it("should return a 201 response and the created message", async () => {
    const expected = {
      id: "123",
      message: "Hello world!",
      sender: {
        id: "456",
      },
    } as unknown as IMessageDocument;
    (DALMessage.create as jest.Mock).mockResolvedValue(expected);

    const response = await createMessage(mockRequest, mockResponse);
    expect(response).toEqual({});
    expect(mockResponse.status).toHaveBeenCalledWith(201);
    expect(mockResponse.json).toHaveBeenCalledWith(expected);
  });
});

describe("updateMessage", () => {
  // Reset the mocks after each test
  let mockResponse: Response;

  beforeEach(() => {
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnValue({}),
    } as unknown as Response;
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  // Mock the request and response objects
  const mockRequest = {
    params: {
      id: "123",
    },
    body: {
      message: "Hello world!",
    },
    user: {
      id: "456",
    },
  } as unknown as Request;

  it("should return a 200 response and the updated message", async () => {
    const expected = {
      id: "123",
      message: "Hello world!",
      sender: "456",
    } as unknown as IMessageDocument;
    (DALMessage.findByIdAndSender as jest.Mock).mockResolvedValue(expected);
    (DALMessage.update as jest.Mock).mockResolvedValue(expected);

    const response = await updateMessage(mockRequest, mockResponse);
    expect(response).toEqual({});
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith(expected);
  });

  it("should return a 404 response if the message is not found", async () => {
    (DALMessage.update as jest.Mock).mockResolvedValue(null);
    const response = await updateMessage(mockRequest, mockResponse);
    expect(response).toEqual({});
    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: "Message not found" });
  });

  it("should return a 400 response if the message is not provided", async () => {
    const mockRequest = {
      params: {
        id: "123",
      },
      user: {
        id: "456",
      },
    } as unknown as Request;
    const response = await updateMessage(mockRequest, mockResponse);
    expect(response).toEqual({});
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: "Message is required" });
  });
});

describe("deleteMessage", () => {
  // Reset the mocks after each test
  let mockResponse: Response;

  beforeEach(() => {
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnValue({}),
    } as unknown as Response;
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  // Mock the request and response objects
  const mockRequest = {
    params: {
      id: "123",
    },
  } as unknown as Request;

  it("should return a 204 response", async () => {
    const expected = {
      id: "123",
      message: "Hello world!",
      sender: {
        id: "456",
      },
    } as unknown as IMessageDocument;
    (DALMessage.delete as jest.Mock).mockResolvedValue(expected);

    const response = await deleteMessage(mockRequest, mockResponse);
    expect(response.json).not.toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(204);
  });

  it("should return a 404 response if the message is not found", async () => {
    (DALMessage.delete as jest.Mock).mockResolvedValue(null);
    const response = await deleteMessage(mockRequest, mockResponse);
    expect(response).toEqual({});
    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: "Message not found" });
  });
});
