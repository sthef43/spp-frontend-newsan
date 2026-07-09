import { Area, AreaChart, CartesianGrid, Tooltip, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { IConfigAreaGarficos } from "../../IConfigAreaGraficos";
import { CustomTooltip } from "../CustomTooltip";

interface Props<T> {
  data: T[];
  xAxisKey: Extract<keyof T, string>;
  areas: IConfigAreaGarficos<T>[];
  extraKeys?: Array<{ title?: string; objectDate: Extract<keyof T, string>; render?: () => JSX.Element }>;
  // contentTooltip?: React.ReactNode;
}

export const AreaChartComponent = <T,>({ data, xAxisKey, areas, extraKeys }: Props<T>) => {
  return (
    <ResponsiveContainer width="100%" aspect={1.618} height="100%">
      <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          {areas.map((area) => (
            <linearGradient key={`color-${area.key}`} id={`color-${area.key}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={area.fill} stopOpacity={0.8} />
              <stop offset="95%" stopColor={area.fill} stopOpacity={0} />
            </linearGradient>
          ))}
        </defs>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xAxisKey} width={100} />
        <YAxis width={50} />
        <Tooltip
          content={(rechartProps) => <CustomTooltip {...rechartProps} extraKeys={extraKeys} />}
          defaultIndex={2}
        />
        {areas.map((area) => (
          <>
            <Area
              key={area.key}
              type="monotone"
              dataKey={area.key}
              stroke={area.stroke}
              fill={`url(#color-${area.key})`}
              fillOpacity={1}
              animationBegin={200}
              animationDuration={1300}
            />
          </>
        ))}
      </AreaChart>
    </ResponsiveContainer>
  );
};
