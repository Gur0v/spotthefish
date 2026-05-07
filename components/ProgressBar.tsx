export function ProgressBar({ current, total }: { current: number; total: number }) {
  const width = Math.max(0, Math.min(100, (current / total) * 100));
  return (
    <div className="h-4 overflow-hidden rounded-full bg-white ring-1 ring-fish-border" aria-label={`Прогрес ${current} з ${total}`}>
      <div className="h-full rounded-full bg-fish-primary transition-all" style={{ width: `${width}%` }} />
    </div>
  );
}
