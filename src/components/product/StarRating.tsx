import { Star } from 'lucide-react';

type StarRatingProps = {
  rating: number;
  count?: number;
  size?: number;
};

export default function StarRating({ rating, count, size = 14 }: StarRatingProps) {
  return (
    <div className="flex items-center gap-1.5 text-sm text-ink-600">
      <div className="flex" aria-label={`Rated ${rating} out of 5`}>
        {[1, 2, 3, 4, 5].map((n) => {
          const filled = rating >= n - 0.25;
          return (
            <Star
              key={n}
              width={size}
              height={size}
              className={filled ? 'fill-warning-500 text-warning-500' : 'text-ink-200'}
            />
          );
        })}
      </div>
      <span className="font-semibold text-ink-800">{rating.toFixed(1)}</span>
      {count !== undefined && <span>({count})</span>}
    </div>
  );
}
