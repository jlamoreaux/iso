import React, { useEffect, useState } from "react";
import {
  Button,
  Container,
  RangeSlider,
  Rating,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { Outlet, useNavigate } from "react-router-dom";
import { AuthWrapper } from "../../context/AuthProvider";
import { PhotographerSearchQuery, searchPhotographers } from "../../services/api";
import GeoAutocomplete from "../../components/GeoAutocomplete";

type ConvertedValues = {
  name: string;
  city: string;
  state: string;
  minRate: string;
  maxRate: string;
  rating: string;
  gear: string;
};

export const fetchNextPage = async (values: ConvertedValues, page: number) => {
  // convert values to PhotographerSearchQuery
  const query: PhotographerSearchQuery = {
    name: values.name,
    location: {
      city: values.city,
      state: values.state,
    },
    rate: {
      min: values.minRate,
      max: values.maxRate,
    },
    rating: values.rating,
    gear: values.gear,
    page,
  };
  const data = await searchPhotographers(query);
  return data;
};

type FormValues = { name: string; location: string; rate: number[]; rating: string; gear: string };

const convertValues = (values: FormValues): ConvertedValues => {
  const { rate, location, ...rest } = values;
  const [minRate, maxRate] = rate;
  const [city, state] = location.split(", ");
  return {
    ...rest,
    minRate: minRate.toString(),
    maxRate: maxRate.toString(),
    city: city || "",
    state: state || "",
  };
};

// Search for photographers by name, location, etc. using manitine useForm hook
const SearchPhotographers = () => {
  const navigate = useNavigate();
  const form = useForm({
    initialValues: {
      name: "",
      location: "",
      rate: [0, 200],
      rating: "",
      gear: "",
    },
  });

  const handleSearchSubmit = async (values: FormValues) => {
    // convert rate to minRate and maxRate
    const newValues = convertValues(values);
    navigate(`/search/results?${new URLSearchParams(newValues).toString()}`);
  };

  return (
    <AuthWrapper>
      <Container>
        <Title>Search for photographers</Title>
        <Stack>
          <form onSubmit={form.onSubmit(handleSearchSubmit)}>
            <Stack spacing="xs">
              <Text size="sm">Name</Text>
              <TextInput aria-label="Name" {...form.getInputProps("name")} />
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
              <Text size="sm">Rating:</Text>
              <Rating aria-label="Rating" {...form.getInputProps("rating")} />
              <Text size="sm">Gear:</Text>
              <TextInput aria-label="Gear" {...form.getInputProps("gear")} />
              <Button type="submit">Search</Button>
            </Stack>
          </form>
          <Outlet />
        </Stack>
      </Container>
    </AuthWrapper>
  );
};

export default SearchPhotographers;
