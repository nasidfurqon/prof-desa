import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

const links = [
  { to: "/", label: "Home" },
  { to: "/sejarah", label: "Sejarah" },
  { to: "/organisasi", label: "Organisasi" },
  { to: "/umkm", label: "UMKM" },
  { to: "/sekolah", label: "Sekolah" },
  { to: "/berita", label: "Berita" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 10);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled ? "bg-secondary shadow-md" : "bg-secondary/90 shadow-none"
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <NavLink to="/" className="font-heading text-lg font-semibold text-white">
          Desa Bawu
        </NavLink>
        <ul className="hidden gap-6 md:flex">
          {links.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                end={link.to === "/"}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors ${
                    isActive ? "text-accent" : "text-white/85 hover:text-accent"
                  }`
                }
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <ul className="flex gap-4 overflow-x-auto border-t border-white/10 px-4 py-2 md:hidden">
        {links.map((link) => (
          <li key={link.to} className="shrink-0">
            <NavLink
              to={link.to}
              end={link.to === "/"}
              className={({ isActive }) =>
                `text-sm font-medium transition-colors ${isActive ? "text-accent" : "text-white/85"}`
              }
            >
              {link.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </header>
  );
}
