import { useState } from "react";
import toast from "react-hot-toast";
import { Topbar } from "../../components/dashboard/Topbar";
import { DataTable, Column } from "../../components/dashboard/DataTable";
import { Modal } from "../../components/dashboard/Modal";
import { ConfirmDialog } from "../../components/dashboard/ConfirmDialog";
import { UserForm } from "../../components/dashboard/UserForm";
import { useCreateUser, useDeleteUser, useUpdateUser, useUsers } from "../../api/users";
import { User } from "../../api/types";
import { UserFormSchema } from "../../lib/schemas";
import { getErrorMessage } from "../../lib/errors";

function CreateModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const create = useCreateUser();

  function handleSubmit(values: UserFormSchema) {
    if (!values.password) {
      toast.error("Password wajib diisi untuk user baru");
      return;
    }
    create.mutate(values, {
      onSuccess: () => {
        toast.success("User berhasil ditambahkan");
        onClose();
      },
      onError: (err) => toast.error(getErrorMessage(err, "Gagal menambahkan user")),
    });
  }

  return (
    <Modal open={open} title="Tambah User" onClose={onClose}>
      <UserForm onSubmit={handleSubmit} isSubmitting={create.isPending} />
    </Modal>
  );
}

function EditModal({ user, onClose }: { user: User; onClose: () => void }) {
  const update = useUpdateUser(user.id);

  function handleSubmit(values: UserFormSchema) {
    update.mutate(values, {
      onSuccess: () => {
        toast.success("User berhasil diperbarui");
        onClose();
      },
      onError: (err) => toast.error(getErrorMessage(err, "Gagal memperbarui user")),
    });
  }

  return (
    <Modal open title="Edit User" onClose={onClose}>
      <UserForm initialValues={user} onSubmit={handleSubmit} isSubmitting={update.isPending} />
    </Modal>
  );
}

export default function Users() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<string>("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [createOpen, setCreateOpen] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);
  const [deleting, setDeleting] = useState<User | null>(null);

  const { data, isLoading } = useUsers({ page, limit: 10, search: search || undefined, sortBy, sortOrder });
  const deleteMutation = useDeleteUser();

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
        toast.success("User berhasil dihapus");
        setDeleting(null);
      },
      onError: (err) => toast.error(getErrorMessage(err, "Gagal menghapus user")),
    });
  }

  const columns: Column<User>[] = [
    { key: "name", header: "Nama", sortable: true, render: (row) => row.name },
    { key: "email", header: "Email", sortable: true, render: (row) => row.email },
    {
      key: "isActive",
      header: "Status",
      render: (row) => (
        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${row.isActive ? "bg-secondary/10 text-secondary" : "bg-red-100 text-red-600"}`}>
          {row.isActive ? "Aktif" : "Nonaktif"}
        </span>
      ),
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
      <Topbar title="User" />
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
          createLabel="Tambah User"
        />
      </div>

      <CreateModal open={createOpen} onClose={() => setCreateOpen(false)} />
      {editing && <EditModal user={editing} onClose={() => setEditing(null)} />}
      <ConfirmDialog
        open={Boolean(deleting)}
        title="Hapus User"
        description={`Yakin ingin menghapus user "${deleting?.name}"? Tindakan ini tidak dapat dibatalkan.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleting(null)}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
