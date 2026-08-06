import { useState } from "react";
import toast from "react-hot-toast";
import { Topbar } from "../../components/dashboard/Topbar";
import { DataTable, Column } from "../../components/dashboard/DataTable";
import { Modal } from "../../components/dashboard/Modal";
import { ConfirmDialog } from "../../components/dashboard/ConfirmDialog";
import { SchoolForm } from "../../components/dashboard/SchoolForm";
import { useCreateSchool, useDeleteSchool, useSchools, useUpdateSchool } from "../../api/schools";
import { School } from "../../api/types";
import { SchoolFormSchema } from "../../lib/schemas";
import { resolveUploadUrl } from "../../api/axios";
import { getErrorMessage } from "../../lib/errors";

function CreateModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const create = useCreateSchool();

  function handleSubmit(values: SchoolFormSchema) {
    create.mutate(values, {
      onSuccess: () => {
        toast.success("Sekolah berhasil ditambahkan");
        onClose();
      },
      onError: (err) => toast.error(getErrorMessage(err, "Gagal menambahkan sekolah")),
    });
  }

  return (
    <Modal open={open} title="Tambah Sekolah" onClose={onClose}>
      <SchoolForm onSubmit={handleSubmit} isSubmitting={create.isPending} />
    </Modal>
  );
}

function EditModal({ school, onClose }: { school: School; onClose: () => void }) {
  const update = useUpdateSchool(school.id);

  function handleSubmit(values: SchoolFormSchema) {
    update.mutate(values, {
      onSuccess: () => {
        toast.success("Sekolah berhasil diperbarui");
        onClose();
      },
      onError: (err) => toast.error(getErrorMessage(err, "Gagal memperbarui sekolah")),
    });
  }

  return (
    <Modal open title="Edit Sekolah" onClose={onClose}>
      <SchoolForm initialValues={school} onSubmit={handleSubmit} isSubmitting={update.isPending} />
    </Modal>
  );
}

export default function Schools() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<string>("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [createOpen, setCreateOpen] = useState(false);
  const [editing, setEditing] = useState<School | null>(null);
  const [deleting, setDeleting] = useState<School | null>(null);

  const { data, isLoading } = useSchools({ page, limit: 10, search: search || undefined, sortBy, sortOrder });
  const deleteMutation = useDeleteSchool();

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
        toast.success("Sekolah berhasil dihapus");
        setDeleting(null);
      },
      onError: (err) => toast.error(getErrorMessage(err, "Gagal menghapus sekolah")),
    });
  }

  const columns: Column<School>[] = [
    {
      key: "thumbnail",
      header: "Foto",
      render: (row) =>
        row.thumbnail ? (
          <img src={resolveUploadUrl(row.thumbnail)} alt={row.name} className="h-10 w-10 rounded-lg object-cover" />
        ) : (
          <div className="h-10 w-10 rounded-lg bg-secondary/10" />
        ),
    },
    { key: "name", header: "Nama", sortable: true, render: (row) => row.name },
    { key: "level", header: "Tingkatan", render: (row) => row.level },
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
      <Topbar title="Sekolah" />
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
          createLabel="Tambah Sekolah"
        />
      </div>

      <CreateModal open={createOpen} onClose={() => setCreateOpen(false)} />
      {editing && <EditModal school={editing} onClose={() => setEditing(null)} />}
      <ConfirmDialog
        open={Boolean(deleting)}
        title="Hapus Sekolah"
        description={`Yakin ingin menghapus "${deleting?.name}"? Tindakan ini tidak dapat dibatalkan.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleting(null)}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
