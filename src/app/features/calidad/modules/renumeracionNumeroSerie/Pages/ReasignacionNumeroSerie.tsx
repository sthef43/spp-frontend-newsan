import React, { useEffect, useMemo, useState } from "react";
import { Button, FormControl, FormHelperText, TextField } from "@mui/material";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import { Controller, useForm } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import TitleUIComponent from "app/shared/components/helpComponents/TitleUIComponent";
import "animate.css";
import { unwrapResult } from "@reduxjs/toolkit";
import { IAppUser, IInicio } from "app/models";
import { InicioSliceRequests } from "app/Middleware/reducers/InicioSlice";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { IInicioHistory } from "app/models/IInicioHistory";
import _ from "lodash";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { InicioHistoryTable } from "app/features/calidad/modules/renumeracionNumeroSerie/Components/InicioHistoryTable";
import { InicioHistorySliceRequests } from "app/Middleware/reducers/InicioHistorySlice";
import { TrazaManualSliceRequests } from "app/Middleware/reducers/TrazaManualSlice";
// import { useConfirmationDialog } from "app/shared/hooks/useConfirmationDialog";
import { ITrazaManual } from "app/models/ITrazaManual";
import { TrazaManualHistorySliceRequests } from "app/Middleware/reducers/TrazaManualHistorySlice";

