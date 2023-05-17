import React, { useState } from "react";
import { Button, Container, Collapse, RangeSlider, Stack, Text, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { DatePicker } from "@mantine/dates";
import GeoAutocomplete from "../../components/input/GeoAutocomplete.jsx";
import { EventSearchQuery, searchEvents } from "../../services/api.js";
import EventsList from "../events/EventsList.jsx";

type FormValues = {
  keyword: string;
  location: string;
  rate: number[];
  date: Date | undefined;
};

const convertValues = (values: FormValues): EventSearchQuery => {
  const { rate, location, ...rest } = values;
  const [minRate, maxRate] = rate;
  const [city, state] = location.split(", ");
  return {
    ...rest,
    minRate: minRate.toString(),
    maxRate: maxRate.toString(),
    city: city || "",
    state: state || "",
    date: values.date?.toISOString(),
  };
};

const SearchEvents = () => {
  const [showSearchForm, setShowSearchForm] = useState(true);
  const [showResults, setShowResults] = useState<boolean>(false);
  const [keyCounter, setKeyCounter] = useState(0);

  const form = useForm<FormValues>({
    initialValues: {
      keyword: "",
      location: "",
      rate: [0, 200],
      date: undefined,
    },
  });

  const handleSearchSubmit = async () => {
    setShowSearchForm(false);
    setShowResults(true);
    setKeyCounter(keyCounter + 1);
  };

  return (
    <Container p="0">
      <Stack>
        {!showSearchForm && (
          <Button onClick={() => setShowSearchForm(true)} variant="light">
            Edit Search
          </Button>
        )}
        <Collapse in={showSearchForm}>
          <form onSubmit={form.onSubmit(handleSearchSubmit)}>
            <Stack spacing="xs">
              <Text size="sm">Keyword</Text>
              <TextInput aria-label="Keyword" {...form.getInputProps("keyword")} />
              <Text size="sm">Location</Text>
              <GeoAutocomplete {...form.getInputProps("location")} />
              <Text size="sm">Hourly Rate:</Text>
              <RangeSlider
                label={(value) => `$${value + (value === 200 ? "+" : "")}`}
                {...form.getInputProps("rate")}
                aria-label="Hourly Rate"
                minRange={0}
                maxRange={200}
                defaultValue={[0, 200]}
              />
              <Text size="sm">Date:</Text>
              <DatePicker {...form.getInputProps("date")} />
              <Button type="submit">Search</Button>
            </Stack>
          </form>
        </Collapse>
        <Container>
          {showResults && <EventsList key={keyCounter} />}
        </Container>
      </Stack>
    </Container>
  );
};

export default SearchEvents;
