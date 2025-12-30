export function LoadingState({ label }: { label: string }) {
  return (
    <div className="animate-pulse rounded-3xl border border-ink-100 bg-white p-6 text-sm text-ink-400">
      {label}
    </div>
  );
}
