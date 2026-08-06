import { ReactNode } from "react";
import { Pagination } from "../public/Pagination";

export interface Column<T> {
  key: string;
  header: string;
  sortable?: boolean;
  render: (row: T) => ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string | number;
  isLoading?: boolean;
  search: string;
  onSearchChange: (value: string) => void;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  onSortChange?: (key: string) => void;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onCreate?: () => void;
  createLabel?: string;
}

export function DataTable<T>({
  columns,
  rows,
  rowKey,
  isLoading,
  search,
  onSearchChange,
  sortBy,
  sortOrder,
  onSortChange,
  page,
  totalPages,
  onPageChange,
  onCreate,
  createLabel = "Tambah",
}: DataTableProps<T>) {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Cari..."
          className="w-full max-w-xs rounded-lg border border-secondary/20 px-3 py-2 text-sm focus:border-accent focus:outline-none"
        />
        {onCreate && (
          <button onClick={onCreate} className="btn-primary">
            {createLabel}
          </button>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-secondary/10 text-secondary-dark/60">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`px-3 py-2 font-medium ${col.sortable ? "cursor-pointer select-none" : ""}`}
                  onClick={() => col.sortable && onSortChange?.(col.key)}
                >
                  {col.header}
                  {col.sortable && sortBy === col.key && (sortOrder === "asc" ? " ▲" : " ▼")}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading &&
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b border-secondary/5">
                  {columns.map((col) => (
                    <td key={col.key} className="px-3 py-3">
                      <div className="skeleton h-4 w-full" />
                    </td>
                  ))}
                </tr>
              ))}
            {!isLoading && rows.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="px-3 py-8 text-center text-secondary-dark/50">
                  Tidak ada data.
                </td>
              </tr>
            )}
            {!isLoading &&
              rows.map((row) => (
                <tr key={rowKey(row)} className="border-b border-secondary/5 hover:bg-primary/60">
                  {columns.map((col) => (
                    <td key={col.key} className="px-3 py-3">
                      {col.render(row)}
                    </td>
                  ))}
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <Pagination page={page} totalPages={totalPages} onPageChange={onPageChange} />
    </div>
  );
}
