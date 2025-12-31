export function Footer() {
  return (
    <footer className="border-t border-border bg-white/70 mt-auto">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-6 py-6 text-xs text-muted md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <span className="font-medium text-foreground">Berry Bros. & Rudd</span>
          <span className="text-border">|</span>
          <span>Cellar Concierge</span>
        </div>
        <div className="flex items-center gap-4">
          <span>Indicative only. Not investment advice.</span>
          <span className="text-border">|</span>
          <span>You must be 18+ (UK) to purchase alcohol.</span>
        </div>
      </div>
    </footer>
  );
}
