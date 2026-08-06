import { ReactNode } from "react";

export function FormLabel({ children, required }: { children: ReactNode; required?: boolean }) {
  return (
    <label className="mb-1 block text-sm font-medium text-secondary">
      {children} {required && <span className="text-red-500">*</span>}
    </label>
  );
}
