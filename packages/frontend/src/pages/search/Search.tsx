import React from "react";
import { Container, Stack, Tabs, Title } from "@mantine/core";
import { AuthWrapper } from "../../context/AuthProvider";
import SearchPhotographers from "./SearchPhotographers";
import SearchEvents from "./SearchEvents";

const Search = () => {
  return (
    <AuthWrapper>
      <Stack m="sm">
        <Title>Search</Title>
        <Tabs defaultValue="photographers">
          <Tabs.List position="center">
            <Tabs.Tab value="photographers">Photographers</Tabs.Tab>
            <Tabs.Tab value="events">Events</Tabs.Tab>
          </Tabs.List>
          <Container pt="lg">
            <Tabs.Panel value="photographers">
              <SearchPhotographers />
            </Tabs.Panel>
            <Tabs.Panel value="events">
              <SearchEvents />
            </Tabs.Panel>
          </Container>
        </Tabs>
      </Stack>
    </AuthWrapper>
  );
};

export default Search;