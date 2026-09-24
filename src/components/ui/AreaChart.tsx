"use client";

type Point = { label: string; invested: number; value: number };

export default function AreaChart({
  points,
  height = 160,
}: {
  points: Point[];
  height?: number;
}) {
  if (!points.length) return null;
  const w = 320;
  const h = height;
  const pad = 16;
  const maxY = Math.max(...points.map((p) => Math.max(p.value, p.invested)), 1);

  const x = (i: number) =>
    pad + (i / Math.max(points.length - 1, 1)) * (w - pad * 2);
  const y = (v: number) => h - pad - (v / maxY) * (h - pad * 2);

  const line = (key: "value" | "invested") =>
    points
      .map((p, i) => `${i === 0 ? "M" : "L"} ${x(i)} ${y(p[key])}`)
      .join(" ");

  const areaValue =
    line("value") +
    ` L ${x(points.length - 1)} ${h - pad} L ${x(0)} ${h - pad} Z`;

  return (
    <div className="chart-wrap">
      <svg viewBox={`0 0 ${w} ${h}`} className="area-svg" aria-hidden>
        <path d={areaValue} fill="rgba(31,107,90,0.18)" stroke="none" />
        <path
          d={line("invested")}
          fill="none"
          stroke="var(--muted)"
          strokeWidth="2"
          strokeDasharray="4 3"
        />
        <path
          d={line("value")}
          fill="none"
          stroke="#1f6b5a"
          strokeWidth="2.5"
        />
      </svg>
      <div className="chart-legend">
        <div className="legend-row">
          <span className="legend-dot" style={{ background: "#1f6b5a" }} />
          <span>Portfolio value</span>
        </div>
        <div className="legend-row">
          <span className="legend-dot" style={{ background: "var(--muted)" }} />
          <span>Invested (dashed)</span>
        </div>
      </div>
    </div>
  );
}
