import { Link, useParams } from "react-router-dom";
import { useNewsBySlug } from "../../api/news";
import { resolveUploadUrl } from "../../api/axios";
import { ErrorState } from "../../components/public/StateViews";
import { DetailSkeleton } from "../../components/public/DetailSkeleton";
import { Reveal } from "../../components/motion/Reveal";

export default function BeritaDetail() {
  const { slug } = useParams();
  const { data: news, isLoading, isError, refetch } = useNewsBySlug(slug);

  if (isLoading) {
    return <DetailSkeleton maxWidth="max-w-3xl" />;
  }

  if (isError || !news) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12">
        <ErrorState message="Berita tidak ditemukan." onRetry={refetch} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <Link to="/berita" className="text-sm font-medium text-accent">
        &larr; Kembali ke Berita
      </Link>

      {news.thumbnail && (
        <Reveal variant="scaleIn">
          <img src={resolveUploadUrl(news.thumbnail)} alt={news.title} className="mt-4 h-72 w-full rounded-2xl object-cover" />
        </Reveal>
      )}

      <Reveal>
        {news.publishedAt && (
          <p className="mt-6 text-sm font-medium text-accent">
            {new Date(news.publishedAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
          </p>
        )}
        <h1 className="mt-1 text-2xl font-bold">{news.title}</h1>
        <p className="mt-4 whitespace-pre-line leading-relaxed text-secondary-dark/80">{news.content}</p>
      </Reveal>

      {news.images && news.images.length > 0 && (
        <div className="mt-8">
          <Reveal><h2 className="text-lg font-semibold">Galeri</h2></Reveal>
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {news.images.map((img, i) => (
              <Reveal key={img.id} variant="scaleIn" delay={(i % 3) * 0.08} className="overflow-hidden rounded-lg">
                <img
                  src={resolveUploadUrl(img.image)}
                  alt={img.caption ?? news.title}
                  className="h-32 w-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </Reveal>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
