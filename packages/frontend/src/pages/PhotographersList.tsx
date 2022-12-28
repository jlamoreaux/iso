import React from "react";
import { Title, Stack, Container } from "@mantine/core";
import { Photographer } from "../services/api";
import { ProfileCard } from "../components/cards/ProfileCards";
import { useLoaderData } from "react-router-dom";

type PhotographersListProps = {
  listType: LIST_TYPE;
};

export enum LIST_TYPE {
  REGION = "region",
  AVAILABILITY = "availability",
}

const PhotographersList: React.FC<PhotographersListProps> = ({ listType }) => {
  const photographers = useLoaderData() as Photographer[];
  const title =
    listType === LIST_TYPE.REGION ? "Photographers in your Area" : "Available Photographers";
  return (
    <Container>
      <Title>{title}</Title>
      <Stack>
        {photographers.map((photographer, i) => (
          <ProfileCard photographer={photographer} key={i} />
        ))}
      </Stack>
    </Container>
  );
};

export default PhotographersList;
