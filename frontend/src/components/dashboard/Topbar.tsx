import { useNavigate } from "react-router-dom";
import { getCurrentUser, logout } from "../../api/auth";

interface TopbarProps {
  title: string;
}

export function Topbar({ title }: TopbarProps) {
  const navigate = useNavigate();
  const user = getCurrentUser();

  function handleLogout() {
    logout();
    navigate("/dashboard/login");
  }

  return (
    <header className="flex items-center justify-between border-b border-secondary/10 bg-white px-6 py-4">
      <h1 className="text-lg font-semibold text-secondary">{title}</h1>
      <div className="flex items-center gap-4">
        <span className="text-sm text-secondary-dark/70">{user?.name}</span>
        <button onClick={handleLogout} className="text-sm font-medium text-accent hover:underline">
          Logout
        </button>
      </div>
    </header>
  );
}
