type LineChartSeries = { label: string; color: string; values: number[] };

function LineChart({
  series,
  xLabels,
  yTicks,
  height = 200
}: {
  series: LineChartSeries[];
  xLabels: string[];
  yTicks: number[];
  height?: number;
}) {
  const width = 560;
  const paddingLeft = 32;
  const paddingRight = 12;
  const paddingTop = 10;
  const paddingBottom = 26;
  const plotWidth = width - paddingLeft - paddingRight;
  const plotHeight = height - paddingTop - paddingBottom;
  const min = Math.min(...yTicks);
  const max = Math.max(...yTicks);
  const count = xLabels.length;

  const xAt = (i: number) => paddingLeft + (count === 1 ? 0 : (i / (count - 1)) * plotWidth);
  const yAt = (value: number) => paddingTop + (1 - (value - min) / (max - min)) * plotHeight;

  return (
    <div className="line-chart">
      <svg viewBox={`0 0 ${width} ${height}`} className="line-chart-svg">
        {yTicks.map((tick) => (
          <g key={tick}>
            <line x1={paddingLeft} x2={width - paddingRight} y1={yAt(tick)} y2={yAt(tick)} className="line-chart-grid" />
            <text x={paddingLeft - 8} y={yAt(tick)} className="line-chart-tick" textAnchor="end" dominantBaseline="middle">
              {tick}
            </text>
          </g>
        ))}
        {series.map((s) => (
          <g key={s.label}>
            <polyline points={s.values.map((v, i) => `${xAt(i)},${yAt(v)}`).join(" ")} fill="none" stroke={s.color} strokeWidth={2} />
            {s.values.map((v, i) => (
              <circle key={i} cx={xAt(i)} cy={yAt(v)} r={2.5} fill={s.color} />
            ))}
          </g>
        ))}
        {xLabels.map((label, i) => (
          <text key={label} x={xAt(i)} y={height - 8} className="line-chart-tick" textAnchor="middle">
            {label}
          </text>
        ))}
      </svg>
      <div className="line-chart-legend">
        {series.map((s) => (
          <span key={s.label}>
            <i style={{ background: s.color }} />
            {s.label}
          </span>
        ))}
      </div>
    </div>
  );
}

export default LineChart;
