import React from "react";
import { Group, Title, Text, Stack, UnstyledButton } from "@mantine/core";
import { Photographer } from "../../services/api.js";
import { ProfilePhoto } from "../images/ProfilePhoto.js";
import theme from "../../styles/theme.js";

type ProfileCardProps = {
  photographer: Photographer;
  style?: "verbose" | "compact";
  direction?: "ltr" | "rtl";
  displayName?: boolean;
};

export const ProfileCard: React.FC<ProfileCardProps> = ({
  photographer,
  style = "verbose",
  direction = "ltr",
  displayName = true,
}) => {
  const { id, firstName, lastName, bio, city, state, profilePic } = photographer;

  return (
    <UnstyledButton component="a" href={`/photographer/${id}`}>
      <Group sx={{ flexDirection: direction === "rtl" ? "row-reverse" : "row" }}>
        <ProfilePhoto
          userFullName={`${firstName} ${lastName}`}
          photoUrl={profilePic}
          size={style === "verbose" ? "lg" : "md"}
        />
        <Stack>
          <Group position="apart">
            {displayName && (
              <Title
                order={3}
                size={style === "verbose" ? "lg" : "md"}
              >{`${firstName} ${lastName}`}</Title>
            )}
            {style === "verbose" && (
              <Title order={5} color={theme!.colors!.gold![4]}>
                {city}, {state}
              </Title>
            )}
          </Group>
          <Text lineClamp={2}>{bio}</Text>
        </Stack>
      </Group>
    </UnstyledButton>
  );
};
