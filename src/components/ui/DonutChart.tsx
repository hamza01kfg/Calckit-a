"use client";

type Slice = { label: string; value: number; color: string };

export default function DonutChart({
  slices,
  centerLabel,
  centerValue,
}: {
  slices: Slice[];
  centerLabel?: string;
  centerValue?: string;
}) {
  const total = slices.reduce((s, x) => s + (x.value > 0 ? x.value : 0), 0) || 1;
  const r = 42;
  const c = 2 * Math.PI * r;
  let offset = 0;

  return (
    <div className="chart-wrap">
      <svg viewBox="0 0 120 120" className="donut-svg" aria-hidden>
        <circle cx="60" cy="60" r={r} fill="none" stroke="var(--line)" strokeWidth="14" />
        {slices.map((slice, i) => {
          const len = (Math.max(0, slice.value) / total) * c;
          const el = (
            <circle
              key={i}
              cx="60"
              cy="60"
              r={r}
              fill="none"
              stroke={slice.color}
              strokeWidth="14"
              strokeDasharray={`${len} ${c - len}`}
              strokeDashoffset={-offset}
              transform="rotate(-90 60 60)"
            />
          );
          offset += len;
          return el;
        })}
        <text x="60" y="56" textAnchor="middle" className="donut-center-val">
          {centerValue || ""}
        </text>
        <text x="60" y="70" textAnchor="middle" className="donut-center-label">
          {centerLabel || ""}
        </text>
      </svg>
      <div className="chart-legend">
        {slices.map((s) => (
          <div key={s.label} className="legend-row">
            <span className="legend-dot" style={{ background: s.color }} />
            <span>{s.label}</span>
            <b>{Math.round((s.value / total) * 100)}%</b>
          </div>
        ))}
      </div>
    </div>
  );
}
