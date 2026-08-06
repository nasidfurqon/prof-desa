import { z } from "zod";
import { ALLOWED_IMAGE_TYPES, MAX_IMAGE_SIZE_BYTES, MAX_IMAGE_SIZE_MB } from "./upload";

export const loginSchema = z.object({
  email: z.string().min(1, "Email wajib diisi").email("Format email tidak valid"),
  password: z.string().min(1, "Password wajib diisi"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

function isFileList(value: unknown): value is FileList {
  return typeof FileList !== "undefined" && value instanceof FileList;
}

export const singleImageSchema = z
  .custom<FileList | undefined>((val) => val === undefined || isFileList(val), { message: "File tidak valid" })
  .optional()
  .refine((files) => !files || files.length <= 1, "Hanya boleh satu file")
  .refine((files) => !files || files.length === 0 || ALLOWED_IMAGE_TYPES.includes(files[0].type), "Format harus JPG, JPEG, atau PNG")
  .refine(
    (files) => !files || files.length === 0 || files[0].size <= MAX_IMAGE_SIZE_BYTES,
    `Ukuran file maksimal ${MAX_IMAGE_SIZE_MB}MB`
  );

export const multiImageSchema = z
  .custom<FileList | undefined>((val) => val === undefined || isFileList(val), { message: "File tidak valid" })
  .optional()
  .refine(
    (files) => !files || Array.from(files).every((f) => ALLOWED_IMAGE_TYPES.includes(f.type)),
    "Semua file harus berformat JPG, JPEG, atau PNG"
  )
  .refine(
    (files) => !files || Array.from(files).every((f) => f.size <= MAX_IMAGE_SIZE_BYTES),
    `Setiap file maksimal ${MAX_IMAGE_SIZE_MB}MB`
  );

const latitudeSchema = z
  .union([z.string(), z.number()])
  .optional()
  .transform((v) => (v === "" || v === undefined ? undefined : Number(v)))
  .refine((v) => v === undefined || (v >= -90 && v <= 90), "Latitude harus di antara -90 dan 90");

const longitudeSchema = z
  .union([z.string(), z.number()])
  .optional()
  .transform((v) => (v === "" || v === undefined ? undefined : Number(v)))
  .refine((v) => v === undefined || (v >= -180 && v <= 180), "Longitude harus di antara -180 dan 180");

export const organizationSchema = z.object({
  name: z.string().min(1, "Nama wajib diisi"),
  description: z.string().min(1, "Deskripsi wajib diisi"),
  phone: z.string().optional(),
  email: z.string().email("Format email tidak valid").optional().or(z.literal("")),
  address: z.string().optional(),
  latitude: latitudeSchema,
  longitude: longitudeSchema,
  thumbnail: singleImageSchema,
  images: multiImageSchema,
});

export type OrganizationFormSchema = z.infer<typeof organizationSchema>;

export const umkmSchema = z.object({
  name: z.string().min(1, "Nama wajib diisi"),
  ownerName: z.string().min(1, "Nama pemilik wajib diisi"),
  description: z.string().min(1, "Deskripsi wajib diisi"),
  phone: z.string().optional(),
  address: z.string().optional(),
  latitude: latitudeSchema,
  longitude: longitudeSchema,
  thumbnail: singleImageSchema,
  images: multiImageSchema,
});

export type UmkmFormSchema = z.infer<typeof umkmSchema>;

export const schoolSchema = z.object({
  name: z.string().min(1, "Nama wajib diisi"),
  level: z.string().min(1, "Tingkatan wajib diisi"),
  description: z.string().min(1, "Deskripsi wajib diisi"),
  address: z.string().optional(),
  phone: z.string().optional(),
  latitude: latitudeSchema,
  longitude: longitudeSchema,
  thumbnail: singleImageSchema,
  images: multiImageSchema,
});

export type SchoolFormSchema = z.infer<typeof schoolSchema>;

export const newsSchema = z.object({
  title: z.string().min(1, "Judul wajib diisi"),
  summary: z.string().min(1, "Ringkasan wajib diisi"),
  content: z.string().min(1, "Isi berita wajib diisi"),
  relatedType: z.enum(["GENERAL", "ORGANIZATION", "UMKM", "SCHOOL"]).optional(),
  relatedId: z
    .union([z.string(), z.number()])
    .optional()
    .transform((v) => (v === "" || v === undefined ? undefined : Number(v))),
  publishedAt: z.string().optional(),
  thumbnail: singleImageSchema,
  images: multiImageSchema,
});

export type NewsFormSchema = z.infer<typeof newsSchema>;

export const userSchema = z.object({
  name: z.string().min(1, "Nama wajib diisi"),
  email: z.string().min(1, "Email wajib diisi").email("Format email tidak valid"),
  password: z.union([z.string().min(6, "Password minimal 6 karakter"), z.literal("")]).optional(),
  isActive: z.boolean().optional(),
});

export type UserFormSchema = z.infer<typeof userSchema>;

export const pageContentSchema = z.object({
  title: z.string().min(1, "Judul wajib diisi"),
  content: z.string().min(1, "Konten wajib diisi"),
});

export type PageContentFormSchema = z.infer<typeof pageContentSchema>;
