import { Grow } from "@mui/material";
import { GroupButtons } from "../components/GroupButtons";
import { IConfigAreaGraficos } from "../IConfigAreaGraficos";
import { LayoutSelectorGraphics } from "../layout/LayoutSelectorGraphics";
import { useEffect, useState } from "react";
import { DetailInformation } from "../components/DetailInformation";
import { ChartButtonIconEdited } from "../../ComponentsMUIModify/IconsModified";
import { Box } from "@mui/system";
import { buildAreaSegments } from "../helpers/buildAreaSegments";
import { IExtraKeys } from "../IExtraKeys";

interface Props<T> {
  data: T[];
  xAxisKey: Extract<keyof T, string>;
  areas: IConfigAreaGraficos<T>[];
  classNameStyles: string;
  activeDoubleChart?: boolean;
  keyForDoubleChart?: Extract<keyof T, string>;
  thresholdForDoubleChart?: number;
  titleTooltip?: string;
  activeDetailInformation?: boolean;
  typeGraph?: "Lineas" | "Barras" | "Circular" | "Area";
  extraKeys?: IExtraKeys<T>[];
  extraKeysMoreInformation?: Array<{
    title?: string;
    objectDate?: string;
    render?: () => React.ReactNode;
    renderObjetcDate?: (value: any) => JSX.Element;
  }>;
  // contentTooltip?: React.ReactNode;
}

export const ContainerForGraphics = <T,>({
  data,
  xAxisKey,
  areas,
  extraKeys,
  classNameStyles,
  typeGraph,
  titleTooltip,
  activeDetailInformation = false,
  extraKeysMoreInformation,
  activeDoubleChart = false,
  keyForDoubleChart,
  thresholdForDoubleChart
}: Props<T>) => {
  const [valueLayout, setValueLayout] = useState<"Lineas" | "Barras" | "Circular" | "Area">(typeGraph);
  const [payloadObject, setPayloadObject] = useState<T>();

  const chartData = activeDoubleChart
    ? buildAreaSegments<T>({ data: data, valueKey: keyForDoubleChart, threshold: thresholdForDoubleChart })
    : data;

  useEffect(() => {
    if (data.length > 0) {
      setPayloadObject(null);
    }
  }, [data]);

  return (
    <>
      {data.length > 0 ? (
        <main className={`${classNameStyles} flex flex-row justify-between gap-x-4`}>
          <Grow in={data.length > 0}>
            <section
              className={`${
                activeDetailInformation ? "w-full" : "w-[80%]"
              }  bg-secondaryNew p-4 rounded-md shadow-md my-4`}>
              {!typeGraph && (
                <header>
                  <GroupButtons setActiveLayout={setValueLayout} />
                </header>
              )}
              <section className="mt-4 h-fit">
                <LayoutSelectorGraphics
                  activeDoubleChart={activeDoubleChart}
                  setPayloadObject={setPayloadObject}
                  data={activeDoubleChart ? chartData : data}
                  xAxisKey={xAxisKey}
                  areas={areas}
                  extraKeys={extraKeys}
                  activeLayout={valueLayout}
                  titleTooltip={titleTooltip}
                />
              </section>
            </section>
          </Grow>
          {activeDetailInformation && payloadObject && (
            <Grow in={payloadObject && activeDetailInformation ? true : false} timeout={500}>
              <section className="w-[50%] bg-secondaryNew p-4 rounded-md shadow-md my-4">
                <DetailInformation rawData={payloadObject} extraKeys={extraKeysMoreInformation} />
              </section>
            </Grow>
          )}
        </main>
      ) : (
        <Grow in={true}>
          <main
            className={`${classNameStyles} bg-secondaryNew border border-[#0d0d0d4f] border-dashed p-4 rounded-md shadow-md my-4 flex flex-col items-center justify-center gap-y-4`}>
            <Box className="border border-[#0d0d0d4f] rounded-lg flex border-dashed items-center">
              <ChartButtonIconEdited />
            </Box>
            <div className="flex flex-col items-center">
              <h3 className="text-xl font-bold">No se encontraron datos para graficar</h3>
              <p className="text-base font-medium text-gray-500">Intenta ajustar los filtros y vuelve a intentarlo.</p>
            </div>
          </main>
        </Grow>
      )}
    </>
  );
};
