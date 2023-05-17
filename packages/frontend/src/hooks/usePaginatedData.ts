// usePaginatedData.ts
import { useState, useEffect } from "react";

type PaginatedData<T> = {
  totalPages: number;
  data: T[];
};

const usePaginatedData = <TData>(
  initialFetch: (page: number) => Promise<PaginatedData<TData>>
) => {
  const [data, setData] = useState<TData[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const fetchData = async (pageNumber: number) => {
    const result = await initialFetch(pageNumber);
    const { totalPages, data: newData } = result;

    if (!newData || newData.length === 0) {
      setHasMore(false);
      return;
    }

    setPage(pageNumber);
    setHasMore(totalPages > pageNumber);
    setData((prevData) => [...prevData, ...newData]);
  };

  useEffect(() => {
    fetchData(1); // Initialize with page 1
  }, []);

  return { data, hasMore, page, fetchData };
};

export default usePaginatedData;
