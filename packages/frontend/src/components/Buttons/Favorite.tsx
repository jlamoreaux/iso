import React, { useState } from "react";
import { ActionIcon, Button } from "@mantine/core";
import { IconBookmark } from "@tabler/icons";
import theme from "../../styles/theme";
import { addFavorite, removeFavorite } from "../../services/api";

type AddFavoriteProps = {
  id: string;
  isFavorite: boolean;
};
const FavoriteButton: React.FC<AddFavoriteProps> = ({ id, isFavorite: initialFavoriteState }) => {
  const [isFavorite, setIsFavorite] = useState(initialFavoriteState);
  const [isLoading, setIsLoading] = useState(false);

  const handleAddFavorite = async () => {
    setIsLoading(true);
    if (!isFavorite) {
      const response = await addFavorite(id);
      if (response) {
        setIsFavorite(true);
      }
    }
    if (isFavorite) {
      const response = await removeFavorite(id);
      if (response) {
        setIsFavorite(false);
      }
    }
    setIsLoading(false);
    return;
  };
  return (
    <ActionIcon
      variant={isFavorite ? "filled" : "transparent"}
      color={theme.colors?.gray?.[4]}
      onClick={handleAddFavorite}
      loading={isLoading}
    >
      <IconBookmark />
    </ActionIcon>
  );
};

export default FavoriteButton;
