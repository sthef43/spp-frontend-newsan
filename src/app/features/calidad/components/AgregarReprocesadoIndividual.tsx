import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button, TextField } from "@mui/material";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { useAppDispatch } from "app/core/store/store";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { GetInfoUser } from "app/shared/helpers/userConfig";
import { ReprocesoLineaSliceRequests } from "app/Middleware/reducers/ReprocesoLineaSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { OperatorSliceRequests } from "app/Middleware/reducers/OperatorSlice";
import { IOperator } from "app/models";
import moment from "moment";
interface props {
  refreshList?: any;
  idControlLote: number;
  codigosFaltantes: number[];
}
export const AgregarReprocesadoIndividual = ({ refreshList, idControlLote, codigosFaltantes }: props) => {
  const classes = MaterialButtons();
  interface initialState {
    codigo: string;
  }
  const initialStateVar = {
    codigo: ""
  };
  const dispatch = useAppDispatch();
  const { openNotificationUI } = useNotificationUI();
  const { control, setValue, getValues, handleSubmit, watch, formState } = useForm<initialState>({
    defaultValues: initialStateVar
  });
  const { isDirty, isValid, errors } = formState;

  const getInfoUser = async () => {
    const user = GetInfoUser();
    let result;
    try {
      result = unwrapResult(await dispatch(OperatorSliceRequests.getInfoByDni(user.dni)));
    } catch (e) {
      console.log(e);
    }
    if (result) return result;
  };

  const armarObjetoReprocesoLinea = async () => {
    const date = new Date();
    const user: IOperator = await getInfoUser();
    const objeto = {
      Fecha: moment().format("YYYY-MM-DD"),
      Hora: date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds(),
      IdControlLote: idControlLote,
      NombreUsuario: `${user.name} ${user.surname}`,
      CodigoNewsan: getValues("codigo")
    };
    return objeto;
  };

  useEffect(() => {
    console.log(errors);
  }, [errors]);

  //Verifica que el codigo ingresado sea valido. Debe tener 15 digitos y los ultimos digitos deben estar dentro de los numeros que faltan.
  const codigoCorrecto = (codigo: string) => {
    if (codigo.length != 15) return false; //si el codigo no tiene 15 digitos, es invalido.
    const codigoSinPrimerosdigitos = parseInt(codigo.substring(5)); //Le saco los primero 5 digitos q son estaticos
    const codigoSinCeros = Number(codigoSinPrimerosdigitos); //Saco los 0 de mas.
    if (!codigosFaltantes.includes(codigoSinCeros)) return false;
    return true;
  };

  const loginSubmit = async (e) => {
    let result;
    const objeto = await armarObjetoReprocesoLinea();
    const puedeGuardar = codigoCorrecto(objeto.CodigoNewsan);
    if (puedeGuardar) {
      try {
        result = await dispatch(ReprocesoLineaSliceRequests.postRequest(JSON.parse(JSON.stringify(objeto))));
      } catch (x) {
        result = null;
      }
      if (result) {
        openNotificationUI("Guardado exitosamente ", "success");
        refreshList();
        setValue("codigo", "");
      }
      console.log("puedeguardar");
    } else {
      openNotificationUI("Codigo incorrecto", "error");
    }
  };

  return (
    <div style={{ height: "100%", width: "60vw", position: "relative" }}>
      <form onSubmit={handleSubmit(loginSubmit)} style={{ width: "100%", height: "100%" }}>
        <div className="flex flex-col" style={{ height: "100%" }}>
          <div className="py-2 grid grid-cols-1 gap-10 overflow-auto" style={{ flex: "1 1 90%" }}>
            <Controller
              name="codigo"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  fullWidth
                  placeholder="Codigo"
                  label="Codigo"
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
          <div className="pt-1 flex justify-around border-t-2" style={{ flex: "1 1 10%" }}>
            <Button className={classes.greenButton} type="submit" variant="contained" disabled={!isDirty && !isValid}>
              Guardar
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};
