import { Area, AreaChart, CartesianGrid, Tooltip, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { IConfigAreaGraficos } from "../../IConfigAreaGraficos";
import { CustomTooltip } from "../CustomTooltip";
import { IExtraKeys } from "../../IExtraKeys";

interface Props<T> {
  data: T[];
  xAxisKey: Extract<keyof T, string>;
  areas: IConfigAreaGraficos<T>[];
  activeDoubleChart: boolean
  extraKeys?: IExtraKeys<T>[];
  setPayloadObject?: (newValue: any) => void;
  titleTooltip?: string;
  // contentTooltip?: React.ReactNode;
}

export const AreaChartComponent = <T,>({
  data,
  xAxisKey,
  areas,
  extraKeys,
  activeDoubleChart,
  titleTooltip,
  setPayloadObject
}: Props<T>) => {

  const handleClickGrapich = (state: any) => {
    const payload = state.activePayload[0].payload;
    if (payload) {
      setPayloadObject(payload);
    }
  };

  return (
    <ResponsiveContainer width="100%" aspect={1.618} height="100%">
      <AreaChart onClick={handleClickGrapich} data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          {areas.map((area) => (
            <linearGradient key={`color-${area.key}`} id={`color-${area.key}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={area.fill} stopOpacity={0.8} />
              <stop offset="95%" stopColor={area.fill} stopOpacity={0} />
            </linearGradient>
          ))}
          <linearGradient id="color-warning" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#F44336" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#F44336" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xAxisKey} width={100} />
        <YAxis width={50} />
        <Tooltip
          content={(rechartProps) => (
            <CustomTooltip {...rechartProps} extraKeys={extraKeys} titleTooltip={titleTooltip} />
          )}
          defaultIndex={2}
        />
        {areas.map((area) => (
          <>
            <Area
              key={activeDoubleChart ? "normal": area.key}
              type="monotone"
              dataKey={area.key}
              stroke={area.stroke}
              fill={`url(#color-${area.key})`}
              fillOpacity={1}
              animationBegin={200}
              animationDuration={1300}
              connectNulls
            />
          </>
        ))}
        {
          activeDoubleChart && (
            <Area
              type="monotone"
              dataKey="warning"
              stroke="#F44336"
              fill="url(#color-warning)"
              fillOpacity={0.8}
              animationBegin={200}
              animationDuration={1300}
              connectNulls
            />
          )
        }
      </AreaChart>
    </ResponsiveContainer>
  );
};
