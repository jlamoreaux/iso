/* eslint-disable @typescript-eslint/no-unused-vars */
import { faker } from "@faker-js/faker";
import * as mongoose from "mongoose";
import { config } from "dotenv";
import Photographer, { PhotographerDocument } from "../src/models/Photographer";
import { CURRENTLY_SUPPORTED_REGIONS } from "../src/utils/regions";

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

const addRegions = async (): Promise<void> => {
  const photographers = await Photographer.find();
  // Create a list from enum of all the regions
  const regions = Object.keys(CURRENTLY_SUPPORTED_REGIONS).map(
    (key) => CURRENTLY_SUPPORTED_REGIONS[key],
  );

  photographers.forEach(async (photographer) => {
    // add two regions to each photographer
    const region1 = regions[Math.floor(Math.random() * regions.length)];
    let region2 = regions[Math.floor(Math.random() * regions.length)];
    while (region1 === region2) {
      region2 = regions[Math.floor(Math.random() * regions.length)];
    }
    // select a city from the region
    const city1 = region1.cities[Math.floor(Math.random() * region1.cities.length)];
    const city2 = region2.cities[Math.floor(Math.random() * region2.cities.length)];
    photographer.regions = [
      { state: region1.name, city: city1 },
      { state: region2.name, city: city2 },
    ];
    await photographer.save();
  });
};

mongoose
  .set("strictQuery", true)
  .connect(process.env.MONGODB_URI as string)
  .then(async () => {
    console.log("MongoDB Connected");
    await addRegions();
  })
  .then(() => mongoose.connection.close(() => console.log("MongoDB connection closed")))
  .catch((err) => console.log(err));
