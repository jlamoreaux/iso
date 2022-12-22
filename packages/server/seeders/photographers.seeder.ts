import { faker } from "@faker-js/faker";
import mongoose from "mongoose";
import Photographer, { PhotographerModel } from "../src/models/Photographer.js";

mongoose.connect("mongodb://localhost:27017/iso_db");

const generateFakePhotographer = (): any => {
  return {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    company: faker.company.companyName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    authType: "local",
    phone: faker.phone.phoneNumber(),
    website: faker.internet.url(),
    address: faker.address.streetAddress(),
    city: faker.address.city(),
    state: faker.address.state(),
    zip: faker.address.zipCode(),
    availability: [faker.date.future()],
    regions: [faker.address.state()],
    profilePic: faker.image.avatar(),
    portfolioImages: [faker.image.imageUrl()],
    bio: faker.lorem.sentences(),
  };
};

const NUM_FAKE_DOCUMENTS = 10;

for (let i = 0; i < NUM_FAKE_DOCUMENTS; i++) {
  const fakePhotographer = new Photographer(generateFakePhotographer());
  fakePhotographer.save((error) => {
    if (error) {
      console.log(error);
    } else {
      console.log(`Fake photographer created: ${fakePhotographer}`);
    }
  });
}

mongoose.connection.close();
