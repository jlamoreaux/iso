import React from "react";
import { Autocomplete, AutocompleteProps } from "@mantine/core";
import { useGooglePlacesAutocomplete } from "../../services/google.js";

const GeoAutocomplete: React.FC<AutocompleteProps> = (formProps) => {
  const { inputRef, predictions } = useGooglePlacesAutocomplete();

  return (
    <Autocomplete
      {...formProps}
      limit={3}
      ref={inputRef}
      data={
        predictions
          ? predictions.map((prediction) => {
              const { city, state } = prediction.value;
              return {
                value: prediction.label,
                city,
                state,
              };
            })
          : []
      }
    />
  );
};

export default GeoAutocomplete;
