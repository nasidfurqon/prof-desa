export function inputClass(hasError?: boolean) {
  return `w-full rounded-lg border px-3 py-2 text-sm transition-colors duration-150 focus:outline-none focus:ring-2 ${
    hasError
      ? "border-red-400 focus:border-red-400 focus:ring-red-100"
      : "border-secondary/20 focus:border-accent focus:ring-accent/20"
  }`;
}
