import React from "react";
import { Stack, Text } from "@mantine/core";

type ReviewsTabProps = {
  reviews: string[];
};

const ReviewsTab: React.FC<ReviewsTabProps> = ({ reviews }) => {
  return (
    <Stack
      style={{
        position: "relative",
      }}
      p="md"
    >
      {reviews.length > 0 ? (
        reviews.map((review) => <Text>{review}</Text>)
      ) : (
        <Text>No reviews yet</Text>
      )}
    </Stack>
  );
};

export default ReviewsTab;
