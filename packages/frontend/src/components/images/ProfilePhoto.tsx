import React from "react";
import { Avatar, MantineSizes } from "@mantine/core";

type ProfilePhotoProps = {
  photoUrl?: string;
  userFullName?: string;
  size?: "sm" | "md" | "lg";
};

export const ProfilePhoto: React.FC<ProfilePhotoProps> = ({
  photoUrl,
  userFullName,
  size = "md",
}) => {
  const alt = userFullName || "Profile Photo";
  return <Avatar src={photoUrl} alt={alt} size={size} radius="xl" />;
};
