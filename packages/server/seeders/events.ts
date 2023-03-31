/*eslint-disable @typescript-eslint/no-unused-vars */
import { faker } from "@faker-js/faker";
import Photographer from "../src/models/Photographer";
import Event, { EventDocument } from "../src/models/Event";
import mongoose from "mongoose";
import { config } from "dotenv";

config();

const shouldDeleteEvents = false;

const deleteEvents = async (): Promise<void> => {
  let events = await Event.find();
  console.log(`Deleting ${events.length} events...`);
  await Event.deleteMany();
  events = await Event.find();
  console.log(`Done deleting events. ${events.length} events remaining.`);
};

const generateFakeEvent = (): EventDocument => {
  return new Event({
    title: faker.lorem.sentence(),
    description: faker.lorem.paragraph(),
    location: {
      city: faker.address.city(),
      state: faker.address.state(),
    },
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
  .then(async () => {
    console.log("MongoDB Connected");
    if (shouldDeleteEvents) {
      await deleteEvents();
      process.exit(0);
    }
    const events = await seedRootEvents();
    console.log(`${events.length} events created`);
    process.exit(0);
  })
  .catch((err) => console.log(err));
