import { AreaChartComponent } from "../components/graficos/AreaChartComponent";
import { BarChartComponent } from "../components/graficos/BarChartComponents";
import { LineaChartComponent } from "../components/graficos/LineaChartComponent";
import { IConfigAreaGarficos } from "../IConfigAreaGraficos";

interface Props<T> {
  data: T[];
  xAxisKey: Extract<keyof T, string>;
  areas: IConfigAreaGarficos<T>[];
  extraKeys?: Array<{ title?: string; objectDate: Extract<keyof T, string>; render?: () => JSX.Element }>;
  activeLayout: "Lineas" | "Barras" | "Circular" | "Area";
  // contentTooltip?: React.ReactNode;
}

export const LayoutSelectorGraphics = <T,>({ data, xAxisKey, areas, extraKeys, activeLayout }: Props<T>) => {
  switch (activeLayout) {
    case "Lineas":
      return <LineaChartComponent data={data} xAxisKey={xAxisKey} areas={areas} extraKeys={extraKeys} />;

    case "Area":
      return <AreaChartComponent data={data} xAxisKey={xAxisKey} areas={areas} extraKeys={extraKeys} />;

    case "Circular":
      return (
        <div className="flex flex-row w-full gap-x-4 justify-start items-center">
          <div>holaas 3</div>
        </div>
      );

    case "Barras":
      return <BarChartComponent data={data} xAxisKey={xAxisKey} areas={areas} extraKeys={extraKeys} />;
  }
  return null;
};
