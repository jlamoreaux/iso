import {
  ActionIcon,
  Box,
  Button,
  Center,
  Container,
  Group,
  Overlay,
  Space,
  Stack,
  Text,
  Title,
  TypographyStylesProvider,
} from "@mantine/core";
import React, { useEffect, useState } from "react";
import { Link, useLoaderData, useNavigate } from "react-router-dom";
import { useHover, useMediaQuery } from "@mantine/hooks";
import { IconPencil, IconUpload } from "@tabler/icons";
import { AuthWrapper, useAuth } from "../../context/AuthProvider";
import ProfileCarousel from "../../components/images/ProfileCarousel";
import { ProfilePhoto } from "../../components/images/ProfilePhoto";
import { Photographer } from "../../services/api";
import FavoriteButton from "../../components/buttons/Favorite";
import theme from "../../styles/theme";

const Profile: React.FC = () => {
  const { user } = useAuth();
  const photographer = useLoaderData() as Photographer;
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);

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
  const editPhotosUrl = "edit/photos";

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
        <Box
          sx={{
            position: "relative",
            alignContent: "center",
            width: "100%",
          }}
          onMouseOver={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          w="100%"
        >
          {isOwnProfile && hovered && (
            <>
              <Overlay<typeof Link>
                blur={2}
                to={editPhotosUrl}
                component={Link}
                zIndex={1}
                pos="absolute"
                w="100%"
              />
              <Center pos="absolute" w="100%" style={{ maxHeight: "100%", height: "400px" }}>
                <Text<typeof Link>
                  style={{ zIndex: 2 }}
                  align="center"
                  component={Link}
                  to={editPhotosUrl}
                >
                  {images && images.length > 0 ? (
                    <>
                      <IconPencil size={40} color={theme.colors?.gray?.[9]} />
                      <Space h={10} />
                      Edit Photos
                    </>
                  ) : (
                    <>
                      <IconUpload size={40} color={theme.colors?.gray?.[9]} />
                      <Space h={10} />
                      Upload Photos
                    </>
                  )}
                </Text>
              </Center>
            </>
          )}
          <ProfileCarousel images={images} />
        </Box>
        <Stack
          style={{
            position: "relative",
          }}
        >
          <Group>
            <Title order={1}>{`${firstName} ${lastName}`}</Title>
            {isOwnProfile && (
              <ActionIcon onClick={() => navigate("/profile/edit")}>
                <IconPencil />
              </ActionIcon>
            )}
          </Group>
          <Text>{bio}</Text>
          <ProfilePhoto
            photoUrl={profilePic}
            userFullName={`${firstName} ${lastName}`}
          ></ProfilePhoto>
          {!isOwnProfile && <FavoriteButton id={id} isFavorite={isFavorite || false} />}

          <Text>
            <TypographyStylesProvider>
              <Group>
                <Title order={2}>Gear</Title>
                {isOwnProfile && (
                  <ActionIcon onClick={() => navigate("/profile/edit")}>
                    <IconPencil />
                  </ActionIcon>
                )}
              </Group>
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
              <Group>
                <Title order={2}>Details</Title>
                {isOwnProfile && (
                  <ActionIcon onClick={() => navigate("/profile/edit")}>
                    <IconPencil />
                  </ActionIcon>
                )}
              </Group>
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
