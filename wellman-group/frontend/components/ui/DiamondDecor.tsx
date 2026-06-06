// Square-grid motif matching the Wellman Group logo — used as section decoration
export default function DiamondDecor({
  cols = 5,
  rows = 6,
  size = 14,
  gap = 8,
  color = 'currentColor',
  opacity = 0.18,
  className = '',
}: {
  cols?: number;
  rows?: number;
  size?: number;
  gap?: number;
  color?: string;
  opacity?: number;
  className?: string;
}) {
  const step = size + gap;
  const w = cols * step - gap;
  const h = rows * step - gap;

  return (
    <svg
      aria-hidden
      viewBox={`0 0 ${w} ${h}`}
      width={w}
      height={h}
      className={className}
      style={{ pointerEvents: 'none', opacity }}
    >
      {Array.from({ length: rows }).map((_, r) =>
        Array.from({ length: cols }).map((_, c) => (
          <rect
            key={`${r}-${c}`}
            x={c * step}
            y={r * step}
            width={size}
            height={size}
            rx={3}
            fill={color}
          />
        ))
      )}
    </svg>
  );
}
