import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { IConfigAreaGraficos } from "../../IConfigAreaGraficos";
import { CustomTooltip } from "../CustomTooltip";
import { IExtraKeys } from "../../IExtraKeys";

interface Props<T> {
  data: T[];
  xAxisKey: Extract<keyof T, string>;
  areas: IConfigAreaGraficos<T>[];
  extraKeys?: IExtraKeys<T>[];
  titleTooltip?: string
  setPayloadObject?: (newValue: any) => void;
  // contentTooltip?: React.ReactNode;
}

export const LineaChartComponent = <T,>({ data, xAxisKey, areas, extraKeys, titleTooltip, setPayloadObject }: Props<T>) => {
  const handleClickGrapich = (state: any) => {
    const payload = state.activePayload[0].payload;
    if (payload) {
      setPayloadObject(payload);
    }
  };
  return (
    <ResponsiveContainer width="100%" aspect={1.618} height="100%">
      <LineChart onClick={handleClickGrapich} data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xAxisKey} width={100} />
        <YAxis width={50} />
        <Tooltip
          content={(rechartProps) => <CustomTooltip {...rechartProps} extraKeys={extraKeys} titleTooltip={titleTooltip} />}
          defaultIndex={2}
        />
        <Legend />
        {areas.map((area) => (
          <Line
            key={area.key}
            type="monotone"
            dataKey={area.key}
            stroke={area.stroke}
            fillOpacity={1}
            animationBegin={200}
            animationDuration={1300}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
};
