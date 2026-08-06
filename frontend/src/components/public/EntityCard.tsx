import { Link } from "react-router-dom";
import { resolveUploadUrl } from "../../api/axios";

interface EntityCardProps {
  to: string;
  thumbnail?: string | null;
  title: string;
  subtitle?: string;
}

export function EntityCard({ to, thumbnail, title, subtitle }: EntityCardProps) {
  return (
    <Link to={to} className="card group block">
      <div className="relative h-48 w-full overflow-hidden bg-secondary/5">
        {thumbnail ? (
          <>
            <img
              src={resolveUploadUrl(thumbnail)}
              alt={title}
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
        <h3 className="text-base font-semibold text-secondary">{title}</h3>
        {subtitle && <p className="mt-1 text-sm text-secondary/60">{subtitle}</p>}
      </div>
    </Link>
  );
}
