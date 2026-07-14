import React from "react";
import { AreaChartComponent } from "../components/graficos/AreaChartComponent";
import { BarChartComponent } from "../components/graficos/BarChartComponents";
import { LineaChartComponent } from "../components/graficos/LineaChartComponent";
import { IConfigAreaGraficos } from "../IConfigAreaGraficos";
import { IExtraKeys } from "../IExtraKeys";

interface Props<T> {
  data: T[];
  xAxisKey: Extract<keyof T, string>;
  titleTooltip?: string;
  activeDoubleChart: boolean;
  areas: IConfigAreaGraficos<T>[];
  extraKeys?: IExtraKeys<T>[];
  setPayloadObject?: (newValue: any) => void;
  activeLayout: "Lineas" | "Barras" | "Circular" | "Area";
  // contentTooltip?: React.ReactNode;
}

export const LayoutSelectorGraphics = <T,>({ data, xAxisKey, areas, extraKeys, setPayloadObject, activeLayout, titleTooltip, activeDoubleChart }: Props<T>) => {
  switch (activeLayout) {
    case "Lineas":
      return <LineaChartComponent data={data} xAxisKey={xAxisKey} areas={areas} extraKeys={extraKeys} titleTooltip={titleTooltip} setPayloadObject={setPayloadObject}/>;
    case "Area":
      return <AreaChartComponent data={data} xAxisKey={xAxisKey} areas={areas} extraKeys={extraKeys}  titleTooltip={titleTooltip} setPayloadObject={setPayloadObject} activeDoubleChart={activeDoubleChart} />;
    case "Circular":
      return (
        <div className="flex flex-row w-full gap-x-4 justify-start items-center">
          <div>holaas 3</div>
        </div>
      );
    case "Barras":
      return <BarChartComponent data={data} xAxisKey={xAxisKey} areas={areas} extraKeys={extraKeys} titleTooltip={titleTooltip} setPayloadObject={setPayloadObject} />;
  }
};
