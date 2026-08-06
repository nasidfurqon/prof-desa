import { Link, useParams } from "react-router-dom";
import { useUmkm } from "../../api/umkms";
import { resolveUploadUrl } from "../../api/axios";
import { ErrorState } from "../../components/public/StateViews";
import { SingleLocationMap } from "../../components/public/SingleLocationMap";
import { DetailSkeleton } from "../../components/public/DetailSkeleton";
import { Reveal } from "../../components/motion/Reveal";

export default function UmkmDetail() {
  const { id } = useParams();
  const { data: umkm, isLoading, isError, refetch } = useUmkm(id ? Number(id) : undefined);

  if (isLoading) {
    return <DetailSkeleton />;
  }

  if (isError || !umkm) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12">
        <ErrorState message="UMKM tidak ditemukan." onRetry={refetch} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <Link to="/umkm" className="text-sm font-medium text-accent">
        &larr; Kembali ke UMKM
      </Link>

      {umkm.thumbnail && (
        <Reveal variant="scaleIn">
          <img src={resolveUploadUrl(umkm.thumbnail)} alt={umkm.name} className="mt-4 h-72 w-full rounded-2xl object-cover" />
        </Reveal>
      )}

      <Reveal>
        <h1 className="mt-6 text-2xl font-bold">{umkm.name}</h1>
        <p className="mt-1 text-secondary-dark/60">Pemilik: {umkm.ownerName}</p>
        <p className="mt-4 whitespace-pre-line leading-relaxed text-secondary-dark/80">{umkm.description}</p>
      </Reveal>

      {(umkm.phone || umkm.address) && (
        <Reveal>
          <div className="mt-6 grid gap-2 rounded-xl bg-white p-4 shadow-sm sm:grid-cols-2">
            {umkm.phone && <p><span className="font-medium text-secondary">Nomor HP:</span> {umkm.phone}</p>}
            {umkm.address && <p className="sm:col-span-2"><span className="font-medium text-secondary">Alamat:</span> {umkm.address}</p>}
          </div>
        </Reveal>
      )}

      {umkm.images && umkm.images.length > 0 && (
        <div className="mt-8">
          <Reveal><h2 className="text-lg font-semibold">Galeri</h2></Reveal>
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {umkm.images.map((img, i) => (
              <Reveal key={img.id} variant="scaleIn" delay={(i % 3) * 0.08} className="overflow-hidden rounded-lg">
                <img
                  src={resolveUploadUrl(img.image)}
                  alt={img.caption ?? umkm.name}
                  className="h-32 w-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </Reveal>
            ))}
          </div>
        </div>
      )}

      {umkm.location && (
        <Reveal className="mt-8">
          <h2 className="text-lg font-semibold">Lokasi</h2>
          <div className="mt-3">
            <SingleLocationMap latitude={Number(umkm.location.latitude)} longitude={Number(umkm.location.longitude)} type="UMKM" />
          </div>
        </Reveal>
      )}
    </div>
  );
}
