interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="mt-8 flex items-center justify-center gap-2">
      <button
        className="rounded-lg border border-secondary/20 px-3 py-1.5 text-sm text-secondary disabled:opacity-40"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
      >
        Sebelumnya
      </button>
      <span className="text-sm text-secondary/70">
        Halaman {page} dari {totalPages}
      </span>
      <button
        className="rounded-lg border border-secondary/20 px-3 py-1.5 text-sm text-secondary disabled:opacity-40"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        Berikutnya
      </button>
    </div>
  );
}
