import React, { useEffect, useState } from "react";
import GraficoTortaProduccionGeneral, {
  GraficoTortaProduccionGeneralData
} from "./subComponents/GraficoTortaProduccionGeneral";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { useAppDispatch } from "app/core/store/store";
import { CircularProgress } from "@mui/material";
import CartelFPY from "./CartelFPY";
import ModelosProducidos from "./ModelosProducidos";

interface Props {
  idLinea: number; //idLinea Tabla Linea Produccion4106
  identificadorLinea: number;
  lineaProduccionId: number;
  totalProduccion: number;
  totalRechazo: number;
}

const IndicadorProduccionGeneral = ({
  idLinea,
  identificadorLinea,
  lineaProduccionId,
  totalProduccion,
  totalRechazo
}: Props) => {
  const dispatch = useAppDispatch();
  const { openNotificationUI } = useNotificationUI();

  const [tortaData, setTortaData] = useState<GraficoTortaProduccionGeneralData[]>();

  useEffect(() => {
    const newData: GraficoTortaProduccionGeneralData[] = [
      { name: "GOOD", value: totalProduccion, color: "green" },
      { name: "NO GOOD", value: totalRechazo, color: "red" }
    ];

    setTortaData(newData);
  }, [totalRechazo, totalProduccion]);

  return (
    <>
      <h1 className="text-center md:text-left text-3xl font-medium">Producción General</h1>
      <div className="flex flex-col md:flex-row gap-2 md:h-[300px]">
        <div className="border border-dashed p-2 rounded-md flex-1 flex items-center justify-center">
          {!tortaData ? (
            <CircularProgress />
          ) : (
            <>
              {totalProduccion == 0 && totalRechazo == 0 ? (
                <div>Sin Produccion</div>
              ) : (
                <GraficoTortaProduccionGeneral data={tortaData} />
              )}
            </>
          )}
        </div>
        <div className="border border-dashed p-2 rounded-md w-full md:w-[40%]">
          {<CartelFPY produccion={totalProduccion} rechazo={totalRechazo} />}

          {/* <GraficoTortaProduccionGeneral data={data} /> */}
        </div>
      </div>
      <div>
        <h1 className="mt-4 font-semibold text-2xl">Modelos en Producción</h1>
        <div className="border border-dashed rounded-xl p-4">
          <ModelosProducidos identificadorLinea={identificadorLinea} />
        </div>
      </div>
    </>
  );
};

export default IndicadorProduccionGeneral;
