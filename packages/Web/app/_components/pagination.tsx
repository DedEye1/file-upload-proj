'use client';

import { useRouter, useSearchParams } from 'next/navigation';

export function Pagination({ maxPage }: { maxPage: number }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPageParam = searchParams.get('page') ?? '1';
  const currentPage = Number(currentPageParam);

  const goToPage = (newPage: number) => {
    router.push(`?page=${newPage}`);
  };

  return (
    <div>
      <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage <= 1}>
        &lt;
      </button>
      <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage >= maxPage}>
        &gt;
      </button>
    </div>
  );
}