import { Routes, Route } from "react-router-dom";
import { PublicLayout } from "./components/public/PublicLayout";
import { DashboardLayout } from "./components/dashboard/DashboardLayout";
import { ProtectedRoute } from "./components/dashboard/ProtectedRoute";
import Home from "./pages/public/Home";
import Sejarah from "./pages/public/Sejarah";
import OrganisasiList from "./pages/public/OrganisasiList";
import OrganisasiDetail from "./pages/public/OrganisasiDetail";
import UmkmList from "./pages/public/UmkmList";
import UmkmDetail from "./pages/public/UmkmDetail";
import SekolahList from "./pages/public/SekolahList";
import SekolahDetail from "./pages/public/SekolahDetail";
import BeritaList from "./pages/public/BeritaList";
import BeritaDetail from "./pages/public/BeritaDetail";
import Login from "./pages/dashboard/Login";
import DashboardHome from "./pages/dashboard/DashboardHome";
import Organizations from "./pages/dashboard/Organizations";
import Umkms from "./pages/dashboard/Umkms";
import Schools from "./pages/dashboard/Schools";
import News from "./pages/dashboard/News";
import Users from "./pages/dashboard/Users";
import WebsitePages from "./pages/dashboard/WebsitePages";
import Profile from "./pages/dashboard/Profile";

export default function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/sejarah" element={<Sejarah />} />
        <Route path="/organisasi" element={<OrganisasiList />} />
        <Route path="/organisasi/:id" element={<OrganisasiDetail />} />
        <Route path="/umkm" element={<UmkmList />} />
        <Route path="/umkm/:id" element={<UmkmDetail />} />
        <Route path="/sekolah" element={<SekolahList />} />
        <Route path="/sekolah/:id" element={<SekolahDetail />} />
        <Route path="/berita" element={<BeritaList />} />
        <Route path="/berita/:slug" element={<BeritaDetail />} />
      </Route>

      <Route path="/dashboard/login" element={<Login />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardHome />} />
          <Route path="organizations" element={<Organizations />} />
          <Route path="users" element={<Users />} />
          <Route path="pages" element={<WebsitePages />} />
          <Route path="umkms" element={<Umkms />} />
          <Route path="schools" element={<Schools />} />
          <Route path="news" element={<News />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Route>
    </Routes>
  );
}
