type StatsCardProps = {
  label: string;
  value: string;
  note: string;
};

export function StatsCard({ label, value, note }: StatsCardProps) {
  return (
    <div className="grid min-h-40 gap-6 rounded-[1.75rem] bg-surface-card p-6 shadow-ambient">
      <span className="text-sm font-medium text-ink-soft">{label}</span>
      <div>
        <p className="font-headline text-3xl font-extrabold text-ink-strong">{value}</p>
        <p className="mt-1 text-sm text-primary">{note}</p>
      </div>
    </div>
  );
}
