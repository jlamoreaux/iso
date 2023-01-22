import React from "react";
import { Avatar } from "@mantine/core";

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
  const src = photoUrl || null;
  const alt = userFullName || "Profile Photo";
  const radius = size === "sm" ? 25 : size === "md" ? 50 : 100;
  const avatarSize = size === "sm" ? 50 : size === "md" ? 104 : 200;
  return <Avatar src={photoUrl} alt={alt} size={avatarSize} radius={radius} />;
};
