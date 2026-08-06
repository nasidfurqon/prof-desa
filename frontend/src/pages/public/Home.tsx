import { Link } from "react-router-dom";
import { usePages, usePageContent } from "../../api/pages";
import { useOrganizations } from "../../api/organizations";
import { useUmkms } from "../../api/umkms";
import { useSchools } from "../../api/schools";
import { useNewsList } from "../../api/news";
import { MapView } from "../../components/public/MapView";
import { EntityCard } from "../../components/public/EntityCard";
import { CardSkeletonGrid } from "../../components/public/Skeleton";
import { EmptyState, ErrorState } from "../../components/public/StateViews";
import { resolveUploadUrl } from "../../api/axios";
import { Reveal } from "../../components/motion/Reveal";
import { ExploreCarousel, ExploreItem } from "../../components/public/ExploreCarousel";
import { StatsSection } from "../../components/public/StatsSection";

export default function Home() {
  const { data: pages, isLoading: pagesLoading } = usePages();
  const visi = usePageContent(pages, "HOME_VISI");
  const misi = usePageContent(pages, "HOME_MISI");
  const sejarah = usePageContent(pages, "SEJARAH");
  const { data: orgData, isLoading: orgLoading, isError: orgError, refetch: refetchOrg } = useOrganizations({ limit: 3 });
  const { data: umkmData, isLoading: umkmLoading, isError: umkmError, refetch: refetchUmkm } = useUmkms({ limit: 3 });
  const { data: schoolData } = useSchools({ limit: 3 });
  const {
    data: newsData,
    isLoading: newsLoading,
    isError: newsError,
    refetch: refetchNews,
  } = useNewsList({
    limit: 3,
    sortBy: "publishedAt",
    sortOrder: "desc",
  });

  const exploreItems: ExploreItem[] = [
    ...(orgData?.data.map((org) => ({
      id: `org-${org.id}`,
      to: `/organisasi/${org.id}`,
      title: org.name,
      category: "Organisasi",
      thumbnail: org.thumbnail,
    })) ?? []),
    ...(umkmData?.data.map((umkm) => ({
      id: `umkm-${umkm.id}`,
      to: `/umkm/${umkm.id}`,
      title: umkm.name,
      category: "UMKM",
      thumbnail: umkm.thumbnail,
    })) ?? []),
    ...(schoolData?.data.map((school) => ({
      id: `school-${school.id}`,
      to: `/sekolah/${school.id}`,
      title: school.name,
      category: "Sekolah",
      thumbnail: school.thumbnail,
    })) ?? []),
    ...(newsData?.data.map((item) => ({
      id: `news-${item.id}`,
      to: `/berita/${item.slug}`,
      title: item.title,
      category: "Berita",
      thumbnail: item.thumbnail,
    })) ?? []),
  ];

  const stats = [
    { label: "Organisasi", value: orgData?.meta.total ?? 0 },
    { label: "UMKM", value: umkmData?.meta.total ?? 0 },
    { label: "Sekolah", value: schoolData?.meta.total ?? 0 },
    { label: "Berita", value: newsData?.meta.total ?? 0 },
  ];

  return (
    <div>
      <section className="bg-secondary py-20 text-center text-white">
        <div className="mx-auto max-w-3xl px-4">
          <h1 className="text-3xl font-bold sm:text-4xl text-white">Selamat Datang di Desa Bawu</h1>
          <p className="mt-4 text-white">Kecamatan Kemusu, Kabupaten Boyolali</p>
          <Link to="/sejarah" className="btn-primary mt-8">
            Kenali Desa Kami
          </Link>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-4 py-12 md:grid-cols-2">
        <Reveal variant="fadeLeft" className="card p-6">
          <h2 className="text-xl font-semibold">Visi</h2>
          {pagesLoading ? (
            <div className="skeleton mt-3 h-16 w-full" />
          ) : (
            <p className="mt-3 whitespace-pre-line text-secondary-dark/80">{visi?.content ?? "Belum tersedia."}</p>
          )}
        </Reveal>
        <Reveal variant="fadeRight" className="card p-6">
          <h2 className="text-xl font-semibold">Misi</h2>
          {pagesLoading ? (
            <div className="skeleton mt-3 h-16 w-full" />
          ) : (
            <p className="mt-3 whitespace-pre-line text-secondary-dark/80">{misi?.content ?? "Belum tersedia."}</p>
          )}
        </Reveal>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <Reveal>
          <h2 className="text-xl font-semibold">Ringkasan Sejarah</h2>
          {pagesLoading ? (
            <div className="skeleton mt-3 h-16 w-full" />
          ) : (
            <p className="mt-3 line-clamp-4 whitespace-pre-line text-secondary-dark/80">{sejarah?.content ?? "Belum tersedia."}</p>
          )}
          <Link to="/sejarah" className="mt-3 inline-block text-sm font-medium text-accent">
            Baca Selengkapnya &rarr;
          </Link>
        </Reveal>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <Reveal>
          <h2 className="mb-6 text-xl font-semibold">Statistik Desa</h2>
        </Reveal>
        <StatsSection stats={stats} />
      </section>
{/* 
      {exploreItems.length > 0 && (
        <section className="bg-white py-12">
          <div className="mx-auto max-w-6xl px-4">
            <Reveal>
              <h2 className="mb-2 text-xl font-semibold">Jelajahi Desa Bawu</h2>
              <p className="mb-2 text-sm text-secondary-dark/60">Sekilas organisasi, UMKM, sekolah, dan berita di Desa Bawu.</p>
            </Reveal>
          </div>
          <ExploreCarousel items={exploreItems} />
        </section>
      )} */}

      <section className="mx-auto max-w-6xl px-4 py-12">
        <Reveal>
          <h2 className="mb-6 text-xl font-semibold">Peta Desa</h2>
        </Reveal>
        <Reveal variant="scaleIn" delay={0.1}>
          <MapView />
        </Reveal>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <Reveal className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Organisasi Desa</h2>
          <Link to="/organisasi" className="text-sm font-medium text-accent">
            Lihat Semua &rarr;
          </Link>
        </Reveal>
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          {orgLoading && <CardSkeletonGrid count={3} />}
          {orgError && <ErrorState onRetry={refetchOrg} />}
          {!orgLoading && !orgError && orgData?.data.length === 0 && <EmptyState />}
          {!orgLoading &&
            orgData?.data.map((org, i) => (
              <Reveal key={org.id} delay={i * 0.08}>
                <EntityCard to={`/organisasi/${org.id}`} thumbnail={org.thumbnail} title={org.name} subtitle={org.description} />
              </Reveal>
            ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <Reveal className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold">UMKM Desa</h2>
          <Link to="/umkm" className="text-sm font-medium text-accent">
            Lihat Semua &rarr;
          </Link>
        </Reveal>
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          {umkmLoading && <CardSkeletonGrid count={3} />}
          {umkmError && <ErrorState onRetry={refetchUmkm} />}
          {!umkmLoading && !umkmError && umkmData?.data.length === 0 && <EmptyState />}
          {!umkmLoading &&
            umkmData?.data.map((umkm, i) => (
              <Reveal key={umkm.id} delay={i * 0.08}>
                <EntityCard to={`/umkm/${umkm.id}`} thumbnail={umkm.thumbnail} title={umkm.name} subtitle={umkm.ownerName} />
              </Reveal>
            ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <Reveal className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Berita Terbaru</h2>
          <Link to="/berita" className="text-sm font-medium text-accent">
            Lihat Semua &rarr;
          </Link>
        </Reveal>
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          {newsLoading && <CardSkeletonGrid count={3} />}
          {newsError && <ErrorState onRetry={refetchNews} />}
          {!newsLoading && !newsError && newsData?.data.length === 0 && <EmptyState />}
          {!newsLoading &&
            newsData?.data.map((item, i) => (
              <Reveal key={item.id} delay={i * 0.08}>
                <Link to={`/berita/${item.slug}`} className="card group block">
                  <div className="relative h-40 w-full overflow-hidden bg-secondary/5">
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
                  <div className="p-4">
                    {item.publishedAt && (
                      <p className="text-xs font-medium text-accent">{new Date(item.publishedAt).toLocaleDateString("id-ID")}</p>
                    )}
                    <h3 className="mt-1 text-base font-semibold text-secondary">{item.title}</h3>
                    <p className="mt-1 line-clamp-2 text-sm text-secondary-dark/70">{item.summary}</p>
                  </div>
                </Link>
              </Reveal>
            ))}
        </div>
      </section>
    </div>
  );
}
