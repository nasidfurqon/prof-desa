import path from "path";
import multer from "multer";
import { put } from "@vercel/blob";

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];

export function createUploader(_folder: "organizations" | "umkms" | "schools" | "news") {
  return multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (_req, file, cb) => {
      if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
        cb(new Error("Only JPEG, PNG, or WEBP images are allowed"));
        return;
      }
      cb(null, true);
    },
  });
}

export async function uploadToBlob(folder: string, file: Express.Multer.File) {
  const ext = path.extname(file.originalname);
  const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;

  const blob = await put(`${folder}/${uniqueName}`, file.buffer, {
    access: "public",
    contentType: file.mimetype,
  });

  return blob.url;
}
