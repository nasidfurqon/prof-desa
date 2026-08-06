import { useState } from "react";
import { Link } from "react-router-dom";
import { useNewsList } from "../../api/news";
import { resolveUploadUrl } from "../../api/axios";
import { EmptyState, ErrorState } from "../../components/public/StateViews";
import { Pagination } from "../../components/public/Pagination";
import { Reveal } from "../../components/motion/Reveal";

export default function BeritaList() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, refetch } = useNewsList({ page, limit: 6, sortBy: "publishedAt", sortOrder: "desc" });

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <Reveal>
        <h1 className="text-2xl font-bold">Berita Desa Bawu</h1>
        <p className="mt-2 text-secondary-dark/70">Informasi dan kegiatan terbaru dari Desa Bawu.</p>
      </Reveal>

      <div className="mt-8 space-y-5">
        {isLoading &&
          Array.from({ length: 3 }).map((_, i) => <div key={i} className="skeleton h-40 w-full" />)}
        {isError && <ErrorState onRetry={refetch} />}
        {!isLoading && !isError && data?.data.length === 0 && <EmptyState />}
        {!isLoading &&
          data?.data.map((item, i) => (
            <Reveal key={item.id} delay={(i % 6) * 0.06}>
              <Link to={`/berita/${item.slug}`} className="card group flex flex-col gap-4 p-4 sm:flex-row">
                <div className="relative h-40 w-full shrink-0 overflow-hidden rounded-xl bg-secondary/5 sm:w-56">
                  {item.thumbnail ? (
                    <>
                      <img
                        src={resolveUploadUrl(item.thumbnail)}
                        alt={item.title}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105 group-hover:brightness-95"
                      />
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    </>
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-secondary/30">Tidak ada foto</div>
                  )}
                </div>
                <div>
                  {item.publishedAt && (
                    <p className="text-xs font-medium text-accent">
                      {new Date(item.publishedAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                    </p>
                  )}
                  <h2 className="mt-1 text-lg font-semibold text-secondary">{item.title}</h2>
                  <p className="mt-2 line-clamp-2 text-sm text-secondary-dark/70">{item.summary}</p>
                </div>
              </Link>
            </Reveal>
          ))}
      </div>

      {data && <Pagination page={page} totalPages={data.meta.totalPages} onPageChange={setPage} />}
    </div>
  );
}
