import React from "react";
import { Avatar } from "@mantine/core";

type ProfilePhotoProps = {
  photoUrl?: string;
  userFullName?: string;
};

export const ProfilePhoto: React.FC<ProfilePhotoProps> = ({ photoUrl, userFullName }) => {
  const src = photoUrl || null;
  return <Avatar src={photoUrl} alt={userFullName} size="xl" />;
};
