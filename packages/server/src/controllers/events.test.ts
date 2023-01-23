// Test for events controller
import { Request, Response } from "express";
import { getEvent, getEventsForFeed, createEvent, updateEvent, deleteEvent } from "./events";
import { IPhotographer } from "../models/Photographer";
import DALEvent from "../data/event";

// Mocking the event data access layer
jest.mock("../data/event");

describe("Events Controller", () => {
  let mockResponse: Response;

  const photographer: Partial<IPhotographer> = {
    id: "1",
    firstName: "John",
    lastName: "Doe",
    email: "hello@example.com",
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
    },
    query: {
      photographer: 1,
    },
    body: {},
    user: photographer,
  } as unknown as Request;

  describe("getEvents", () => {
    it("should return all events for a photographer", async () => {
      const event1 = {
        id: 1,
        title: "Event 1",
        description: "Description 1",
        date: new Date("2024-01-01"),
        time: "10:00:00",
        location: "Location 1",
        photographer,
      };
      const event2 = {
        id: 2,
        title: "Event 2",
        description: "Description 2",
        date: new Date("2024-01-02"),
        time: "10:00:00",
        location: "Location 2",
        photographer,
      };
      const events = [event1, event2];

      mockRequest.body = { photographer };

      // Mocking the find function of the event data access layer
      (DALEvent.getEventsForFeed as jest.Mock).mockResolvedValue(events);

      await getEventsForFeed(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(events);
    });
  });

  describe("getEvent", () => {
    it("should return an event by id", async () => {
      const event = {
        id: 1,
        title: "Event 1",
        description: "Description 1",
        date: "2020-01-01",
        time: "10:00:00",
        location: "Location 1",
        price: 100,
      };

      // Mocking the findOne function of the event data access layer
      (DALEvent.getEvent as jest.Mock).mockResolvedValue(event);
      await getEvent(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(event);
    });
  });

  describe("createEvent", () => {
    it("should create a event", async () => {
      const event = {
        id: 1,
        title: "Event 1",
        description: "Description 1",
        date: "2020-01-01",
        time: "10:00:00",
        location: "Location 1",
        price: 100,
      };

      // Mocking the create function of the event data access layer
      (DALEvent.create as jest.Mock).mockResolvedValue(event);
      await createEvent(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(event);
    });
  });

  describe("updateEvent", () => {
    it("should update a event", async () => {
      // const event = {
      //   id: 1,
      //   name: "Event 1",
      //   description: "Description 1",
      //   date: "2024-01-01",
      //   time: "10:00:00",
      //   location: "Location 1",
      // };

      const updatedEvent = {
        id: 1,
        title: "Event 1",
        description: "Description 2",
        date: "2020-01-08",
        time: "12:00:00",
        location: "Location 2",
      };

      mockRequest.body = updatedEvent;

      // Mocking the update function of the event data access layer
      (DALEvent.update as jest.Mock).mockResolvedValue(updatedEvent);
      await updateEvent(mockRequest, mockResponse);
      const expected = { event: updatedEvent, message: "Event updated" };

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(expected);
    });
  });

  describe("deleteEvent", () => {
    it("should delete a event", async () => {
      const event = {
        id: 1,
        title: "Event 1",
        description: "Description 1",
        date: "2020-01-01",
        location: "Location 1",
        rate: 100,
        photographer,
      };

      const mockDeletedEvent = { ...event, isDeleted: true };

      // Mocking the delete function of the event data access layer
      (DALEvent.getEvent as jest.Mock).mockResolvedValue(event);
      (DALEvent.softDelete as jest.Mock).mockResolvedValue(mockDeletedEvent);
      await deleteEvent(mockRequest, mockResponse);

      const expected = { event: mockDeletedEvent, message: "Event Deleted" };
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(expected);
    });
  });
});
