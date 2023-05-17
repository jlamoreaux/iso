import React, { useState } from "react";
import { ActionIcon } from "@mantine/core";
import { IconBookmark } from "@tabler/icons-react";
import theme from "../../styles/theme.ts";
import { addFavorite, removeFavorite } from "../../services/api.ts";

type AddFavoriteProps = {
  id: string;
  isFavorite: boolean;
};
const FavoriteButton: React.FC<AddFavoriteProps> = ({ id, isFavorite: initialFavoriteState }) => {
  const [isFavorite, setIsFavorite] = useState(initialFavoriteState);
  const [isLoading, setIsLoading] = useState(false);

  const fillColor = theme.primaryColor as string;

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
      variant="transparent"
      color={theme.colors?.gray?.[4]}
      onClick={handleAddFavorite}
      loading={isLoading}
      aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
    >
      <IconBookmark color={fillColor} fill={isFavorite ? fillColor : "none"} />
    </ActionIcon>
  );
};

export default FavoriteButton;
