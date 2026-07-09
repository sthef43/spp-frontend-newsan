import { ResponsiveContainer, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { CustomTooltip } from "../CustomTooltip";
import { IConfigAreaGarficos } from "../../IConfigAreaGraficos";

interface Props<T> {
  data: T[];
  xAxisKey: Extract<keyof T, string>;
  areas: IConfigAreaGarficos<T>[];
  extraKeys?: Array<{ title?: string; objectDate: Extract<keyof T, string>; render?: () => JSX.Element }>;
}

export const BarChartComponent = <T,>({ data, xAxisKey, areas, extraKeys }: Props<T>) => {
  return (
    <ResponsiveContainer width="100%" aspect={1.618} height="100%">
      <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xAxisKey} width={100} />
        <YAxis width={50} />
        <Tooltip
          content={(rechartProps) => <CustomTooltip {...rechartProps} extraKeys={extraKeys} />}
          defaultIndex={2}
        />
        <Legend />
        {areas.map((area) => (
          <Bar
            key={area.key}
            radius={[10, 10, 0, 0]}
            type="monotone"
            activeBar={{ fill: "green", stroke: "blue" }}
            dataKey={area.key}
            fill={area.stroke}
            fillOpacity={1}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
};
