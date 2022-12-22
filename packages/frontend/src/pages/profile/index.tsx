import { Title, Text, TypographyStylesProvider } from "@mantine/core";
import React from "react";
import { useLoaderData } from "react-router-dom";
import ProfileCarousel, { ProfileCarouselPlaceholder } from "../../components/ProfileCarousel";
import { ProfilePhoto } from "../../components/ProfilePhoto";
import { Photographer } from "../../services/api";

const Profile: React.FC = () => {
  const photographer = useLoaderData() as Photographer;
  const {
    portfolioImages: images,
    firstName,
    lastName,
    gear,
    city,
    state,
    company,
    regions,
    profilePic,
    bio,
  } = photographer;
  return (
    <div>
      {images?.length ? <ProfileCarousel images={images} /> : <ProfileCarouselPlaceholder />}
      <div>
        <div>
          <div>
            <Title order={1}>{`${firstName} ${lastName}`}</Title>
            <div className="profile-bio">{bio}</div>
          </div>
          <ProfilePhoto
            photoUrl={profilePic}
            userFullName={`${firstName} ${lastName}`}
          ></ProfilePhoto>
        </div>
        <Text lineClamp={3}>
          <TypographyStylesProvider>
            <Title order={2}>Gear</Title>
            <p>
              {gear && (
                <ul>
                  <li>Cameras: {gear.cameras}</li>
                  <li>Lenses: {gear.lenses}</li>
                  <li>Accessories: {gear.accessories}</li>
                </ul>
              )}
            </p>
          </TypographyStylesProvider>
        </Text>
        <Text lineClamp={3}>
          <TypographyStylesProvider>
            <Title order={2}>Details</Title>
            <p>
              {city && state && (
                <ul>
                  <li>Location: {`${city}, ${state}`}</li>
                </ul>
              )}
              {company && (
                <ul>
                  <li>Company: {company}</li>
                </ul>
              )}
              {regions && (
                <ul>
                  <li>Regions: {regions}</li>
                </ul>
              )}
            </p>
          </TypographyStylesProvider>
        </Text>
      </div>
    </div>
  );
};

export default Profile;
