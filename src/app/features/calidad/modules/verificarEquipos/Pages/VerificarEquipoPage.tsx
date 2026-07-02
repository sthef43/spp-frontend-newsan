import { BottomNavigation, BottomNavigationAction, Paper } from "@mui/material";
import { useAppSelector } from "app/core/store/store";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import React from "react";
import { BaseCajaVerificacionPage } from "../components/BaseCajaVerificacionPage";
import { TestingLGVerificacionPage } from "../components/TestingLGVerificacionPage";
import { TestingNwVerificacionPage } from "../components/TestingNwVerificacionPage";
import { TrazaManualVerificacionPage } from "../components/TrazaManualVerificacionPage";
import { AccesorioVerficacionPage } from "../components/AccesorioVerficacionPage";

export const VerificarEquipoPage = () => {
  const { darkMode } = useAppSelector((state) => state.colorApp);
  const [Codigo, setCodigo] = React.useState(1);
  const [style, setStyle] = React.useState({});
  const { TitleChanger } = useTitleOfApp();

  React.useEffect(() => {
    TitleChanger("Verificar equipos por puesto");
  }, []);

  React.useEffect(() => {
    darkMode
      ? setStyle({ height: "55%", width: "55%", filter: "invert(1)" })
      : setStyle({ height: "55%", width: "55%" });
  }, [darkMode]);

  return (
    <div className="my-4 p-2 h-full">
      <div className=" rounded-lg  px-2 w-full my-2 bg-secondaryNew shadow-elevation-4">
        <Paper sx={{ top: 48, left: 0, right: 0, padding: 1 }} elevation={3}>
          <BottomNavigation
            showLabels
            value={Codigo}
            onChange={(event, newValue) => {
              setCodigo(newValue);
            }}>
            <BottomNavigationAction
              label="Base y caja"
              value={1}
              icon={
                <img style={style} src={`${import.meta.env.VITE_PUBLIC_URL}/icons/testing.svg`} alt="etiqueta-caja" />
              }
            />
            <BottomNavigationAction
              label="Testing CE Newsan"
              value={2}
              icon={
                <img
                  style={style}
                  src={`${import.meta.env.VITE_PUBLIC_URL}/icons/testing.svg`}
                  alt="Etiqueta-eficiencia"
                />
              }
            />
            <BottomNavigationAction
              label="Manuales/Base"
              value={3}
              icon={
                <img style={style} src={`${import.meta.env.VITE_PUBLIC_URL}/icons/testing.svg`} alt="Etiqueta-modelo" />
              }
            />
            <BottomNavigationAction
              label="Testing LG"
              value={4}
              icon={
                <img style={style} src={`${import.meta.env.VITE_PUBLIC_URL}/icons/testing.svg`} alt="Etiqueta-modelo" />
              }
            />
          </BottomNavigation>
        </Paper>
        {Codigo == 1 && <BaseCajaVerificacionPage />}
        {Codigo == 2 && <TestingNwVerificacionPage />}
        {Codigo == 3 && <TrazaManualVerificacionPage />}
        {Codigo == 4 && <TestingLGVerificacionPage />}
        {Codigo == 5 && <AccesorioVerficacionPage />}
      </div>
    </div>
  );
};
