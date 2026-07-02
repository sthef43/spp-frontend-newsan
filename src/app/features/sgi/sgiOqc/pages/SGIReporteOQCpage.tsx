import { Search } from "@mui/icons-material";
import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  TextField
} from "@mui/material";
import { DesktopDatePicker } from "@mui/x-date-pickers";
import { unwrapResult } from "@reduxjs/toolkit";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { GraficoReporteOQC } from "app/features/sgi/sgiOqc/components/GraficoReporteOQC";
import { SelectOFPlantAndProducts } from "app/shared/helpers/SelectOFPlantAndProducts";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { OQCDesignadaResultadoSliceRequests } from "app/features/oqcGeneral/slices/OQCDesignadaResultadoSlice";
import { OQCTargetSliceRequests } from "app/features/oqcGeneral/slices/OQCTargetSlice";

export const SGIReporteOQCpage = (): JSX.Element => {
  const { openNotificationUI } = useNotificationUI();
  const dispatch = useAppDispatch();
  const { TitleChanger } = useTitleOfApp();
  const color = MaterialButtons();

  const target = useAppSelector((state) => state.oqcTarget.object);
  const linea = useAppSelector((state) => state.lineaProduccion.object);
  const producto = useAppSelector((state) => state.producto.object);

  const fechaActual = moment().toDate();
  const [year, setYear] = useState(moment().toDate());
  const [lineas, setLineas] = useState(true);
  const [filtroModelos, setFiltroModelos] = useState(false);
  const [modelo, setModelo] = useState("");
  const [modelos, setModelos] = useState<string[]>([]);

  const onSearch = async () => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      if (lineas && !filtroModelos) {
        const objecSubmit = { year: year.getFullYear() + "-01-01", lineaId: linea.id };
        await dispatch(OQCDesignadaResultadoSliceRequests.getSGIReportRequest(objecSubmit));
        const response = unwrapResult(await dispatch(OQCTargetSliceRequests.getByLineaId(linea.id)));
        if (!response) {
          openNotificationUI("Debe configurar un target", "error");
        }
      } else if (filtroModelos) {
        if (modelo != "") {
          const objecSubmit3 = { year: year.getFullYear() + "-01-01", modelo: modelo };
          const response2 = unwrapResult(
            await dispatch(OQCDesignadaResultadoSliceRequests.getSGIReportByModeloRequest(objecSubmit3))
          );
          const response = unwrapResult(await dispatch(OQCTargetSliceRequests.getByLineaId(linea.id)));
          if (!response) {
            openNotificationUI("Debe configurar un target", "error");
          }
          if (response2.length == 0) {
            openNotificationUI("No hay datos para mostrar", "warning");
          }
        } else {
          openNotificationUI("Debe seleccionar un modelo", "error");
        }
      } else {
        const objecSubmit2 = { year: year.getFullYear() + "-01-01", productId: producto.id };
        await dispatch(OQCDesignadaResultadoSliceRequests.getSGIReportByProductoRequest(objecSubmit2));
        const response2 = unwrapResult(await dispatch(OQCTargetSliceRequests.getByProducto(producto.id)));
        if (!response2) {
          openNotificationUI("Debe configurar un target", "error");
        }
      }

      dispatch(LoadingUISlice.actions.LoadingUIClose());
    } catch (e) {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
      openNotificationUI(e, "error");
    }
  };
  const onGetModelos = async () => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      const modelos = unwrapResult(await dispatch(OQCDesignadaResultadoSliceRequests.getModelosByLinea(linea.id)));
      setModelos(modelos);
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    } catch (e) {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
      openNotificationUI(e, "error");
    }
  };

  const handleYearChange = (fecha: any) => {
    setYear(fecha.toDate());
  };
  const onChangeCheck = (e) => {
    if (e.target.name == "lineas") {
      setLineas((value) => !value);
    } else {
      setFiltroModelos(filtroModelos ? false : true);
    }
  };
  const onChangeModelo = (e) => {
    setModelo(e.target.value);
  };

  useEffect(() => {
    TitleChanger("Reporte de OQC para SGI");
  }, []);

  useEffect(() => {
    if (filtroModelos && linea) {
      onGetModelos();
    }
  }, [linea]);
  useEffect(() => {
    if (!lineas) {
      setFiltroModelos(false);
    }
  }, [lineas]);
  return (
    <div className=" w-screen p-6">
      <div className={`flex flex-col gap-5 bg-secondaryNew px-20 py-5 justify-center items-center`}>
        <SelectOFPlantAndProducts selectLineas={lineas} notShadow>
          {filtroModelos && (
            <FormControl fullWidth variant="outlined">
              <InputLabel>Seleccione un modelo</InputLabel>
              <Select variant="standard" onChange={onChangeModelo}>
                {modelos?.map((model) => (
                  <MenuItem key={model} value={model}>
                    <div className="w-full">
                      <div>{model}</div>
                    </div>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        </SelectOFPlantAndProducts>
        <div className="flex gap-5 justify-center">
          <FormControlLabel
            control={<Checkbox name="lineas" defaultChecked value={lineas} onChange={onChangeCheck} />}
            label="Filtro lineas"
          />
          {lineas && (
            <FormControlLabel
              control={<Checkbox name="modelos" value={filtroModelos} onChange={onChangeCheck} />}
              label="Filtro modelos"
            />
          )}
          <DesktopDatePicker
            label="Año"
            views={["year"]}
            value={year}
            inputFormat="YYYY"
            maxDate={fechaActual}
            renderInput={(field) => <TextField {...field} variant="standard" />}
            onChange={(e: any) => {
              handleYearChange(e);
            }}
          />
          <Button
            className={color.blueButton}
            sx={{ maxWidth: "fit-content", margin: "auto", padding: "15px" }}
            onClick={onSearch}>
            <Search />
            Buscar
          </Button>
        </div>
      </div>
      {target && <GraficoReporteOQC />}
    </div>
  );
};
