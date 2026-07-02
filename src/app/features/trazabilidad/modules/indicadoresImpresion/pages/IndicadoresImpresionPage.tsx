import {
  BottomNavigation,
  BottomNavigationAction,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select
} from "@mui/material";
import { useAppSelector } from "app/core/store/store";
import { IndicadoresCajaTable } from "app/features/trazabilidad/modules/indicadoresImpresion/components/IndicadoresCajaTable";
import { IndicadoresModeloTable } from "app/features/trazabilidad/modules/indicadoresImpresion/components/IndicadoresModeloTable";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import React from "react";
import { IndicadoresEETable } from "../components/IndicadoresEETable";

export const IndicadoresImpresionPage = () => {
  const { darkMode } = useAppSelector((state) => state.colorApp);
  const [tipoEtiqueta, setTipoEtiqueta] = React.useState(13);
  const [style, setStyle] = React.useState({});
  const [tipoModelo, setTipoModelo] = React.useState();
  const [tipoModelo1, setTipoModelo1] = React.useState();
  const [tipoUnidad, setTipoUnidad] = React.useState();
  const { TitleChanger } = useTitleOfApp();
  React.useEffect(() => {
    TitleChanger("Indicadores de etiquetas");
  }, []);
  React.useEffect(() => {
    darkMode
      ? setStyle({ height: "55%", width: "55%", filter: "invert(1)" })
      : setStyle({ height: "55%", width: "55%" });
  }, [darkMode]);

  return (
    <div className="my-2 h-full">
      <div className=" rounded-lg  px-2 w-full my-2 bg-secondaryNew shadow-elevation-4">
        <Paper sx={{ top: 48, left: 0, right: 0 }} elevation={3}>
          <BottomNavigation
            showLabels
            value={tipoEtiqueta}
            onChange={(event, newValue) => {
              setTipoEtiqueta(newValue);
            }}>
            <BottomNavigationAction
              label="Etiqueta de caja"
              value={13}
              icon={<img style={style} src={`${import.meta.env.BASE_URL}icons/ET-caja.svg`} alt="etiqueta-caja" />}
            />
            <BottomNavigationAction
              label="Etiqueta de EE"
              value={1}
              icon={
                <img
                  style={style}
                  src={`${import.meta.env.BASE_URL}icons/ET-eficiencia.svg`}
                  alt="Etiqueta-eficiencia"
                />
              }
            />
            <BottomNavigationAction
              label="Etiqueta de modelo"
              value={12}
              icon={<img style={style} src={`${import.meta.env.BASE_URL}icons/ET-modelo.svg`} alt="Etiqueta-modelo" />}
            />
          </BottomNavigation>
        </Paper>

        {tipoEtiqueta == 1 || tipoEtiqueta == 12 ? (
          <FormControl variant="filled" fullWidth className="my-3">
            <InputLabel>Tipo de modelo</InputLabel>
            <Select
              value={tipoModelo1}
              onChange={(e: any) => {
                if (e.target.value) {
                  setTipoModelo1(e.target.value);
                }
              }}>
              <MenuItem value={"SP"}> Split</MenuItem>
              <MenuItem value={"VE"}> Ventana</MenuItem>
            </Select>
          </FormControl>
        ) : (
          <FormControl variant="filled" fullWidth className="my-3">
            <InputLabel>Tipo de modelo</InputLabel>
            <Select
              value={tipoModelo}
              onChange={(e: any) => {
                if (e.target.value) {
                  setTipoModelo(e.target.value);
                }
              }}>
              <MenuItem value={"A"}> Artcool</MenuItem>
              <MenuItem value={"D"}> Dualcool</MenuItem>
              <MenuItem value={"DW"}> Dualcool Wifi</MenuItem>
            </Select>
          </FormControl>
        )}
        {tipoEtiqueta == 12 && tipoModelo1 == "SP" && (
          <FormControl variant="filled" fullWidth className="my-3">
            <InputLabel>Tipo de unidad</InputLabel>
            <Select
              value={tipoUnidad}
              onChange={(e: any) => {
                if (e.target.value) {
                  setTipoUnidad(e.target.value);
                }
              }}>
              <MenuItem value={"UI"}> Interior</MenuItem>
              <MenuItem value={"UE"}> Exterior</MenuItem>
            </Select>
          </FormControl>
        )}
        {tipoModelo && tipoEtiqueta == 13 && <IndicadoresCajaTable tipoModelo={tipoModelo} />}
        {tipoModelo1 && tipoEtiqueta == 1 && <IndicadoresEETable tipoModelo={tipoModelo1} />}
        {tipoModelo1 && tipoEtiqueta == 12 && (
          <IndicadoresModeloTable tipoModelo={tipoModelo1} tipoUnidad={tipoUnidad} />
        )}
      </div>
    </div>
  );
};
