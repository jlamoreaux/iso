import {
  Box,
  Button,
  Center,
  Group,
  Overlay,
  Space,
  Stack,
  Tabs,
  Text,
  Title,
} from "@mantine/core";
import React, { useEffect, useState } from "react";
import { Link, useLoaderData, useNavigate } from "react-router-dom";
import { IconPencil, IconUpload } from "@tabler/icons";
import { AuthWrapper, useAuth } from "../../context/AuthProvider";
import ProfileCarousel from "../../components/images/ProfileCarousel";
import { ProfilePhoto } from "../../components/images/ProfilePhoto";
import { Photographer } from "../../services/api";
import FavoriteButton from "../../components/buttons/Favorite";
import theme from "../../styles/theme";
import EditButton from "../../components/buttons/EditButton";
import ProfileTab from "./ProfileTab";
import ReviewsTab from "./ReviewsTab";
import EventsTab from "./EventsTab";

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
    profilePic,
    rate,
    isFavorite,
  } = photographer;

  const isOwnProfile = user?.id === id;
  const editPhotosUrl = "edit/photos";

  useEffect(() => {
    if (isOwnProfile) {
      navigate("/profile");
    }
  }, [isOwnProfile]);

  return (
    <AuthWrapper>
      <Stack>
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
        <Group position="left" p="sm" noWrap>
          <Stack align="flex-end" mt={-12} spacing={0}>
            {isOwnProfile && <EditButton onClick={() => navigate("/profile/edit")} />}
            {!isOwnProfile && <FavoriteButton id={id} isFavorite={isFavorite || false} />}
            <ProfilePhoto
              photoUrl={profilePic}
              userFullName={`${firstName} ${lastName}`}
              size="lg"
            ></ProfilePhoto>
          </Stack>
          <Title order={1}>{`${firstName} ${lastName}`}</Title>
        </Group>
        <Tabs defaultValue="profile">
          <Tabs.List position="left">
            <Tabs.Tab value="profile">Profile</Tabs.Tab>
            <Tabs.Tab value="events">Events</Tabs.Tab>
            <Tabs.Tab value="reviews">Reviews</Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="profile">
            <ProfileTab {...photographer} isOwnProfile={isOwnProfile} isFavorite={isFavorite} />
          </Tabs.Panel>

          <Tabs.Panel value="events">
            <EventsTab profileId={id} />
          </Tabs.Panel>

          <Tabs.Panel value="reviews">
            <ReviewsTab reviews={[]} />
          </Tabs.Panel>
        </Tabs>
      </Stack>
    </AuthWrapper>
  );
};

export default Profile;
