import React from "react";
import { Carousel } from "@mantine/carousel";
import { Image } from "@mantine/core";
import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";
import theme from "../../styles/theme.ts";

type ProfileCarouselProps = {
  images: string[] | undefined;
};

const ProfileCarousel: React.FC<ProfileCarouselProps> = ({ images }) => {
  if (!images || images.length === 0) {
    return <ProfileCarouselPlaceholder />;
  }
  return (
    <Carousel
      sx={{ maxWidth: 320 }}
      mx="auto"
      height={180}
      withIndicators
      nextControlIcon={<IconArrowRight size={16} />}
      previousControlIcon={<IconArrowLeft size={16} />}
      styles={{
        indicators: {
          width: 4,
          height: 4,
          borderRadius: "50%",
          transition: "width 250ms ease",
          background: theme.colors?.gray ? theme.colors.gray[3] : "light-gray",
          "&[data-active]": {
            background: theme.colors?.gray ? theme.colors.gray[7] : "gray",
          },
        },
      }}
    >
      {images.map((image, i) => (
        <Carousel.Slide key={image}>
          <img src={image} alt={`profile photo #${i}`} />
        </Carousel.Slide>
      ))}
    </Carousel>
  );
};

export const ProfileCarouselPlaceholder: React.FC = () => {
  return <Image sx={{ maxWidth: 320 }} mx="auto" height={180} withPlaceholder />;
};

export default ProfileCarousel;
