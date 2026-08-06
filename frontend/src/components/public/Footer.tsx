import { Reveal } from "../motion/Reveal";

export function Footer() {
  return (
    <footer className="bg-secondary-dark text-white/80">
      <Reveal className="mx-auto max-w-6xl px-4 py-8 text-sm">
        <p className="font-heading text-white">Desa Bawu</p>
        <p className="mt-1">Kecamatan Kemusu, Kabupaten Boyolali</p>
        <p className="mt-4 text-xs text-white/60">
          &copy; {new Date().getFullYear()} Pemerintah Desa Bawu. Seluruh hak cipta dilindungi.
        </p>
      </Reveal>
    </footer>
  );
}
