import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { Topbar } from "../../components/dashboard/Topbar";
import { Modal } from "../../components/dashboard/Modal";
import { usePages, useUpdatePage } from "../../api/pages";
import { Page } from "../../api/types";
import { pageContentSchema, PageContentFormSchema } from "../../lib/schemas";
import { getErrorMessage } from "../../lib/errors";

function EditPageModal({ page, onClose }: { page: Page; onClose: () => void }) {
  const update = useUpdatePage(page.id);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PageContentFormSchema>({
    resolver: zodResolver(pageContentSchema),
    defaultValues: { title: page.title, content: page.content },
  });

  function onSubmit(values: PageContentFormSchema) {
    update.mutate(values, {
      onSuccess: () => {
        toast.success("Konten berhasil diperbarui");
        onClose();
      },
      onError: (err) => toast.error(getErrorMessage(err, "Gagal memperbarui konten")),
    });
  }

  return (
    <Modal open title={`Edit ${page.pageKey}`} onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-secondary">Judul</label>
          <input {...register("title")} className="w-full rounded-lg border border-secondary/20 px-3 py-2 text-sm" />
          {errors.title && <p className="mt-1 text-xs text-red-600">{errors.title.message}</p>}
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-secondary">Konten</label>
          <textarea {...register("content")} rows={8} className="w-full rounded-lg border border-secondary/20 px-3 py-2 text-sm" />
          {errors.content && <p className="mt-1 text-xs text-red-600">{errors.content.message}</p>}
        </div>
        <button type="submit" disabled={update.isPending} className="btn-primary w-full disabled:opacity-50">
          {update.isPending ? "Menyimpan..." : "Simpan"}
        </button>
      </form>
    </Modal>
  );
}

export default function WebsitePages() {
  const { data: pages, isLoading } = usePages();
  const [editing, setEditing] = useState<Page | null>(null);

  return (
    <div>
      <Topbar title="Website" />
      <div className="p-6">
        <div className="space-y-4">
          {isLoading && <div className="skeleton h-24 w-full" />}
          {!isLoading &&
            pages?.map((page) => (
              <div key={page.id} className="rounded-2xl bg-white p-5 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-secondary/50">{page.pageKey}</p>
                    <h3 className="mt-1 font-semibold text-secondary">{page.title}</h3>
                    <p className="mt-2 line-clamp-3 whitespace-pre-line text-sm text-secondary-dark/70">{page.content}</p>
                  </div>
                  <button onClick={() => setEditing(page)} className="shrink-0 text-sm font-medium text-accent">
                    Edit
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>

      {editing && <EditPageModal page={editing} onClose={() => setEditing(null)} />}
    </div>
  );
}
