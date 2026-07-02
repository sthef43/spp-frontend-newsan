import React, { useEffect, useState } from "react";
import { BottomNavigation, BottomNavigationAction } from "@mui/material";

import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import { BrightnessLow, QueryBuilder } from "@mui/icons-material";
import { Periodos } from "../components/Periodos";
import { CargaHoras } from "../components/CargaHoras";

export const ConfiguracionHoraJornadaLaboral = (): JSX.Element => {
  const { TitleChanger } = useTitleOfApp();

  useEffect(() => {
    TitleChanger("CONFIGURACION HORA JORNADA LABORAL");
  }, []);

  const [value, setVal] = useState(null);

  return (
    <div className="p-2">
      <BottomNavigation
        value={value}
        onChange={(event, newValue) => {
          setVal(newValue);
        }}
        showLabels>
        <BottomNavigationAction label="Carga de Horas" icon={<QueryBuilder />} />
        <BottomNavigationAction label="Periodos de Hora" icon={<BrightnessLow />} />
        {/*         <BottomNavigationAction label="Visualizar" icon={<RemoveRedEye />} />
         */}{" "}
      </BottomNavigation>
      {value == 0 ? <CargaHoras></CargaHoras> : ""}
      {value == 1 ? <Periodos></Periodos> : ""}
    </div>
  );
};
