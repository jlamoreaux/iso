import { Title, Text, TypographyStylesProvider, Group, Container, Loader } from "@mantine/core";
import React from "react";
import { useLoaderData, useLocation } from "react-router-dom";
import { AuthWrapper, useAuth } from "../../context/AuthProvider";
import ProfileCarousel, {
  ProfileCarouselPlaceholder,
} from "../../components/images/ProfileCarousel";
import { ProfilePhoto } from "../../components/images/ProfilePhoto";
import { Photographer } from "../../services/api";
import FavoriteButton from "../../components/buttons/Favorite";

const Profile: React.FC = () => {
  const photographer = useLoaderData() as Photographer;
  const location = useLocation().pathname;
  const {
    id,
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
    isFavorite,
  } = photographer;

  return (
    <AuthWrapper>
      <Container>
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
            {location !== "/profile" && <FavoriteButton id={id} isFavorite={isFavorite || false} />}
          </div>
          <Text>
            <TypographyStylesProvider>
              <Title order={2}>Gear</Title>
              <Container>
                {gear && (
                  <ul>
                    <li>Cameras: {gear.cameras}</li>
                    <li>Lenses: {gear.lenses}</li>
                    <li>Accessories: {gear.accessories}</li>
                  </ul>
                )}
              </Container>
            </TypographyStylesProvider>
          </Text>
          <Text>
            <TypographyStylesProvider>
              <Title order={2}>Details</Title>
              <Container>
                <ul>
                  {city && state && <li>Location: {`${city}, ${state}`}</li>}
                  {company && <li>Company: {company}</li>}
                  {regions && (
                    <li>
                      Regions:
                      <ul>
                        {regions.map((region) => (
                          <li
                            key={`${region.city}, ${region.state} `}
                          >{`${region.city}, ${region.state}`}</li>
                        ))}
                      </ul>
                    </li>
                  )}
                </ul>
              </Container>
            </TypographyStylesProvider>
          </Text>
        </div>
      </Container>
    </AuthWrapper>
  );
};

export default Profile;
