import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    google: any;
  }
}

const API_KEY = import.meta.env.VITE_API_GOOGLE_PLACES_API_KEY;

export function useGooglePlacesAutocomplete() {
  const [predictions, setPredictions] = useState<
    { label: string; value: { city: string; state: string } }[] | undefined
  >([]);
  const inputRef = useRef() as React.MutableRefObject<HTMLInputElement>;
  // const apiKey = API_KEY;
  useEffect(() => {
    // Load the Google Maps JavaScript API
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&libraries=places&v=weekly`;
    document.head.appendChild(script);

    script.onload = () => {
      // Initialize the Google Places Autocomplete feature
      if (!inputRef.current || !window.google) return;

      // Listen for input events on the input element
      inputRef.current.addEventListener("input", (e) => {
        const input = e.target as HTMLInputElement;
        const value = input.value;

        // If the input value is empty, do not send a request to the Places API
        if (!value || value.length < 3) {
          setPredictions(undefined);
          return;
        }

        if (window.google && window.google.maps) {
          const autocompleteService = new window.google.maps.places.AutocompleteService();
          // Send a request to the Places API, and invoke the callback once
          // the data has been returned
          autocompleteService.getPlacePredictions(
            {
              input: value,
              types: ["(cities)"],
            },
            (predictions: any, status: any) => {
              // If the status is not OK, do not proceed
              if (status !== window.google.maps.places.PlacesServiceStatus.OK) return;

              // Set the predictions state
              if (!predictions || predictions.length < 1) return;
              setPredictions(
                predictions.map((prediction: any) => ({
                  label: prediction.description,
                  value: {
                    city: prediction.structured_formatting.main_text,
                    state: prediction.structured_formatting.secondary_text.split(",")[0],
                  },
                })),
              );
            },
          );
        }
      });
      // return () => {
      //   document.head.removeChild(script);
      // };
    };
  }, []);

  return { inputRef, predictions };
}
