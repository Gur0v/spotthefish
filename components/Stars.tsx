import { Star } from "lucide-react";

export function Stars({ count, muted = false }: { count: number; muted?: boolean }) {
  return (
    <div className="flex items-center gap-1" aria-label={`${count} зірок`}>
      {[1, 2, 3].map((star) => (
        <Star
          key={star}
          size={22}
          className={star <= count && !muted ? "fill-fish-warning text-fish-warning" : "text-slate-300"}
          aria-hidden
        />
      ))}
    </div>
  );
}
