import { useEffect, useRef, useState } from "react";
import { Controller, Control, FieldValues, FieldPath } from "react-hook-form";
import { ALLOWED_IMAGE_EXTENSIONS, IMAGE_HELPER_TEXT, formatFileSize } from "../../lib/upload";
import { resolveUploadUrl } from "../../api/axios";

interface FileDropzoneProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  multiple?: boolean;
  required?: boolean;
  existingUrl?: string | null;
}

function buildFileList(files: File[]): FileList | undefined {
  if (files.length === 0) return undefined;
  const dt = new DataTransfer();
  files.forEach((file) => dt.items.add(file));
  return dt.files;
}

export function FileDropzone<T extends FieldValues>({ control, name, label, multiple, required, existingUrl }: FileDropzoneProps<T>) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const currentFiles: File[] = field.value ? Array.from(field.value as FileList) : [];

        function setFiles(files: File[]) {
          field.onChange(buildFileList(files));
        }

        function handleFiles(fileList: FileList | null) {
          if (!fileList || fileList.length === 0) return;
          const incoming = Array.from(fileList);
          setFiles(multiple ? [...currentFiles, ...incoming] : [incoming[0]]);
        }

        function removeAt(index: number) {
          setFiles(currentFiles.filter((_, i) => i !== index));
        }

        return (
          <div>
            <label className="mb-1 block text-sm font-medium text-secondary">
              {label} {required && <span className="text-red-500">*</span>}
            </label>
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                handleFiles(e.dataTransfer.files);
              }}
              onClick={() => inputRef.current?.click()}
              role="button"
              tabIndex={0}
              className={`cursor-pointer rounded-xl border-2 border-dashed p-4 text-center transition-colors duration-150 ${
                fieldState.error
                  ? "border-red-400 bg-red-50"
                  : isDragging
                    ? "border-accent bg-accent/5"
                    : "border-secondary/20 hover:border-accent/50 hover:bg-secondary/5"
              }`}
            >
              <input
                ref={inputRef}
                type="file"
                accept={`${ALLOWED_IMAGE_EXTENSIONS},image/jpeg,image/png`}
                multiple={multiple}
                className="hidden"
                onChange={(e) => {
                  handleFiles(e.target.files);
                  e.target.value = "";
                }}
              />
              <p className="text-sm text-secondary-dark/70">
                <span className="font-medium text-accent">Klik untuk pilih file</span> atau seret &amp; lepas di sini
              </p>
              <p className="mt-1 text-xs text-secondary-dark/40">{IMAGE_HELPER_TEXT}</p>
            </div>

            {(currentFiles.length > 0 || existingUrl) && (
              <div className="mt-3 flex flex-wrap gap-3">
                {currentFiles.length === 0 && existingUrl && (
                  <div className="h-20 w-20 overflow-hidden rounded-lg border border-secondary/10">
                    <img src={resolveUploadUrl(existingUrl)} alt="Saat ini" className="h-full w-full object-cover" />
                  </div>
                )}
                {currentFiles.map((file, i) => (
                  <FilePreview key={`${file.name}-${file.lastModified}-${i}`} file={file} onRemove={() => removeAt(i)} />
                ))}
              </div>
            )}

            {fieldState.error && <p className="mt-1 text-xs text-red-600">{fieldState.error.message}</p>}
          </div>
        );
      }}
    />
  );
}

function FilePreview({ file, onRemove }: { file: File; onRemove: () => void }) {
  const [url, setUrl] = useState("");

  useEffect(() => {
    const objectUrl = URL.createObjectURL(file);
    setUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  return (
    <div className="group relative h-20 w-20 overflow-hidden rounded-lg border border-secondary/10">
      {url && <img src={url} alt={file.name} className="h-full w-full object-cover" />}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-xs text-white opacity-0 transition-opacity duration-150 group-hover:opacity-100"
        aria-label="Hapus file"
      >
        &times;
      </button>
      <div className="absolute inset-x-0 bottom-0 truncate bg-black/50 px-1 text-[10px] leading-4 text-white">
        {formatFileSize(file.size)}
      </div>
    </div>
  );
}
