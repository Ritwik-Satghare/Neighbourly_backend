export default function Loading() {
  return (
    <main className="grid min-h-screen place-items-center px-6">
      <div className="space-y-4 text-center">
        <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
        <p className="text-sm font-medium text-ink-soft">Loading the neighborhood...</p>
      </div>
    </main>
  );
}
