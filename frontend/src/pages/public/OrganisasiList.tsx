import { useState } from "react";
import { useOrganizations } from "../../api/organizations";
import { EntityCard } from "../../components/public/EntityCard";
import { CardSkeletonGrid } from "../../components/public/Skeleton";
import { EmptyState, ErrorState } from "../../components/public/StateViews";
import { Pagination } from "../../components/public/Pagination";
import { Reveal } from "../../components/motion/Reveal";

export default function OrganisasiList() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, refetch } = useOrganizations({ page, limit: 9 });

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <Reveal>
        <h1 className="text-2xl font-bold">Organisasi Desa</h1>
        <p className="mt-2 text-secondary-dark/70">Karang Taruna, PKK, Kelompok Tani, dan organisasi masyarakat lainnya.</p>
      </Reveal>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 md:grid-cols-3">
        {isLoading && <CardSkeletonGrid count={6} />}
        {isError && <ErrorState onRetry={refetch} />}
        {!isLoading && !isError && data?.data.length === 0 && <EmptyState />}
        {!isLoading &&
          data?.data.map((org, i) => (
            <Reveal key={org.id} delay={(i % 3) * 0.08}>
              <EntityCard to={`/organisasi/${org.id}`} thumbnail={org.thumbnail} title={org.name} subtitle={org.description} />
            </Reveal>
          ))}
      </div>

      {data && <Pagination page={page} totalPages={data.meta.totalPages} onPageChange={setPage} />}
    </div>
  );
}
