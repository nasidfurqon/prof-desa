function EmptyIllustration() {
  return (
    <svg width="72" height="72" viewBox="0 0 72 72" fill="none" className="text-secondary/25">
      <rect x="12" y="20" width="48" height="36" rx="4" stroke="currentColor" strokeWidth="2.5" />
      <path d="M12 44l14-12 10 8 10-10 14 14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="26" cy="30" r="3.5" stroke="currentColor" strokeWidth="2.5" />
    </svg>
  );
}

function ErrorIllustration() {
  return (
    <svg width="72" height="72" viewBox="0 0 72 72" fill="none" className="text-red-300">
      <circle cx="36" cy="36" r="24" stroke="currentColor" strokeWidth="2.5" />
      <path d="M36 26v14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="36" cy="46" r="1.5" fill="currentColor" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

export function EmptyState({ message = "Belum ada data yang tersedia." }: { message?: string }) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-secondary/20 py-16 text-center text-secondary/60">
      <EmptyIllustration />
      <p>{message}</p>
    </div>
  );
}

export function ErrorState({
  message = "Terjadi kesalahan saat memuat data.",
  onRetry,
}: {
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-red-300 bg-red-50 py-16 text-center text-red-600">
      <ErrorIllustration />
      <p>{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="rounded-lg border border-red-300 px-4 py-1.5 text-sm font-medium text-red-600 transition-all duration-150 hover:bg-red-100 hover:scale-[1.03] active:scale-95"
        >
          Coba Lagi
        </button>
      )}
    </div>
  );
}
