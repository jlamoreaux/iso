import React from "react";
import { ActionIcon } from "@mantine/core";
import { IconPencil } from "@tabler/icons";

type EditButtonProps = {
  onClick?: () => void;
};

const EditButton: React.FC<EditButtonProps> = ({ onClick }) => {
  return (
    <ActionIcon aria-label="Edit" onClick={onClick} size="sm">
      <IconPencil />
    </ActionIcon>
  );
};

export default EditButton;
