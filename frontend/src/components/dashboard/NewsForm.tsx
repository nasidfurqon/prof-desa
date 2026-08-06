import { useForm, UseFormRegister } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { newsSchema, NewsFormSchema } from "../../lib/schemas";
import { inputClass } from "../../lib/formStyles";
import { News, NewsRelatedType } from "../../api/types";
import { useOrganizations } from "../../api/organizations";
import { useUmkms } from "../../api/umkms";
import { useSchools } from "../../api/schools";
import { FormLabel } from "./FormLabel";
import { FileDropzone } from "./FileDropzone";

interface NewsFormProps {
  initialValues?: News;
  onSubmit: (values: NewsFormSchema) => void;
  isSubmitting: boolean;
}

function OrganizationOptions({ register }: { register: UseFormRegister<NewsFormSchema> }) {
  const { data } = useOrganizations({ limit: 100 });
  return (
    <select {...register("relatedId")} className={inputClass()}>
      <option value="">Pilih organisasi</option>
      {data?.data.map((org) => (
        <option key={org.id} value={org.id}>
          {org.name}
        </option>
      ))}
    </select>
  );
}

function UmkmOptions({ register }: { register: UseFormRegister<NewsFormSchema> }) {
  const { data } = useUmkms({ limit: 100 });
  return (
    <select {...register("relatedId")} className={inputClass()}>
      <option value="">Pilih UMKM</option>
      {data?.data.map((umkm) => (
        <option key={umkm.id} value={umkm.id}>
          {umkm.name}
        </option>
      ))}
    </select>
  );
}

function SchoolOptions({ register }: { register: UseFormRegister<NewsFormSchema> }) {
  const { data } = useSchools({ limit: 100 });
  return (
    <select {...register("relatedId")} className={inputClass()}>
      <option value="">Pilih sekolah</option>
      {data?.data.map((school) => (
        <option key={school.id} value={school.id}>
          {school.name}
        </option>
      ))}
    </select>
  );
}

export function NewsForm({ initialValues, onSubmit, isSubmitting }: NewsFormProps) {
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<NewsFormSchema>({
    resolver: zodResolver(newsSchema),
    defaultValues: initialValues
      ? {
          title: initialValues.title,
          summary: initialValues.summary,
          content: initialValues.content,
          relatedType: initialValues.relatedType,
          relatedId: initialValues.relatedId ?? undefined,
          publishedAt: initialValues.publishedAt ? initialValues.publishedAt.slice(0, 10) : undefined,
        }
      : { relatedType: "GENERAL" },
  });

  const relatedType = (watch("relatedType") ?? "GENERAL") as NewsRelatedType;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <FormLabel required>Judul</FormLabel>
        <input {...register("title")} className={inputClass(Boolean(errors.title))} />
        {errors.title && <p className="mt-1 text-xs text-red-600">{errors.title.message}</p>}
      </div>

      <div>
        <FormLabel required>Ringkasan</FormLabel>
        <textarea {...register("summary")} rows={2} className={inputClass(Boolean(errors.summary))} />
        {errors.summary && <p className="mt-1 text-xs text-red-600">{errors.summary.message}</p>}
      </div>

      <div>
        <FormLabel required>Isi Berita</FormLabel>
        <textarea {...register("content")} rows={6} className={inputClass(Boolean(errors.content))} />
        {errors.content && <p className="mt-1 text-xs text-red-600">{errors.content.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <FormLabel>Kaitkan Dengan</FormLabel>
          <select {...register("relatedType")} className={inputClass()}>
            <option value="GENERAL">Umum</option>
            <option value="ORGANIZATION">Organisasi</option>
            <option value="UMKM">UMKM</option>
            <option value="SCHOOL">Sekolah</option>
          </select>
        </div>
        <div>
          <FormLabel>Tanggal Publish</FormLabel>
          <input type="date" {...register("publishedAt")} className={inputClass()} />
        </div>
      </div>

      {relatedType === "ORGANIZATION" && <OrganizationOptions register={register} />}
      {relatedType === "UMKM" && <UmkmOptions register={register} />}
      {relatedType === "SCHOOL" && <SchoolOptions register={register} />}

      <FileDropzone control={control} name="thumbnail" label="Thumbnail" existingUrl={initialValues?.thumbnail} />
      <FileDropzone control={control} name="images" label="Galeri (bisa lebih dari satu)" multiple />

      <button type="submit" disabled={isSubmitting} className="btn-primary w-full disabled:opacity-50">
        {isSubmitting ? "Menyimpan..." : "Simpan"}
      </button>
    </form>
  );
}
