import React, { useEffect, useState } from "react";
import { BottomNavigation, BottomNavigationAction } from "@mui/material";

import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import { Add, RemoveRedEye, ResetTvRounded } from "@mui/icons-material";
import { NuevaImpresion } from "./NuevaImpresion";
import { ReImpresion } from "./ReImpresion";

export const ControlEtiquetas = (): JSX.Element => {
  const { TitleChanger } = useTitleOfApp();

  useEffect(() => {
    TitleChanger("CONTROL DE ETIQUETAS");
  }, []);

  const [value, setVal] = useState(null);

  return (
    <div className="p-2" style={{}}>
      <BottomNavigation
        value={value}
        onChange={(event, newValue) => {
          setVal(newValue);
        }}
        showLabels>
        <BottomNavigationAction label="Nueva Impresión" icon={<Add />} />
        <BottomNavigationAction label="Reimpresión" icon={<ResetTvRounded />} />
        <BottomNavigationAction label="Visualizar" icon={<RemoveRedEye />} />
      </BottomNavigation>
      {value == 0 ? <NuevaImpresion></NuevaImpresion> : ""}
      {value == 1 ? <ReImpresion></ReImpresion> : ""}
    </div>
  );
};
