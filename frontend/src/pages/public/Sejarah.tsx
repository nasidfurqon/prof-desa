import { usePages, usePageContent } from "../../api/pages";
import { ErrorState } from "../../components/public/StateViews";
import { Reveal } from "../../components/motion/Reveal";

export default function Sejarah() {
  const { data: pages, isLoading, isError, refetch } = usePages();
  const sejarah = usePageContent(pages, "SEJARAH");

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <Reveal>
        <h1 className="text-2xl font-bold">Sejarah Desa Bawu</h1>
      </Reveal>
      {isLoading && <div className="skeleton mt-6 h-64 w-full" />}
      {isError && <ErrorState onRetry={refetch} />}
      {!isLoading && !isError && (
        <Reveal delay={0.1}>
          <p className="mt-6 whitespace-pre-line leading-relaxed text-secondary-dark/80">
            {sejarah?.content ?? "Konten sejarah belum tersedia."}
          </p>
        </Reveal>
      )}
    </div>
  );
}
