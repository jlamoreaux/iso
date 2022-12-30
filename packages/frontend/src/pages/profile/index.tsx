import {
  Title,
  Text,
  TypographyStylesProvider,
  Container,
  Box,
  Button,
  Space,
  Stack,
} from "@mantine/core";
import React, { useEffect } from "react";
import { useLoaderData, useLocation, useNavigate } from "react-router-dom";
import { AuthWrapper, useAuth } from "../../context/AuthProvider";
import ProfileCarousel, {
  ProfileCarouselPlaceholder,
} from "../../components/images/ProfileCarousel";
import { ProfilePhoto } from "../../components/images/ProfilePhoto";
import { Photographer } from "../../services/api";
import FavoriteButton from "../../components/buttons/Favorite";
import { useMediaQuery } from "@mantine/hooks";

const Profile: React.FC = () => {
  const { user } = useAuth();
  const photographer = useLoaderData() as Photographer;
  const location = useLocation().pathname;
  const navigate = useNavigate();
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

  const isOwnProfile = user?.id === id;

  const isMobile = useMediaQuery("(max-width: 600px)");

  useEffect(() => {
    if (isOwnProfile) {
      navigate("/profile");
    }
  }, [isOwnProfile]);

  return (
    <AuthWrapper>
      <Container
        style={{
          width: "100%",
          margin: 0,
        }}
      >
        {images?.length ? <ProfileCarousel images={images} /> : <ProfileCarouselPlaceholder />}
        <Stack
          style={{
            position: "relative",
          }}
        >
          <Title order={1}>{`${firstName} ${lastName}`}</Title>
          <Text>{bio}</Text>
          <ProfilePhoto
            photoUrl={profilePic}
            userFullName={`${firstName} ${lastName}`}
          ></ProfilePhoto>
          {!isOwnProfile && <FavoriteButton id={id} isFavorite={isFavorite || false} />}

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
                  <Space p={200} />
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
          {!isOwnProfile && (
            <Box
              sx={(theme) => ({
                textAlign: "right",
                backgroundColor: theme.colors.tan[4],
                padding: theme.spacing.md,
                position: "sticky",
                bottom: isMobile ? 38 : 0,
                marginLeft: "-24px",
                width: "calc(100% - 24px)",
              })}
            >
              <Button variant="filled" component="a" href={"/messages/compose?p=" + id}>
                Send Inquiry
              </Button>
            </Box>
          )}
        </Stack>
      </Container>
    </AuthWrapper>
  );
};

export default Profile;
