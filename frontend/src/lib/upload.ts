export const MAX_IMAGE_SIZE_MB = 5;
export const MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024;

export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png"];
export const ALLOWED_IMAGE_EXTENSIONS = ".jpg,.jpeg,.png";

export const IMAGE_HELPER_TEXT = `Format JPG, JPEG, atau PNG, maks. ${MAX_IMAGE_SIZE_MB}MB`;

export function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
