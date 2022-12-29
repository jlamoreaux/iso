import React from "react";
import { Group, Title, Text, Badge, Stack, Anchor, UnstyledButton } from "@mantine/core";
import { Photographer } from "../../services/api";
import { ProfilePhoto } from "../images/ProfilePhoto";
import theme from "../../styles/theme";

type ProfileCardProps = {
  photographer: Photographer;
};

export const ProfileCard: React.FC<ProfileCardProps> = ({ photographer }) => {
  const { id, firstName, lastName, bio, city, state, profilePic } = photographer;
  return (
    <UnstyledButton component="a" href={`/photographer/${id}`}>
      <Group>
        <ProfilePhoto userFullName={`${firstName} ${lastName}`} photoUrl={profilePic} />
        <Stack>
          <Group position="apart">
            <Title order={3}>{`${firstName} ${lastName}`}</Title>
            <Title order={5} color={theme!.colors!.gold![4]}>
              {city}, {state}
            </Title>
          </Group>
          <Text lineClamp={2}>{bio}</Text>
        </Stack>
      </Group>
    </UnstyledButton>
  );
};