export const ReasignacionNumeroSerie = (): JSX.Element => {
  const classes = MaterialButtons();
  const infoUser: IAppUser = useAppSelector<IAppUser>((state) => state.appUser.data as any);
  const dispatch = useAppDispatch();
  const { TitleChanger } = useTitleOfApp();
  const { openNotificationUI } = useNotificationUI();
  const [destinoDisabled, setDestinoDisabled] = useState(true);
  const [guardarDisabled, setGuardarDisabled] = useState(true);
  const [objetoInicio, setObjetoInicio] = useState<IInicio>(null);
  const [dataHistory, setDataHistory] = useState<IInicioHistory[]>([]);

  const initialState = {
    codigoNewsan: "",
    codigoTrazabilidadDestino: "",
    codigoTrazabilidadOrigen: ""
  };

  const { control, setValue, getValues, watch, handleSubmit, reset } = useForm({
    defaultValues: initialState
  });

  //General
  useEffect(() => {
    TitleChanger("Reasignación de número de serie");
  }, []);

  //Watch
  const watchCodigoNewsan = watch("codigoNewsan");
  const watchCodigoTrazaOrigen = watch("codigoTrazabilidadOrigen");
  const watchCodigoTrazaDestino = watch("codigoTrazabilidadDestino");

  //***** Verificar

  //SI ESCRIBIO EL "CODIGO NEWSAN" Y "CODIGO TRAZA ORIGEN" TIENE INFO, ENTONCES PUEDE CARGAR EL "CODIGO TRAZA DESTINO"
  const puedeEscribirInputDestino = () => {
    if (getValues("codigoTrazabilidadOrigen") != "" && getValues("codigoTrazabilidadDestino") != "")
      setGuardarDisabled(false);
    else setGuardarDisabled(true);
  };

  useEffect(() => {
    puedeEscribirInputDestino();
  }, [watchCodigoTrazaOrigen, watchCodigoTrazaDestino]);

  //FETCH PARA TRAERME EL OBJETO INICIO SEGUN CODIGO
  const getInicioByCodigoNewsan = async (codigoNewsan) => {
    let result: IInicio;
    try {
      result = unwrapResult(await dispatch(InicioSliceRequests.getByCodigoNewsan(codigoNewsan)));
    } catch (error) {
      result = null;
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
    return result;
  };

  //VERIFICA QUE EL CODIGO NEWSAN INGRESADO, EXISTA. SI ESTA, SE TRAE EL OBJETO Y LLENA EL INPUT "COGIO TRAZA ORIGEN"
  const verificarExistenciaCodigo = async () => {
    dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
    const codigoNewsan = getValues("codigoNewsan");
    if (codigoNewsan == "") setValue("codigoTrazabilidadOrigen", "");
    let objetoInicio: IInicio | null;
    if (codigoNewsan != "") {
      objetoInicio = await getInicioByCodigoNewsan(codigoNewsan);
      if (objetoInicio) {
        const history = unwrapResult(await dispatch(InicioHistorySliceRequests.getAllByNroSerie(codigoNewsan)));
        setDataHistory(history);
        setValue("codigoTrazabilidadOrigen", objetoInicio.codigoTrazabilidad);
        setDestinoDisabled(false);
        setObjetoInicio(objetoInicio);
        // dispatch(LoadingUISlice.actions.LoadingUIClose());
      } else {
        setDataHistory([]);
        openNotificationUI("Codigo invalido.", "error");
        setValue("codigoTrazabilidadOrigen", "");
        setDestinoDisabled(true);
        // dispatch(LoadingUISlice.actions.LoadingUIClose());
      }
    }
    dispatch(LoadingUISlice.actions.LoadingUIClose());
  };

  // Espero a que termine de escribir el codigo o le doy tiempo
  const debo = useMemo(() => _.debounce(verificarExistenciaCodigo, 1000), []);

  useEffect(() => {
    if (watchCodigoNewsan.length >= 1) {
      debo();
    }
  }, [watchCodigoNewsan]);

  //************************************************************************************************************* */
  //***** Guardar

  //FETCH PARA SABER SI EXISTE O NO UN REGISTRO INICIO CON EL CODIGO QUE QUIERE ACTUALIZAR.
  const existeCodigoTrazabilidad = async (codigoTrazabilidadDestino) => {
    let result;
    try {
      result = unwrapResult(
        await dispatch(InicioSliceRequests.getByCodigoTrazabilidadDisponible(codigoTrazabilidadDestino))
      );
      return result ? true : false;
    } catch (e) {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
      console.log(e);
    }
  };

  const tieneManual = async (nroSerie) => {
    let result;
    try {
      result = unwrapResult(await dispatch(TrazaManualSliceRequests.getByNroSerie(nroSerie)));
      return result;
    } catch (e) {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
      console.log(e);
    }
  };

  const changeTrazaSerieoManual = async (trazaManual, codTrazaD) => {
    try {
      await dispatch(TrazaManualSliceRequests.PutRequest({ ...trazaManual, trazabilidad: codTrazaD }));
      unwrapResult(await dispatch(TrazaManualHistorySliceRequests.PostRequest({ ...trazaManual, id: 0 })));
    } catch (e) {
      openNotificationUI(e, "error");
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
  };

  const limpiarCampos = () => {
    setValue("codigoNewsan", "");
    setValue("codigoTrazabilidadOrigen", "");
    setValue("codigoTrazabilidadDestino", "");
    reset(initialState);
    setDestinoDisabled(true);
    setGuardarDisabled(true);
    setObjetoInicio(null);
    setDataHistory([]);
    if (debo?.cancel) debo.cancel();
  };
  //UPDETEA EL REGISTRO, CON EL CODIGO TRAZA DESTINO.
  const saveInicio = async (newInicio) => {
    try {
      await dispatch(
        InicioHistorySliceRequests.PostRequest({
          ...objetoInicio,
          id: 0,
          userName: infoUser.operator.name + " " + infoUser.operator.surname,
          codigoTrazabilidad: getValues("codigoTrazabilidadDestino"),
          codigoTrazabilidadOriginal: objetoInicio.codigoTrazabilidad
        })
      );
      unwrapResult(
        await dispatch(
          InicioSliceRequests.cambiarTrazaRequest({
            inicio: { ...newInicio, codigoTrazabilidad: getValues("codigoTrazabilidadDestino") },
            trazaVieja: objetoInicio.codigoTrazabilidad
          })
        )
      );
      openNotificationUI("Actualizado con éxito :)! ", "success");
      limpiarCampos();
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    } catch (e) {
      openNotificationUI(e, "error");
      dispatch(LoadingUISlice.actions.LoadingUIClose());
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
    const trazaManual: ITrazaManual = await tieneManual(objetoInicio.codigoNewsan);
    if (trazaManual?.trazabilidad != codigoTrazabilidadDestino) {
      await changeTrazaSerieoManual(trazaManual, codigoTrazabilidadDestino);
    }
    await saveInicio(objetoInicio);
  };

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
                      autoFocus
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
            <div className="w-full flex justify-center ">
              <Button className={classes.greenButton} type="submit" variant="contained" disabled={guardarDisabled}>
                Guardar
              </Button>
            </div>
          </div>
        </form>
      </div>
      <InicioHistoryTable codigoSerie={getValues("codigoNewsan")} dataHistory={dataHistory} />
    </div>
  );
};
