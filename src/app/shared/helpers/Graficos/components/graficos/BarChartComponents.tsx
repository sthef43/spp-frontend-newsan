import { ResponsiveContainer, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { CustomTooltip } from "../CustomTooltip";
import { IConfigAreaGraficos } from "../../IConfigAreaGraficos";
import { IExtraKeys } from "../../IExtraKeys";

interface Props<T> {
  data: T[];
  xAxisKey: Extract<keyof T, string>;
  areas: IConfigAreaGraficos<T>[];
  extraKeys?: IExtraKeys<T>[];
  titleTooltip?: string
  setPayloadObject?: (newValue: any) => void;
}

export const BarChartComponent = <T,>({ data, xAxisKey, areas, extraKeys, titleTooltip, setPayloadObject }: Props<T>) => {

  const handleClickGrapich = (state: any) => {
    const payload = state.activePayload[0].payload;
    if (payload) {
      setPayloadObject(payload);
    }
  };
  
  return (
    <ResponsiveContainer width="100%" aspect={1.618} height="100%">
      <BarChart onClick={handleClickGrapich} data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xAxisKey} width={100} />
        <YAxis width={50} />
        <Tooltip
          content={(rechartProps) => <CustomTooltip {...rechartProps} extraKeys={extraKeys} titleTooltip={titleTooltip}/>}
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
