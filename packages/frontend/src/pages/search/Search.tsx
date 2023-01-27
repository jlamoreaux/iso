import { Container, Stack, Tabs, Title } from "@mantine/core";
import React from "react";
import SearchPhotographers from "./SearchPhotographers";

const Search = () => {
  return (
    <Stack m="sm">
      <Title>Search</Title>
      <Tabs defaultValue="photographers" variant="outline">
        <Tabs.List>
          <Tabs.Tab value="photographers">Photographers</Tabs.Tab>
          <Tabs.Tab value="events">Events</Tabs.Tab>
        </Tabs.List>
        <Container pt="lg">
          <Tabs.Panel value="photographers">
            <SearchPhotographers />
          </Tabs.Panel>
          <Tabs.Panel value="events">Events</Tabs.Panel>
        </Container>
      </Tabs>
    </Stack>
  );
};

export default Search;
