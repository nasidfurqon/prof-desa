import { ReactNode } from "react";
import { Topbar } from "../../components/dashboard/Topbar";
import { useOrganizations } from "../../api/organizations";
import { useUmkms } from "../../api/umkms";
import { useSchools } from "../../api/schools";
import { useNewsList } from "../../api/news";
import { useUsers } from "../../api/users";

// Fixed-order categorical palette (validated for adjacent CVD separation) — see dataviz skill.
const STAT_COLORS = {
  blue: "#2a78d6",
  orange: "#eb6834",
  aqua: "#1baf7a",
  yellow: "#eda100",
  magenta: "#e87ba4",
};

function BuildingIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="3" width="9" height="14" rx="1" />
      <path d="M13 8h3v9h-3M7 6.5h.01M10 6.5h.01M7 9.5h.01M10 9.5h.01M7 12.5h.01M10 12.5h.01" />
    </svg>
  );
}

function StoreIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 7l1-4h12l1 4M3 7v9h14V7M3 7h14M8 16v-4h4v4" />
    </svg>
  );
}

function GraduationCapIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 7l8-3.5L18 7l-8 3.5L2 7z" />
      <path d="M5.5 9v4c0 1.1 2 2 4.5 2s4.5-.9 4.5-2V9M18 7v5" />
    </svg>
  );
}

function NewspaperIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2.5" y="4" width="12" height="12" rx="1" />
      <path d="M5 7.5h6M5 10h6M5 12.5h4M14.5 6.5H17a.5.5 0 01.5.5v8a1.5 1.5 0 01-1.5 1.5H5" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="7.5" cy="6.5" r="2.5" />
      <path d="M2.5 17c0-2.76 2.24-5 5-5s5 2.24 5 5" />
      <path d="M13 4.2c1.16.4 2 1.5 2 2.8s-.84 2.4-2 2.8M15.5 12.2c1.74.6 3 2.24 3 4.8" />
    </svg>
  );
}

interface StatCardProps {
  label: string;
  value: number | undefined;
  isLoading: boolean;
  color: string;
  icon: ReactNode;
}

function StatCard({ label, value, isLoading, color, icon }: StatCardProps) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <div
        className="flex h-10 w-10 items-center justify-center rounded-xl"
        style={{ backgroundColor: `${color}1f`, color }}
      >
        {icon}
      </div>
      <p className="mt-3 text-sm text-secondary-dark/60">{label}</p>
      {isLoading ? (
        <div className="skeleton mt-2 h-8 w-16" />
      ) : (
        <p className="mt-1 text-2xl font-bold text-secondary">{value ?? "-"}</p>
      )}
    </div>
  );
}

export default function DashboardHome() {
  const { data: orgData, isLoading: orgLoading } = useOrganizations({ limit: 1 });
  const { data: umkmData, isLoading: umkmLoading } = useUmkms({ limit: 1 });
  const { data: schoolData, isLoading: schoolLoading } = useSchools({ limit: 1 });
  const { data: newsData, isLoading: newsLoading } = useNewsList({ limit: 1 });
  const { data: userData, isLoading: userLoading } = useUsers({ limit: 1 });

  return (
    <div>
      <Topbar title="Dashboard" />
      <div className="p-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <StatCard label="Total Organisasi" value={orgData?.meta.total} isLoading={orgLoading} color={STAT_COLORS.blue} icon={<BuildingIcon />} />
          <StatCard label="Total UMKM" value={umkmData?.meta.total} isLoading={umkmLoading} color={STAT_COLORS.orange} icon={<StoreIcon />} />
          <StatCard label="Total Sekolah" value={schoolData?.meta.total} isLoading={schoolLoading} color={STAT_COLORS.aqua} icon={<GraduationCapIcon />} />
          <StatCard label="Total Berita" value={newsData?.meta.total} isLoading={newsLoading} color={STAT_COLORS.yellow} icon={<NewspaperIcon />} />
          <StatCard label="Total Pengguna" value={userData?.meta.total} isLoading={userLoading} color={STAT_COLORS.magenta} icon={<UsersIcon />} />
        </div>
        <p className="mt-6 text-sm text-secondary-dark/60">
          Selamat datang di Dashboard Admin Desa Bawu. Gunakan menu di samping untuk mengelola konten website.
        </p>
      </div>
    </div>
  );
}
