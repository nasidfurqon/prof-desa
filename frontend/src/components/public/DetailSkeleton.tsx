export function DetailSkeleton({ maxWidth = "max-w-4xl" }: { maxWidth?: string }) {
  return (
    <div className={`mx-auto ${maxWidth} px-4 py-12`}>
      <div className="skeleton h-4 w-32" />
      <div className="skeleton mt-4 h-72 w-full" />
      <div className="skeleton mt-6 h-7 w-2/3" />
      <div className="mt-4 space-y-2">
        <div className="skeleton h-4 w-full" />
        <div className="skeleton h-4 w-full" />
        <div className="skeleton h-4 w-3/4" />
      </div>
    </div>
  );
}
