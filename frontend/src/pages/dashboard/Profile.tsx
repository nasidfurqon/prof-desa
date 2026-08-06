import { Topbar } from "../../components/dashboard/Topbar";
import { getCurrentUser } from "../../api/auth";

export default function Profile() {
  const user = getCurrentUser();

  return (
    <div>
      <Topbar title="Profile" />
      <div className="p-6">
        <div className="max-w-md rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-sm text-secondary-dark/60">Nama</p>
          <p className="font-medium text-secondary">{user?.name}</p>
          <p className="mt-4 text-sm text-secondary-dark/60">Email</p>
          <p className="font-medium text-secondary">{user?.email}</p>
        </div>
      </div>
    </div>
  );
}
