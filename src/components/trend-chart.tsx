import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export type TrendSeries = { key: string; label: string; color?: string };

export function TrendChart({
  data,
  series,
  height = 180,
  domain,
  suffix = "",
}: {
  data: Record<string, number | null | string>[];
  series: TrendSeries[];
  height?: number;
  domain?: [number, number];
  suffix?: string;
}) {
  const hasData = data.some((d) => series.some((s) => d[s.key] !== null && d[s.key] !== undefined));
  if (!hasData) {
    return (
      <div className="panel-quiet flex h-[9rem] items-center justify-center px-4 text-center text-sm text-muted-foreground">
        Dados ainda insuficientes para mostrar tendência.
      </div>
    );
  }
  return (
    <div style={{ height }} className="w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -18 }}>
          <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="semana"
            tickFormatter={(v) => `S${v}`}
            stroke="var(--color-muted-foreground)"
            fontSize={11}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="var(--color-muted-foreground)"
            fontSize={11}
            tickLine={false}
            axisLine={false}
            width={44}
            {...(domain ? { domain } : {})}
          />
          <Tooltip
            contentStyle={{
              background: "var(--color-surface)",
              border: "1px solid var(--color-border)",
              borderRadius: 12,
              fontSize: 12,
              boxShadow: "var(--shadow-card)",
            }}
            labelFormatter={(v) => `Semana ${v}`}
            formatter={(value: number | string, name: string) => [`${value}${suffix}`, name]}
          />
          {series.map((s, i) => (
            <Line
              key={s.key}
              type="monotone"
              dataKey={s.key}
              name={s.label}
              stroke={s.color ?? `var(--color-chart-${(i % 5) + 1})`}
              strokeWidth={2}
              dot={{ r: 2.5 }}
              activeDot={{ r: 4 }}
              connectNulls
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}