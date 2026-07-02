import React, { useEffect, useState } from "react";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import { Button, Divider, TextField } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { unwrapResult } from "@reduxjs/toolkit";
import { useAppDispatch } from "app/core/store/store";
import { IInicio } from "app/models/IInicio";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { FinalizacionTable } from "app/features/produccion/modules/reporteHistorialEquipo/components/FinalizacionTable";
import { InicializacionTable } from "app/features/produccion/modules/reporteHistorialEquipo/components/InicializacionTable";
import { InicioSliceRequests } from "app/Middleware/reducers/InicioSlice";
import { ReparacionesTable } from "app/features/produccion/modules/reporteHistorialEquipo/components/ReparacionesTable";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { RechazosInformesTable } from "app/features/produccion/modules/reporteHistorialEquipo/components/RechazosInfomesTable";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { PlisTable } from "app/features/produccion/modules/reporteHistorialEquipo/components/PlisTable";
import { TrazabilidadLgSliceRequests } from "app/Middleware/reducers/TrazabilidadLgSlice";

export const HistorialEquipos = (): JSX.Element => {
  const initialState = {
    numTrazabilidad: "",
    numNewsan: "",
    servisLg: ""
  };

  const { control, setValue, watch } = useForm({
    defaultValues: initialState
  });

  const classes = MaterialButtons();
  const dispatch = useAppDispatch();
  const { TitleChanger } = useTitleOfApp();
  const [registroInicio, setRegistroInicio] = useState<IInicio>(null);
  const watchNumTrazabilidad = watch("numTrazabilidad");
  const watchNumNewsan = watch("numNewsan");
  const watchServisLg = watch("servisLg");

  React.useEffect(() => {
    TitleChanger("historial de equipos por codigo de trazabilidad");
  }, []);

  const getInicioByNumeroTrazabilidad = async (traza) => {
    dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando"));
    let fetchInicioResult: IInicio;
    try {
      fetchInicioResult = unwrapResult(
        await dispatch(InicioSliceRequests.getByCodigoTrazabilidad(traza != null ? traza : watchNumTrazabilidad))
      );
    } catch (error) {
      fetchInicioResult = null;
    }
    if (fetchInicioResult) {
      setRegistroInicio(fetchInicioResult);
      getServisLGByTrazabilidad(fetchInicioResult.codigoTrazabilidad);
    } else {
      setRegistroInicio(null);
      openNotificationUI("No se encuentran datos", "warning");
    }
    dispatch(LoadingUISlice.actions.LoadingUIClose());
  };

  const getServisLGByTrazabilidad = async (traza) => {
    let result = null;
    result = unwrapResult(await dispatch(TrazabilidadLgSliceRequests.getByTrazabilidad(traza)));
    if (result) {
      setValue("servisLg", result.servisLg);
    } else openNotificationUI("No existe servis LG. ", "info");
  };

  const getInicioByNumeroNewsan = async () => {
    dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando"));
    let fetchInicioResult: IInicio;
    try {
      fetchInicioResult = unwrapResult(await dispatch(InicioSliceRequests.getByCodigoNewsan(watchNumNewsan)));
    } catch (error) {
      fetchInicioResult = null;
    }
    if (fetchInicioResult) {
      setRegistroInicio(fetchInicioResult);
    } else {
      openNotificationUI("No se encuentran datos", "warning");
    }
    dispatch(LoadingUISlice.actions.LoadingUIClose());
  };

  const { openNotificationUI } = useNotificationUI();

  useEffect(() => {
    if (registroInicio) {
      setValue("numTrazabilidad", registroInicio.codigoTrazabilidad);
      setValue("numNewsan", registroInicio.codigoNewsan);
    }
  }, [registroInicio]);

  const search = () => {
    if (watchServisLg != "") {
      getDataByServisLg();
      return false;
    }
    //Y si esta vacio, es por que insertaron un dato en el campo N° de Trazabilidad
    if (watchNumTrazabilidad == "" && watchNumNewsan == "") {
      setRegistroInicio(null);
      openNotificationUI("Inserte N° de Trazabilidad o N° de Newsan", "info");
      return false;
    }
    if (watchNumTrazabilidad) getInicioByNumeroTrazabilidad(null);
    else if (watchNumNewsan) getInicioByNumeroNewsan();
  };

  const limpiarCampos = () => {
    setValue("numNewsan", "");
    setValue("numTrazabilidad", "");
    setValue("servisLg", "");
    setRegistroInicio(null);
  };

  const getDataByServisLg = async () => {
    let result;
    try {
      result = unwrapResult(await dispatch(TrazabilidadLgSliceRequests.getByNroSrv(watchServisLg)));
    } catch (error) {
      console.log(error);
    }
    if (!result) {
      openNotificationUI("No existe registro.", "warning");
      setRegistroInicio(null);
      setValue("numTrazabilidad", "");
      setValue("numNewsan", "");
      return false;
    }

    if (result.trazabilidad == null) {
      setRegistroInicio(null);
      openNotificationUI("El registro existe pero no contiene trazabilidad.", "warning");
      return false;
    }
    setValue("numTrazabilidad", result.trazabilidad);
    getInicioByNumeroTrazabilidad(result.trazabilidad);
  };

  return (
    <div>
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <div className="m-1 sm:m-10 h-full">
          <div className="p-2 m-2 rounded-lg shadow-elevation-4 bg-secondaryNew">
            <div className="sm:flex md:flex items-center justify-around w-full font-semibold">
              <div className="text-center sm:text-left p-2">
                <Controller
                  name="servisLg"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <TextField
                      fullWidth
                      placeholder="Servis LG"
                      label="Servis LG"
                      variant="outlined"
                      type="text"
                      value={""}
                      error={!!error?.types}
                      helperText={error?.type}
                      {...field}
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                  )}
                />
              </div>
              <div className="text-center sm:text-left p-2">
                <Controller
                  name="numTrazabilidad"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <TextField
                      fullWidth
                      placeholder="N° de Trazabilidad"
                      label="N° de Trazabilidad"
                      variant="outlined"
                      type="text"
                      value={watchNumNewsan}
                      error={!!error?.types}
                      helperText={error?.type}
                      {...field}
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                  )}
                />
              </div>
              <div className="text-center sm:text-left p-2">
                <Controller
                  name="numNewsan"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <TextField
                      fullWidth
                      placeholder="N° de Newsan"
                      label="N° de Newsan"
                      variant="outlined"
                      type="text"
                      value={""}
                      error={!!error?.types}
                      helperText={error?.type}
                      {...field}
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                  )}
                />
              </div>
              <div>
                <Button color="primary" className={classes.purpleButton} onClick={limpiarCampos}>
                  Limpiar campos
                </Button>
                <Button
                  color="primary"
                  className={classes.greenButton}
                  onClick={(e) => {
                    search();
                  }}>
                  Buscar
                </Button>
              </div>
            </div>
          </div>
          <Divider />
          {registroInicio && (
            <div className="animate__animated animate__fadeInUp">
              <div className="grid sm:grid-cols-4 grid-cols-1 gap-4">
                <div className="sm:col-span-2">
                  <InicializacionTable registroInicio={registroInicio}></InicializacionTable>
                </div>
                <div className="sm:col-span-2">
                  <FinalizacionTable registroInicio={registroInicio}></FinalizacionTable>
                </div>
                <div className="sm:col-span-2">
                  <ReparacionesTable registroInicio={registroInicio}></ReparacionesTable>
                </div>
                <div className="sm:col-span-2">
                  <RechazosInformesTable registroInicio={registroInicio}></RechazosInformesTable>
                </div>
              </div>
              <div>
                <PlisTable registroInicio={registroInicio}></PlisTable>
              </div>
            </div>
          )}
        </div>
      </LocalizationProvider>
    </div>
  );
};
