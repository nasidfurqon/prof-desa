import { useState } from "react";
import toast from "react-hot-toast";
import { Topbar } from "../../components/dashboard/Topbar";
import { DataTable, Column } from "../../components/dashboard/DataTable";
import { Modal } from "../../components/dashboard/Modal";
import { ConfirmDialog } from "../../components/dashboard/ConfirmDialog";
import { NewsForm } from "../../components/dashboard/NewsForm";
import { useCreateNews, useDeleteNews, useNewsList, useUpdateNews } from "../../api/news";
import { News as NewsItem } from "../../api/types";
import { NewsFormSchema } from "../../lib/schemas";
import { resolveUploadUrl } from "../../api/axios";
import { getErrorMessage } from "../../lib/errors";

function CreateModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const create = useCreateNews();

  function handleSubmit(values: NewsFormSchema) {
    create.mutate(values, {
      onSuccess: () => {
        toast.success("Berita berhasil ditambahkan");
        onClose();
      },
      onError: (err) => toast.error(getErrorMessage(err, "Gagal menambahkan berita")),
    });
  }

  return (
    <Modal open={open} title="Tambah Berita" onClose={onClose}>
      <NewsForm onSubmit={handleSubmit} isSubmitting={create.isPending} />
    </Modal>
  );
}

function EditModal({ news, onClose }: { news: NewsItem; onClose: () => void }) {
  const update = useUpdateNews(news.id);

  function handleSubmit(values: NewsFormSchema) {
    update.mutate(values, {
      onSuccess: () => {
        toast.success("Berita berhasil diperbarui");
        onClose();
      },
      onError: (err) => toast.error(getErrorMessage(err, "Gagal memperbarui berita")),
    });
  }

  return (
    <Modal open title="Edit Berita" onClose={onClose}>
      <NewsForm initialValues={news} onSubmit={handleSubmit} isSubmitting={update.isPending} />
    </Modal>
  );
}

export default function News() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<string>("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [createOpen, setCreateOpen] = useState(false);
  const [editing, setEditing] = useState<NewsItem | null>(null);
  const [deleting, setDeleting] = useState<NewsItem | null>(null);

  const { data, isLoading } = useNewsList({ page, limit: 10, search: search || undefined, sortBy, sortOrder });
  const deleteMutation = useDeleteNews();

  function handleSort(key: string) {
    if (sortBy === key) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(key);
      setSortOrder("asc");
    }
  }

  function handleDelete() {
    if (!deleting) return;
    deleteMutation.mutate(deleting.id, {
      onSuccess: () => {
        toast.success("Berita berhasil dihapus");
        setDeleting(null);
      },
      onError: (err) => toast.error(getErrorMessage(err, "Gagal menghapus berita")),
    });
  }

  const columns: Column<NewsItem>[] = [
    {
      key: "thumbnail",
      header: "Foto",
      render: (row) =>
        row.thumbnail ? (
          <img src={resolveUploadUrl(row.thumbnail)} alt={row.title} className="h-10 w-10 rounded-lg object-cover" />
        ) : (
          <div className="h-10 w-10 rounded-lg bg-secondary/10" />
        ),
    },
    { key: "title", header: "Judul", sortable: true, render: (row) => row.title },
    {
      key: "publishedAt",
      header: "Tanggal Publish",
      sortable: true,
      render: (row) => (row.publishedAt ? new Date(row.publishedAt).toLocaleDateString("id-ID") : "-"),
    },
    {
      key: "actions",
      header: "Aksi",
      render: (row) => (
        <div className="flex gap-3">
          <button onClick={() => setEditing(row)} className="text-sm font-medium text-accent">
            Edit
          </button>
          <button onClick={() => setDeleting(row)} className="text-sm font-medium text-red-600">
            Hapus
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <Topbar title="Berita" />
      <div className="p-6">
        <DataTable
          columns={columns}
          rows={data?.data ?? []}
          rowKey={(row) => row.id}
          isLoading={isLoading}
          search={search}
          onSearchChange={(value) => {
            setSearch(value);
            setPage(1);
          }}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSortChange={handleSort}
          page={page}
          totalPages={data?.meta.totalPages ?? 1}
          onPageChange={setPage}
          onCreate={() => setCreateOpen(true)}
          createLabel="Tambah Berita"
        />
      </div>

      <CreateModal open={createOpen} onClose={() => setCreateOpen(false)} />
      {editing && <EditModal news={editing} onClose={() => setEditing(null)} />}
      <ConfirmDialog
        open={Boolean(deleting)}
        title="Hapus Berita"
        description={`Yakin ingin menghapus "${deleting?.title}"? Tindakan ini tidak dapat dibatalkan.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleting(null)}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
