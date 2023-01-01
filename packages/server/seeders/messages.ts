/*eslint-disable @typescript-eslint/no-unused-vars */
import { faker } from "@faker-js/faker";
import Photographer from "../src/models/Photographer";
import Message, { IMessageDocument } from "../src/models/Message";
import mongoose from "mongoose";
import { config } from "dotenv";

config();
const generateFakeMessage = (): IMessageDocument => {
  return new Message({
    message: faker.lorem.sentences(),
    eventDate: faker.date.future(),
    eventLocation: faker.address.streetAddress(),
    eventTitle: faker.lorem.sentence(),
    eventType: faker.lorem.word(),
    eventDescription: faker.lorem.sentences(),
  });
};

const seedRootMessages = async (): Promise<IMessageDocument[]> => {
  console.log("Seeding messages...");
  const photographers = await Photographer.find({}).sort({ _id: -1 });
  console.log("Getting photographers...");

  const messages: IMessageDocument[] = [];
  photographers.forEach((photographer, i) => {
    // random number of messages between 1 and 10
    const numMessages = Math.floor(Math.random() * 10);
    const photographerB = photographers[i + 1] || photographers[0];
    for (let i = 0; i < numMessages; i++) {
      const message = generateFakeMessage();
      message.sender = photographer._id;
      message.recipient = photographerB._id;
      messages.push(message);
    }
  });
  await Message.insertMany(messages);
  console.log("Done seeding root messages");
  return messages;
};

const seedReplyMessages = async (): Promise<void> => {
  console.log("Seeding reply messages...");
  const messages = await Message.find({ isRootMessage: true });
  messages.forEach(async (message, i) => {
    const numReplies = Math.floor(Math.random() * 5);
    const photographerA = message.sender;
    const photographerB = message.recipient;
    const reply = generateFakeMessage();
    // even replies are from photographerA, odd replies are from photographerB
    for (let i = 0; i < numReplies; i++) {
      reply.sender = i % 2 === 0 ? photographerA._id : photographerB._id;
      reply.recipient = i % 2 === 0 ? photographerB._id : photographerA._id;
      reply.replyTo = message._id;
      reply.isRootMessage = false;
      const savedReply = await Message.create(reply);
      message.replies ? message.replies.push(savedReply._id) : (message.replies = [savedReply._id]);
      await message.save();
    }
  });
  await Message.insertMany(messages);
  console.log("Done seeding messages");
};

mongoose
  .set("strictQuery", true)
  .connect(process.env.MONGODB_URI as string)
  .then(() => {
    console.log("MongoDB Connected");
    // seedRootMessages();
    seedReplyMessages();
    // deleteMessages();
  })
  .catch((err) => console.log(err));

const deleteMessages = async (): Promise<void> => {
  console.log("Deleting messages...");
  await Message.deleteMany({});
  console.log("Done deleting messages");
};
