/*eslint-disable @typescript-eslint/no-unused-vars */
import { faker } from "@faker-js/faker";
import Photographer from "../src/models/Photographer";
import Event, { EventDocument } from "../src/models/Event";
import mongoose from "mongoose";
import { config } from "dotenv";

config();

const generateFakeEvent = (): EventDocument => {
  return new Event({
    title: faker.lorem.sentence(),
    description: faker.lorem.paragraph(),
    location: faker.address.city(),
    date: faker.date.future(),
    time: faker.date.future().toLocaleTimeString(),
  });
};

const seedRootEvents = async (): Promise<EventDocument[]> => {
  console.log("Seeding events...");
  const photographers = await Photographer.find({}).sort({ _id: -1 });
  console.log("Getting photographers...");

  const events: EventDocument[] = [];
  photographers.forEach((photographer, i) => {
    // random number of events between 1 and 10
    const numEvents = Math.floor(Math.random() * 10);
    for (let i = 0; i < numEvents; i++) {
      const event = generateFakeEvent();
      event.photographer = photographer._id;
      events.push(event);
    }
  });
  await Event.insertMany(events);
  console.log("Done seeding root events");
  return events;
};

mongoose
  .set("strictQuery", true)
  .connect(process.env.MONGODB_URI as string)
  .then(() => {
    console.log("MongoDB Connected");
    seedRootEvents();
    // deleteEvents();
  })
  .catch((err) => console.log(err));

const deleteEvents = async (): Promise<void> => {
  console.log("Deleting events...");
  await Event.deleteMany({});
  console.log("Done deleting events");
};
