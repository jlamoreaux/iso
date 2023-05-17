import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  Group,
  Stack,
  Text,
  Title,
  TypographyStylesProvider,
} from "@mantine/core";
import EditButton from "../../components/buttons/EditButton.js";
import { Photographer } from "../../services/api.js";

type ProfileTabProps = Partial<Photographer> & {
  isOwnProfile: boolean;
};

const ProfileTab: React.FC<ProfileTabProps> = ({
  firstName,
  id,
  gear,
  city,
  state,
  company,
  regions,
  rate,
  bio,
  isOwnProfile,
}) => {
  const navigate = useNavigate();
  return (
    <Stack
      style={{
        position: "relative",
      }}
      p="md"
    >
      <Title order={2}>Bio</Title>
      <Text>{bio}</Text>
      <Text>
        <TypographyStylesProvider>
          <Group>
            <Title order={2}>Gear</Title>
            {isOwnProfile && <EditButton onClick={() => navigate("/profile/edit")} />}
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
      <TypographyStylesProvider>
        <Group>
          <Title order={2}>Details</Title>
          {isOwnProfile && <EditButton onClick={() => navigate("/profile/edit")} />}
        </Group>
        <Stack>
          {city && state && (
            <>
              <Title order={5}>Location:</Title> {`${city}, ${state}`}
            </>
          )}
          {company && <li>Company: {company}</li>}
          {regions && (
            <>
              <Title order={5}>Regions:</Title>
              <ul>
                {regions.map((region) => (
                  <li
                    key={`${region.city}, ${region.state} `}
                  >{`${region.city}, ${region.state}`}</li>
                ))}
              </ul>
            </>
          )}
        </Stack>
      </TypographyStylesProvider>
      {!isOwnProfile && (
        <Box
          sx={(theme) => ({
            backgroundColor: theme.colors.tan[4],
            padding: theme.spacing.sm,
            position: "fixed",
            bottom: "32px",
            left: 0,
          })}
          w="100%"
        >
          <Group position="center" noWrap>
            <Text size="xs">
              Interested in working with {firstName}?
              <br />
              {rate && "Rates start at $" + rate + "/hr"}
            </Text>
            <Button variant="filled" component="a" href={"/messages/compose?p=" + id}>
              Send Inquiry
            </Button>
          </Group>
        </Box>
      )}
    </Stack>
  );
};

export default ProfileTab;
