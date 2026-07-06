/* eslint-disable unused-imports/no-unused-vars */
import React, { useEffect, useMemo, useState } from "react";
import { Button, FormControl, FormHelperText, TextField } from "@mui/material";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import { Controller, useForm } from "react-hook-form";
import { useAppDispatch } from "app/core/store/store";
import TitleUIComponent from "app/shared/components/helpComponents/TitleUIComponent";
import "animate.css";
import { unwrapResult } from "@reduxjs/toolkit";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { ITrazaManual } from "app/models/ITrazaManual";
import { TableComponent } from "app/shared/components/Table/TableComponent";
import { ITrazaManualHistory } from "app/models/ITrazaManualHistory";
import _ from "lodash";
import moment from "moment";
import { TrazaManualHistorySliceRequests } from "../../slices/TrazaManualHistorySlice";
import { TrazaManualSliceRequests } from "../../slices/TrazaManualSlice";

const initialState = {
  codigoNewsan: "",
  codigoTrazabilidadDestino: "",
  codigoTrazabilidadOrigen: ""
};

export const ReasignacionNroSeriePage = (): JSX.Element => {
  const {
    control,
    setValue,
    getValues,
    watch,
    handleSubmit,
    reset,
    formState: { isDirty, isValid }
  } = useForm({
    defaultValues: initialState
  });

  const classes = MaterialButtons();
  const dispatch = useAppDispatch();
  const { TitleChanger } = useTitleOfApp();
  const { openNotificationUI } = useNotificationUI();

  const [destinoDisabled, setDestinoDisabled] = useState(true);
  const [guardarDisabled, setGuardarDisabled] = useState(true);
  const [dataHistory, setDataHistory] = useState<ITrazaManualHistory[]>([]);
  const [objetoInicio, setObjetoInicio] = useState<ITrazaManual>(null);

  const watchCodigoNewsan = watch("codigoNewsan");
  const watchCodigoTrazaOrigen = watch("codigoTrazabilidadOrigen");
  const watchCodigoTrazaDestino = watch("codigoTrazabilidadDestino");

  //FETCH PARA TRAERME EL OBJETO INICIO SEGUN CODIGO
  const getInicioByCodigoNewsan = async (codigoNewsan) => {
    let result: ITrazaManual;
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      result = unwrapResult(await dispatch(TrazaManualSliceRequests.getByNroSerie(codigoNewsan)));
      dispatch(LoadingUISlice.actions.LoadingUIClose());
      return result;
    } catch (error) {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
      result = null;
    }
  };

  //VERIFICA QUE EL CODIGO NEWSAN INGRESADO, EXISTA. SI ESTA, SE TRAE EL OBJETO Y LLENA EL INPUT "COGIO TRAZA ORIGEN"
  const verificarExistenciaCodigo = async () => {
    dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
    const codigoNewsan = getValues("codigoNewsan");
    if (codigoNewsan == "") setValue("codigoTrazabilidadOrigen", "");
    let objetoInicio: ITrazaManual | null;
    if (codigoNewsan != "") {
      objetoInicio = await getInicioByCodigoNewsan(codigoNewsan);
      if (objetoInicio) {
        const history = unwrapResult(
          await dispatch(TrazaManualHistorySliceRequests.getAllByNroSerieRequest(codigoNewsan))
        );
        setDataHistory(history);
        setValue("codigoTrazabilidadOrigen", objetoInicio.trazabilidad);
        setDestinoDisabled(false);
        setObjetoInicio(objetoInicio);
      } else {
        setDataHistory([]);
        openNotificationUI("Codigo invalido.", "error");
        setValue("codigoTrazabilidadOrigen", "");
        setDestinoDisabled(true);
      }
    }
    dispatch(LoadingUISlice.actions.LoadingUIClose());
  };

  //SI ESCRIBIO EL "CODIGO NEWSAN" Y "CODIGO TRAZA ORIGEN" TIENE INFO, ENTONCES PUEDE CARGAR EL "CODIGO TRAZA DESTINO"
  const puedeEscribirInputDestino = () => {
    if (getValues("codigoTrazabilidadOrigen") != "" && getValues("codigoTrazabilidadDestino") != "")
      setGuardarDisabled(false);
    else setGuardarDisabled(true);
  };

  // Espero a que termine de escribir el codigo o le doy tiempo
  const debo = useMemo(() => _.debounce(verificarExistenciaCodigo, 1000), []);
  //FETCH PARA SABER SI EXISTE O NO UN REGISTRO INICIO CON EL CODIGO QUE QUIERE ACTUALIZAR.
  const existeCodigoTrazabilidad = async (codigoTrazabilidadDestino) => {
    let result;
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      result = unwrapResult(await dispatch(TrazaManualSliceRequests.getByTraza(codigoTrazabilidadDestino)));
      dispatch(LoadingUISlice.actions.LoadingUIClose());
      return result ? true : false;
    } catch (e) {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
      console.log(e);
    }
  };

  //UPDETEA EL REGISTRO, CON EL CODIGO TRAZA DESTINO.
  const saveTraza = async (objTrazaManual) => {
    try {
      const newHistory = unwrapResult(
        await dispatch(TrazaManualHistorySliceRequests.PostRequest({ ...objTrazaManual, id: 0 }))
      );
      const response = await dispatch(TrazaManualSliceRequests.PutRequest(objTrazaManual));
      setDataHistory([]);
      return response;
    } catch (e) {
      console.log(e);
    }
  };

  //VERIFICA SI SE PUEDE ACTUALIZAR EL REGISTRO INICIO SEGUN LOS DATOS INGRESADOS.
  const submit = async () => {
    dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
    const codigoTrazabilidadDestino = getValues("codigoTrazabilidadDestino");
    const existeCodigoTraza = await existeCodigoTrazabilidad(codigoTrazabilidadDestino);
    if (existeCodigoTraza) {
      openNotificationUI("El codigo " + codigoTrazabilidadDestino + " ya esta en uso. Verifique! ", "error");
      setValue("codigoTrazabilidadDestino", "");
      dispatch(LoadingUISlice.actions.LoadingUIClose());
      return;
    }
    const objTrazaManual: ITrazaManual = { ...objetoInicio, trazabilidad: codigoTrazabilidadDestino };
    const save = await saveTraza(objTrazaManual);
    dispatch(LoadingUISlice.actions.LoadingUIClose());
    save && openNotificationUI("Actualizado con exito :)! ", "success");
    reset();
  };

  useEffect(() => {
    TitleChanger("Reasignación de número de serie en trazabilida manual/serie");
  }, []);

  useEffect(() => {
    puedeEscribirInputDestino();
  }, [watchCodigoTrazaOrigen, watchCodigoTrazaDestino]);

  useEffect(() => {
    if (watchCodigoNewsan.length >= 1) {
      debo();
    }
    // verificarExistenciaCodigo();
  }, [watchCodigoNewsan]);

  return (
    <div>
      <div className="m-1 sm:m-10 h-full">
        <form onSubmit={handleSubmit(submit)}>
          <div className="p-2 m-2 rounded-lg shadow-elevation-4 bg-secondaryNew">
            <div className="w-full flex justify-center ">
              <TitleUIComponent title="DATOS" classNameDiv="w-min whitespace-nowrap" classNameTitle="text-2xl" />
            </div>
            <div className="sm:flex md:flex items-center justify-around w-full font-semibold">
              <div className="text-center sm:text-left p-2">
                <Controller
                  name="codigoNewsan"
                  control={control}
                  rules={{ required: true }}
                  render={({ field, fieldState: { error } }) => (
                    <TextField
                      fullWidth
                      placeholder="Codigo Newsan"
                      label="Codigo Newsan"
                      variant="outlined"
                      type="text"
                      error={!!error?.types}
                      helperText={error?.type}
                      {...field}
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                  )}
                />
              </div>
              <div className="text-center sm:text-left p-2 w-1/6">
                <Controller
                  name="codigoTrazabilidadOrigen"
                  control={control}
                  rules={{ required: true }}
                  render={({ field, fieldState: { error } }) => (
                    <TextField
                      fullWidth
                      disabled={true}
                      label="Codigo trazabilidad origen"
                      variant="outlined"
                      type="text"
                      error={!!error?.types}
                      helperText={error?.type}
                      {...field}
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                  )}
                />
              </div>

              <div className="text-center sm:text-left p-2 w-1/6">
                <Controller
                  name="codigoTrazabilidadDestino"
                  control={control}
                  rules={{ required: true, minLength: 17, maxLength: 17 }}
                  render={({ field, fieldState: { error } }) => (
                    <FormControl fullWidth variant="outlined" error={!!error}>
                      <TextField
                        fullWidth
                        disabled={destinoDisabled}
                        label="Codigo trazabilidad destino"
                        variant="outlined"
                        {...field}
                        onChange={(e) => field.onChange(e.target.value)}
                      />
                      {!!error && error.type == "maxLength" && (
                        <FormHelperText>El máximo del código es de 17</FormHelperText>
                      )}
                      {!!error && error.type == "minLength" && (
                        <FormHelperText>El mínimo del código es de 17</FormHelperText>
                      )}
                    </FormControl>
                  )}
                />
              </div>
            </div>
            <div className=" flex justify-center ">
              <Button className={classes.greenButton} type="submit" variant="contained" disabled={guardarDisabled}>
                Guardar
              </Button>
            </div>
          </div>
        </form>
      </div>
      {dataHistory.length == 0 && getValues("codigoTrazabilidadOrigen").length > 1 && (
        <div className="p-2 m-2 rounded-lg shadow-elevation-4 bg-secondaryNew flex justify-center">
          <TitleUIComponent title="No hay historial" classNameDiv="w-min whitespace-nowrap" classNameTitle="text-2xl" />
        </div>
      )}
      {dataHistory.length > 0 && (
        <div className="p-2 m-2 rounded-lg shadow-elevation-4 bg-secondaryNew">
          <div className="flex flex-col flex-wrap items-center">
            <TitleUIComponent
              title="Historial de cambios"
              classNameDiv="w-min whitespace-nowrap"
              classNameTitle="text-2xl"
            />
            <TableComponent
              IDcolumn="id"
              columns={[
                {
                  title: "Codigo newsan",
                  field: "codigoNewsan"
                },
                {
                  title: "Trazabilidad manual",
                  field: "trazaManual1"
                },
                {
                  title: "Trazabilidad",
                  field: "trazabilidad"
                },
                {
                  title: "Fecha",
                  field: "",
                  render: (row) => {
                    return moment(row.createdDate).format("L") + " " + moment(row.createdDate).format("LTS");
                  }
                }
              ]}
              dataInfo={dataHistory}
            />
          </div>
        </div>
      )}
    </div>
  );
};
