import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button, TextField } from "@mui/material";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { useAppDispatch } from "app/core/store/store";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { IPautaIngenieria } from "app/models/IPautaIngenieria";
import { PautaIngenieriaAprobadaSliceRequest } from "app/Middleware/reducers/PautaIngenieriaAprobadaSlice";
import { Hoja0SliceRequest } from "app/Middleware/reducers/Hoja0Slice";
import { unwrapResult } from "@reduxjs/toolkit";

interface props {
  refresh?: any;
  pauta: IPautaIngenieria;
  diferenciaState: number;
  familiaSeleccionada: string;
}

interface initialState {
  codigo: string;
  descripcion: string;
}
const initialStateVar = {
  codigo: "",
  descripcion: ""
};

export const PautasAprobadasForm = ({ refresh, pauta, diferenciaState, familiaSeleccionada }: props) => {
  const {
    control,
    setValue,
    getValues,
    handleSubmit,
    formState: { isDirty, isValid, errors }
  } = useForm<initialState>({
    defaultValues: initialStateVar
  });

  const classes = MaterialButtons();
  const [descripcionHoja0, setDescripcionHoja0] = useState(null);
  const dispatch = useAppDispatch();
  const { openNotificationUI } = useNotificationUI();

  const [botonDisabled, setBotonDisabled] = useState(false);

  const getSubString = (inicio, fin) => {
    const codigo = getValues("codigo");
    return codigo.substring(inicio, fin);
  };

  //Verifica si el codigo ingresado esta en algun registro de Hoja0. Si esta es xq fue una pauta aprobada y Ingenieria la dio de baja.
  const getHoja0ByCodigo = async (codigo) => {
    const objetoHoja0 = unwrapResult(await dispatch(Hoja0SliceRequest.getAllRequest()));
    const objetoHoja0Retorno = objetoHoja0.find((x) => x.codigo == codigo) ?? null;
    if (objetoHoja0Retorno) {
      setDescripcionHoja0(objetoHoja0Retorno.descripcion);
    } else {
      setDescripcionHoja0(null);
    }
  };

  //Verifica que el formato del codigo sea correcto, con respecto a las cantidades que tiene que cumplir cada porcion que lo compone.
  const verificarCodigo = async (codigo: string) => {
    const { cantVersionProceso, cantGenerico, cantPlataforma, cantLinea, cantPuesto } = pauta;
    let finCorte = cantVersionProceso;
    const versionProceso = getSubString(0, finCorte);
    const generico = getSubString(finCorte, finCorte + cantGenerico);
    finCorte += cantGenerico;
    const plataforma = getSubString(finCorte, finCorte + cantPlataforma);
    finCorte += cantPlataforma;
    const linea = getSubString(finCorte, finCorte + cantLinea);
    finCorte += cantLinea;
    const puesto = codigo.substring(finCorte, codigo.length);
    console.log(generico != familiaSeleccionada);
    //Verifico que los datos obtenidos tengan todos la longitud que deben tener.
    if (
      generico != familiaSeleccionada ||
      versionProceso.length != cantVersionProceso ||
      generico.length != cantGenerico ||
      plataforma.length != cantPlataforma ||
      linea.length != cantLinea ||
      puesto.length > cantPuesto
    ) {
      openNotificationUI("El codigo no corresponde.", "error");
      setValue("codigo", "");
      document.getElementById("codigo").focus();
      return null;
    }

    const pautaIngenieriaAprobada = {
      pautaIngenieriaId: pauta.id,
      codigo: getValues("codigo"),
      versionProceso: versionProceso,
      generico: generico,
      plataforma: plataforma,
      linea: linea,
      puesto: puesto,
      activo: true
    };

    return pautaIngenieriaAprobada;
  };

  const loginSubmit = async (e) => {
    const inputCodigo = getValues("codigo");
    const objetoPautaIngenieriaAprobada = await verificarCodigo(inputCodigo);
    let result;
    if (objetoPautaIngenieriaAprobada != null) {
      try {
        getHoja0ByCodigo(inputCodigo); //Si el codigo esta en una hoja0, muestra el codigo
        result = await dispatch(
          PautaIngenieriaAprobadaSliceRequest.PostRequest(JSON.parse(JSON.stringify(objetoPautaIngenieriaAprobada)))
        );
      } catch (x) {
        result = null;
      }
      const ParamName = JSON.stringify(result.payload.ParamName == undefined); //me fijo si el paramName esta disponible
      const tieneError = ParamName == "false"; //Si es false, significa que tiene dato, entonces encontro un error.
      setValue("codigo", "");
      if (result && !tieneError) {
        openNotificationUI("Guardado exitosamente :)", "success");
        refresh();
      } else {
        //Tiene error, es el unique de que ya se escaneo el codigo  !
        openNotificationUI(result.payload.ParamName, "warning");
      }
    }
  };

  useEffect(() => {
    console.log(errors);
  }, [errors]);

  useEffect(() => {
    if (descripcionHoja0 != null) {
      setValue("descripcion", descripcionHoja0);
    } else {
      setValue("descripcion", null);
    }
  }, [descripcionHoja0]);

  //Si la diferencia es 0 no puede guardar mas.
  useEffect(() => {
    if (diferenciaState == 0) {
      setBotonDisabled(true);
      setValue("codigo", "");
    } else {
      setBotonDisabled(false);
    }
  }, [diferenciaState]);

  return (
    <div style={{ height: "%", width: "60vw", position: "relative" }}>
      <form onSubmit={handleSubmit(loginSubmit)} style={{ width: "100%", height: "100%" }}>
        <div className=" flex-col grid grid-cols-1  " style={{ height: "80%" }}>
          <div className="py-2 overflow-auto" style={{ flex: "1 1 90%" }}>
            <Controller
              name="codigo"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  fullWidth
                  label="Codigo"
                  variant="outlined"
                  type="text"
                  disabled={botonDisabled}
                  error={!!error?.types}
                  helperText={error?.type}
                  {...field}
                  onChange={(e) => field.onChange(e.target.value)}
                />
              )}
            />
          </div>
          {descripcionHoja0 && (
            <div className="py-2 overflow-auto" style={{ flex: "1 1 90%" }}>
              <Controller
                name="descripcion"
                control={control}
                //defaultValue={descripcionHoja0}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    fullWidth
                    disabled={true}
                    label="Descripcion"
                    variant="outlined"
                    type="text"
                    //value={descripcionHoja0}
                    error={!!error?.types}
                    helperText={error?.type}
                    {...field}
                    onChange={(e) => field.onChange(e.target.value)}
                  />
                )}
              />
            </div>
          )}
          <div className="pt-1 flex justify-around" style={{ flex: "1 1 10%" }}>
            <Button
              className={classes.greenButton}
              type="submit"
              variant="contained"
              disabled={(!isDirty && !isValid) || botonDisabled}>
              Guardar
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};
