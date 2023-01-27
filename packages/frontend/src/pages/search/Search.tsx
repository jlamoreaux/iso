import React from "react";
import { Container, Stack, Tabs, Title } from "@mantine/core";
import { AuthWrapper } from "../../context/AuthProvider";
import SearchPhotographers from "./SearchPhotographers";

const Search = () => {
  return (
    <AuthWrapper>
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
    </AuthWrapper>
  );
};

export default Search;
