import React, { useEffect, useState } from "react";
import { BottomNavigation, BottomNavigationAction } from "@mui/material";

import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import { Build, BuildCircle } from "@mui/icons-material";
import { Reparaciones } from "../components/Reparaciones";
import { ReparacionesUnidad } from "../components/ReparacionesUnidad";

export const ReparacionesAdmin = (): JSX.Element => {
  const { TitleChanger } = useTitleOfApp();

  useEffect(() => {
    TitleChanger("REPARACIONES");
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
        <BottomNavigationAction label="Reparacion Pareto" icon={<Build />} />
        <BottomNavigationAction label="Reparacion por Equipo" icon={<BuildCircle />} />
      </BottomNavigation>
      {value == 0 ? <Reparaciones></Reparaciones> : ""}
      {value == 1 ? <ReparacionesUnidad></ReparacionesUnidad> : ""}
    </div>
  );
};
