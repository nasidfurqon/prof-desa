import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { schoolSchema, SchoolFormSchema } from "../../lib/schemas";
import { inputClass } from "../../lib/formStyles";
import { School } from "../../api/types";
import { FormLabel } from "./FormLabel";
import { FileDropzone } from "./FileDropzone";

interface SchoolFormProps {
  initialValues?: School;
  onSubmit: (values: SchoolFormSchema) => void;
  isSubmitting: boolean;
}

export function SchoolForm({ initialValues, onSubmit, isSubmitting }: SchoolFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<SchoolFormSchema>({
    resolver: zodResolver(schoolSchema),
    defaultValues: initialValues
      ? {
          name: initialValues.name,
          level: initialValues.level,
          description: initialValues.description,
          address: initialValues.address ?? "",
          phone: initialValues.phone ?? "",
          latitude: initialValues.location ? Number(initialValues.location.latitude) : undefined,
          longitude: initialValues.location ? Number(initialValues.location.longitude) : undefined,
        }
      : undefined,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <FormLabel required>Nama Sekolah</FormLabel>
        <input {...register("name")} className={inputClass(Boolean(errors.name))} />
        {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>}
      </div>

      <div>
        <FormLabel required>Tingkatan</FormLabel>
        <select {...register("level")} className={inputClass(Boolean(errors.level))}>
          <option value="">Pilih tingkatan</option>
          <option value="PAUD">PAUD</option>
          <option value="TK">TK</option>
          <option value="SD">SD</option>
          <option value="SMP">SMP</option>
          <option value="SMA">SMA</option>
          <option value="SMK">SMK</option>
        </select>
        {errors.level && <p className="mt-1 text-xs text-red-600">{errors.level.message}</p>}
      </div>

      <div>
        <FormLabel required>Deskripsi</FormLabel>
        <textarea {...register("description")} rows={4} className={inputClass(Boolean(errors.description))} />
        {errors.description && <p className="mt-1 text-xs text-red-600">{errors.description.message}</p>}
      </div>

      <div>
        <FormLabel>Telepon</FormLabel>
        <input {...register("phone")} className={inputClass(Boolean(errors.phone))} />
      </div>

      <div>
        <FormLabel>Alamat</FormLabel>
        <input {...register("address")} className={inputClass(Boolean(errors.address))} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <FormLabel>Latitude</FormLabel>
          <input {...register("latitude")} className={inputClass(Boolean(errors.latitude))} />
          {errors.latitude && <p className="mt-1 text-xs text-red-600">{errors.latitude.message}</p>}
        </div>
        <div>
          <FormLabel>Longitude</FormLabel>
          <input {...register("longitude")} className={inputClass(Boolean(errors.longitude))} />
          {errors.longitude && <p className="mt-1 text-xs text-red-600">{errors.longitude.message}</p>}
        </div>
      </div>

      <FileDropzone control={control} name="thumbnail" label="Thumbnail" existingUrl={initialValues?.thumbnail} />
      <FileDropzone control={control} name="images" label="Galeri (bisa lebih dari satu)" multiple />

      <button type="submit" disabled={isSubmitting} className="btn-primary w-full disabled:opacity-50">
        {isSubmitting ? "Menyimpan..." : "Simpan"}
      </button>
    </form>
  );
}
