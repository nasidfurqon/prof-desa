import { Link, useParams } from "react-router-dom";
import { useOrganization } from "../../api/organizations";
import { resolveUploadUrl } from "../../api/axios";
import { ErrorState } from "../../components/public/StateViews";
import { SingleLocationMap } from "../../components/public/SingleLocationMap";
import { DetailSkeleton } from "../../components/public/DetailSkeleton";
import { Reveal } from "../../components/motion/Reveal";

export default function OrganisasiDetail() {
  const { id } = useParams();
  const { data: org, isLoading, isError, refetch } = useOrganization(id ? Number(id) : undefined);

  if (isLoading) {
    return <DetailSkeleton />;
  }

  if (isError || !org) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12">
        <ErrorState message="Organisasi tidak ditemukan." onRetry={refetch} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <Link to="/organisasi" className="text-sm font-medium text-accent">
        &larr; Kembali ke Organisasi
      </Link>

      {org.thumbnail && (
        <Reveal variant="scaleIn">
          <img src={resolveUploadUrl(org.thumbnail)} alt={org.name} className="mt-4 h-72 w-full rounded-2xl object-cover" />
        </Reveal>
      )}

      <Reveal>
        <h1 className="mt-6 text-2xl font-bold">{org.name}</h1>
        <p className="mt-4 whitespace-pre-line leading-relaxed text-secondary-dark/80">{org.description}</p>
      </Reveal>

      {(org.phone || org.email || org.address) && (
        <Reveal>
          <div className="mt-6 grid gap-2 rounded-xl bg-white p-4 shadow-sm sm:grid-cols-2">
            {org.phone && <p><span className="font-medium text-secondary">Telepon:</span> {org.phone}</p>}
            {org.email && <p><span className="font-medium text-secondary">Email:</span> {org.email}</p>}
            {org.address && <p className="sm:col-span-2"><span className="font-medium text-secondary">Alamat:</span> {org.address}</p>}
          </div>
        </Reveal>
      )}

      {org.images && org.images.length > 0 && (
        <div className="mt-8">
          <Reveal><h2 className="text-lg font-semibold">Galeri</h2></Reveal>
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {org.images.map((img, i) => (
              <Reveal key={img.id} variant="scaleIn" delay={(i % 3) * 0.08} className="overflow-hidden rounded-lg">
                <img
                  src={resolveUploadUrl(img.image)}
                  alt={img.caption ?? org.name}
                  className="h-32 w-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </Reveal>
            ))}
          </div>
        </div>
      )}

      {org.location && (
        <Reveal className="mt-8">
          <h2 className="text-lg font-semibold">Lokasi</h2>
          <div className="mt-3">
            <SingleLocationMap latitude={Number(org.location.latitude)} longitude={Number(org.location.longitude)} type="ORGANIZATION" />
          </div>
        </Reveal>
      )}
    </div>
  );
}
