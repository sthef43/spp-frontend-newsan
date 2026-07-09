import { Grow } from "@mui/material";
import { GroupButtons } from "../components/GroupButtons";
import { IConfigAreaGarficos } from "../IConfigAreaGraficos";
import { LayoutSelectorGraphics } from "../layout/LayoutSelectorGraphics";
import { useState } from "react";

interface Props<T> {
  data: T[];
  xAxisKey: Extract<keyof T, string>;
  areas: IConfigAreaGarficos<T>[];
  extraKeys?: Array<{ title?: string; objectDate: Extract<keyof T, string>; render?: () => JSX.Element }>;
  // contentTooltip?: React.ReactNode;
}

export const ContainerForGraphics = <T,>({ data, xAxisKey, areas, extraKeys }: Props<T>) => {
  const [valueLayout, setValueLayout] = useState<"Lineas" | "Barras" | "Circular" | "Area">("Lineas");

  return (
    <>
      <Grow in={true}>
        <main className="w-full h-full bg-secondaryNew p-4 rounded-md shadow-md my-4">
          <header>
            <GroupButtons setActiveLayout={setValueLayout} />
          </header>
          <section className="mt-4">
            <LayoutSelectorGraphics
              data={data}
              xAxisKey={xAxisKey}
              areas={areas}
              extraKeys={extraKeys}
              activeLayout={valueLayout}
            />
          </section>
        </main>
      </Grow>
    </>
  );
};
