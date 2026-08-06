import { useState } from "react";
import toast from "react-hot-toast";
import { Topbar } from "../../components/dashboard/Topbar";
import { DataTable, Column } from "../../components/dashboard/DataTable";
import { Modal } from "../../components/dashboard/Modal";
import { ConfirmDialog } from "../../components/dashboard/ConfirmDialog";
import { OrganizationForm } from "../../components/dashboard/OrganizationForm";
import {
  useCreateOrganization,
  useDeleteOrganization,
  useOrganizations,
  useUpdateOrganization,
} from "../../api/organizations";
import { Organization } from "../../api/types";
import { OrganizationFormSchema } from "../../lib/schemas";
import { resolveUploadUrl } from "../../api/axios";
import { getErrorMessage } from "../../lib/errors";

function CreateModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const create = useCreateOrganization();

  function handleSubmit(values: OrganizationFormSchema) {
    create.mutate(values, {
      onSuccess: () => {
        toast.success("Organisasi berhasil ditambahkan");
        onClose();
      },
      onError: (err) => toast.error(getErrorMessage(err, "Gagal menambahkan organisasi")),
    });
  }

  return (
    <Modal open={open} title="Tambah Organisasi" onClose={onClose}>
      <OrganizationForm onSubmit={handleSubmit} isSubmitting={create.isPending} />
    </Modal>
  );
}

function EditModal({ organization, onClose }: { organization: Organization; onClose: () => void }) {
  const update = useUpdateOrganization(organization.id);

  function handleSubmit(values: OrganizationFormSchema) {
    update.mutate(values, {
      onSuccess: () => {
        toast.success("Organisasi berhasil diperbarui");
        onClose();
      },
      onError: (err) => toast.error(getErrorMessage(err, "Gagal memperbarui organisasi")),
    });
  }

  return (
    <Modal open title="Edit Organisasi" onClose={onClose}>
      <OrganizationForm initialValues={organization} onSubmit={handleSubmit} isSubmitting={update.isPending} />
    </Modal>
  );
}

export default function Organizations() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<string>("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [createOpen, setCreateOpen] = useState(false);
  const [editing, setEditing] = useState<Organization | null>(null);
  const [deleting, setDeleting] = useState<Organization | null>(null);

  const { data, isLoading } = useOrganizations({ page, limit: 10, search: search || undefined, sortBy, sortOrder });
  const deleteMutation = useDeleteOrganization();

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
        toast.success("Organisasi berhasil dihapus");
        setDeleting(null);
      },
      onError: (err) => toast.error(getErrorMessage(err, "Gagal menghapus organisasi")),
    });
  }

  const columns: Column<Organization>[] = [
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
    {
      key: "description",
      header: "Deskripsi",
      render: (row) => <span className="line-clamp-1 max-w-xs text-secondary-dark/70">{row.description}</span>,
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
      <Topbar title="Organisasi" />
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
          createLabel="Tambah Organisasi"
        />
      </div>

      <CreateModal open={createOpen} onClose={() => setCreateOpen(false)} />
      {editing && <EditModal organization={editing} onClose={() => setEditing(null)} />}
      <ConfirmDialog
        open={Boolean(deleting)}
        title="Hapus Organisasi"
        description={`Yakin ingin menghapus "${deleting?.name}"? Tindakan ini tidak dapat dibatalkan.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleting(null)}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
