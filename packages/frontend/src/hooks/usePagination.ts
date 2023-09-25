import { useState } from 'react';

function usePagination(initialPage: number = 1) {
  const [currentPage, setCurrentPage] = useState<number>(initialPage);

  const nextPage = () => setCurrentPage(currentPage + 1);
  const prevPage = () => setCurrentPage(Math.max(currentPage - 1, 1));

  return { currentPage, nextPage, prevPage };
}

export default usePagination;
