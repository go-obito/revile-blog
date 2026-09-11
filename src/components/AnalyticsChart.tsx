"use client";

export function AnalyticsChart({ data }: { data: Array<{ date: string; views: number }> }) {
  if (!data.length) {
    return (
      <div className="flex h-[260px] items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 text-sm text-slate-500">
        Analytics will appear once visitors start viewing your site.
      </div>
    );
  }

  const values = data.map((point) => point.views);
  const maxValue = Math.max(...values, 1);
  const width = 760;
  const height = 260;
  const padding = 18;

  const points = data.map((point, index) => {
    const x = padding + (index * (width - padding * 2)) / Math.max(data.length - 1, 1);
    const y = height - padding - (point.views / maxValue) * (height - padding * 2);
    return `${x},${y}`;
  });

  const areaPoints = `${points[0]} ${points.join(" ")} ${width - padding},${height - padding} ${padding},${height - padding}`;

  const ticks = data.filter((_, index) => index % Math.ceil(data.length / 5) === 0 || index === data.length - 1);

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
      <svg viewBox={`0 0 ${width} ${height}`} className="h-[260px] w-full" role="img" aria-label="Page views over time chart">
        <defs>
          <linearGradient id="chart-fill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.02" />
          </linearGradient>
        </defs>

        {[0, 1, 2, 3].map((line) => (
          <line
            key={line}
            x1={padding}
            x2={width - padding}
            y1={padding + (line * (height - padding * 2)) / 3}
            y2={padding + (line * (height - padding * 2)) / 3}
            stroke="#e2e8f0"
            strokeDasharray="4 6"
          />
        ))}

        <polygon points={areaPoints} fill="url(#chart-fill)"/>
        <polyline
          points={points.join(" ")}
          fill="none"
          stroke="#2563eb"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {data.map((point, index) => {
          const x = padding + (index * (width - padding * 2)) / Math.max(data.length - 1, 1);
          const y = height - padding - (point.views / maxValue) * (height - padding * 2);
          return (
            <circle key={`${point.date}-${index}`} cx={x} cy={y} r={index === data.length - 1 ? 4 : 2.25} fill="#2563eb" />
          );
        })}
      </svg>

      <div className="mt-2 flex items-center justify-between text-[11px] uppercase tracking-[0.16em] text-slate-500">
        {ticks.map((tick) => (
          <span key={tick.date}>{new Date(tick.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
        ))}
      </div>
    </div>
  );
}
