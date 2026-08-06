import { NavLink } from "react-router-dom";

const masterLinks = [
  { to: "/dashboard/users", label: "User" },
  { to: "/dashboard/pages", label: "Website" },
  { to: "/dashboard/organizations", label: "Organisasi" },
  { to: "/dashboard/umkms", label: "UMKM" },
  { to: "/dashboard/schools", label: "Sekolah" },
];

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `block rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
    isActive ? "bg-accent text-white" : "text-white/80 hover:bg-white/10"
  }`;

export function Sidebar() {
  return (
    <aside className="hidden w-64 shrink-0 bg-secondary p-4 text-white md:block">
      <div className="mb-6 px-2 font-heading text-lg font-semibold">Desa Bawu Admin</div>

      <nav className="space-y-1">
        <NavLink to="/dashboard" end className={linkClass}>
          Dashboard
        </NavLink>

        <p className="mt-4 px-3 text-xs font-semibold uppercase tracking-wide text-white/50">Master</p>
        {masterLinks.map((link) => (
          <NavLink key={link.to} to={link.to} className={linkClass}>
            {link.label}
          </NavLink>
        ))}

        <p className="mt-4 px-3 text-xs font-semibold uppercase tracking-wide text-white/50">Transaksi</p>
        <NavLink to="/dashboard/news" className={linkClass}>
          Berita
        </NavLink>

        <p className="mt-4 px-3 text-xs font-semibold uppercase tracking-wide text-white/50">Akun</p>
        <NavLink to="/dashboard/profile" className={linkClass}>
          Profile
        </NavLink>
      </nav>
    </aside>
  );
}
