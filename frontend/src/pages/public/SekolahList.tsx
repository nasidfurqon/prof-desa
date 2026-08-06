import { useState } from "react";
import { useSchools } from "../../api/schools";
import { EntityCard } from "../../components/public/EntityCard";
import { CardSkeletonGrid } from "../../components/public/Skeleton";
import { EmptyState, ErrorState } from "../../components/public/StateViews";
import { Pagination } from "../../components/public/Pagination";
import { Reveal } from "../../components/motion/Reveal";

export default function SekolahList() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, refetch } = useSchools({ page, limit: 9 });

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <Reveal>
        <h1 className="text-2xl font-bold">Sekolah di Desa Bawu</h1>
        <p className="mt-2 text-secondary-dark/70">Daftar sekolah yang berada di wilayah Desa Bawu.</p>
      </Reveal>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 md:grid-cols-3">
        {isLoading && <CardSkeletonGrid count={6} />}
        {isError && <ErrorState onRetry={refetch} />}
        {!isLoading && !isError && data?.data.length === 0 && <EmptyState />}
        {!isLoading &&
          data?.data.map((school, i) => (
            <Reveal key={school.id} delay={(i % 3) * 0.08}>
              <EntityCard to={`/sekolah/${school.id}`} thumbnail={school.thumbnail} title={school.name} subtitle={school.level} />
            </Reveal>
          ))}
      </div>

      {data && <Pagination page={page} totalPages={data.meta.totalPages} onPageChange={setPage} />}
    </div>
  );
}
