/** eslint-disable @typescript-eslint/no-unused-vars */
import { faker } from "@faker-js/faker";
import * as mongoose from "mongoose";
import Photographer, { PhotographerDocument } from "../src/models/Photographer";
import { config } from "dotenv";

config();

export const generateFakePhotographer = (): PhotographerDocument => {
  return {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    username: faker.internet.userName(),
    company: faker.company.name(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    authType: "local",
    phone: faker.phone.number(),
    website: faker.internet.url(),
    address: faker.address.streetAddress(),
    city: faker.address.city(),
    state: faker.address.state(),
    zip: faker.address.zipCode(),
    availability: [faker.date.future()],
    regions: [{ state: faker.address.state(), city: faker.address.city() }],
    profilePic: faker.image.avatar(),
    portfolioImages: [faker.image.imageUrl()],
    bio: faker.lorem.sentences(),
  } as PhotographerDocument;
};

const seedPhotographers = async (num: number): Promise<void> => {
  console.log("Seeding photographers...");
  const photographers: PhotographerDocument[] = [];
  for (let i = 0; i < num; i++) {
    photographers.push(generateFakePhotographer());
  }
  Photographer.insertMany(photographers);
  console.log("Done seeding photographers");
};

mongoose
  .set("strictQuery", true)
  .connect(process.env.MONGODB_URI as string)
  .then(() => {
    console.log("MongoDB Connected");
    seedPhotographers(100);
  })
  .catch((err) => console.log(err));
