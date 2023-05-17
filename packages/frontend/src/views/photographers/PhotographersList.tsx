import React, { useCallback, useEffect, useMemo } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useLoaderData } from "react-router-dom";
import { Title, Stack, Container, Loader } from "@mantine/core";
import { Photographer, PhotographerSearchResponse } from "../../services/api.js";
import ProfileCard from "../../components/cards/ProfileCards.js";
import { AuthWrapper } from "../../context/AuthProvider.js";

type PhotographersListProps = {
  listType?: LIST_TYPE;
  fetchNextPage?: () => Promise<PhotographerSearchResponse>;
};

export enum LIST_TYPE {
  REGION = "region",
  AVAILABILITY = "availability",
  FAVORITES = "favorites",
}

const PhotographersList: React.FC<PhotographersListProps> = ({ listType }) => {
  const { data, fetchNextPage } = useLoaderData() as {
    data: PhotographerSearchResponse;
    fetchNextPage: Function;
  };
  const { photographers: initialPhotographers, totalPages, totalResults } = data;
  const [page, setPage] = React.useState(1);
  const [hasMore, setHasMore] = React.useState(false);

  // store photographers in state
  const [photographers, setPhotographers] = React.useState<Photographer[]>([]);

  const cannotFetch = !fetchNextPage;

  const titles = {
    [LIST_TYPE.REGION]: "Photographers in your Area",
    [LIST_TYPE.AVAILABILITY]: "Available Photographers",
    [LIST_TYPE.FAVORITES]: "Your Favorites",
  };
  const title = listType && titles[listType];

  useEffect(() => {
    if (data) {
      setPhotographers(initialPhotographers);
    }
  }, [data]);

  // memoize content
  const content = useMemo(() => {
    if (!photographers || photographers.length === 0) {
      return <div>No photographers found</div>;
    }

    if (photographers && photographers.length > 0) {
      if (!cannotFetch && page < totalPages) {
        setHasMore(true);
      }
      return (
        <Stack>
          {photographers.map((photographer, i) => (
            <ProfileCard key={i} photographer={photographer} />
          ))}
        </Stack>
      );
    }
  }, [photographers, page, totalPages]);

  const fetchData = useCallback(async () => {
    const nextPage = page + 1;
    if (cannotFetch) return;
    const data = await fetchNextPage(nextPage);
    if (data) {
      setPage(nextPage);
      setHasMore(data.totalPages > page);
      setPhotographers([...photographers, ...data.photographers]);
    }
  }, [fetchNextPage, page, totalPages]);

  return (
    <AuthWrapper>
      <Container>
        {title && <Title>{title}</Title>}
        <InfiniteScroll
          dataLength={photographers?.length || 0}
          next={fetchData}
          hasMore={hasMore}
          loader={<Loader />}
        >
          {content}
        </InfiniteScroll>
      </Container>
    </AuthWrapper>
  );
};

export default PhotographersList;
