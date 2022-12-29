import React from "react";
import { Title, Stack, Container } from "@mantine/core";
import { Photographer } from "../../services/api";
import { ProfileCard } from "../../components/cards/ProfileCards";
import { useLoaderData } from "react-router-dom";

type PhotographersListProps = {
  listType: LIST_TYPE;
};

export enum LIST_TYPE {
  REGION = "region",
  AVAILABILITY = "availability",
  FAVORITES = "favorites",
}

const PhotographersList: React.FC<PhotographersListProps> = ({ listType }) => {
  const photographers = useLoaderData() as Photographer[];
  const titles = {
    [LIST_TYPE.REGION]: "Photographers in your Area",
    [LIST_TYPE.AVAILABILITY]: "Available Photographers",
    [LIST_TYPE.FAVORITES]: "Your Favorites",
  };
  const title = titles[listType];
  let content;
  if (photographers && photographers.length > 0) {
    content = photographers.map((photographer, i) => (
      <ProfileCard photographer={photographer} key={i} />
    ));
  } else {
    content = <div>No photographers found</div>;
  }
  return (
    <Container>
      <Title>{title}</Title>
      <Stack>{content}</Stack>
    </Container>
  );
};

export default PhotographersList;
