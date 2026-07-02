/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button, FormControl, FormHelperText, TextField } from "@mui/material";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { useAppDispatch } from "app/core/store/store";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { IContEmbarque } from "app/models/IContEmbarque";
import { toUpper } from "lodash";
import { ContEmbarqueSliceRequests } from "app/Middleware/reducers/ContEmbarqueSlice";
import { unwrapResult } from "@reduxjs/toolkit";
interface props {
  setOpenPopup: any;
  editStateEmbarque?: IContEmbarque | null;
  refresh?: any;
  estaEditandoEmbarque: any;
}

export const EmbarqueForm = ({ setOpenPopup, editStateEmbarque, refresh, estaEditandoEmbarque }: props) => {
  console.log(editStateEmbarque);
  const classes = MaterialButtons();
  interface initialState {
    contPlanProduccionId: number;
    detalle: string;
    numero: string;
  }
  const initialStateVar = {
    contPlanProduccionId: 0,
    detalle: "",
    numero: ""
  };
  const dispatch = useAppDispatch();
  const { openNotificationUI } = useNotificationUI();
  const { control, setValue, getValues, handleSubmit, watch, formState } = useForm<initialState>({
    defaultValues: estaEditandoEmbarque ? editStateEmbarque : initialStateVar
  });
  const { isDirty, isValid, errors } = formState;
  useEffect(() => {
    console.log(errors);
    return () => {
      //
    };
  }, [errors]);

  //Actualizo o Guardo
  const loginSubmit = async (e) => {
    let result;
    const objectSubmit = {
      ...e,
      contPlanProduccion: null,
      contPlanProduccionId: editStateEmbarque.contPlanProduccionId ?? editStateEmbarque.id,
      detalle: toUpper(e.detalle),
      numero: toUpper(e.numero)
    };
    console.log(objectSubmit);

    try {
      if (estaEditandoEmbarque) {
        result = unwrapResult(await dispatch(ContEmbarqueSliceRequests.PutRequest(objectSubmit)));
      } else {
        result = unwrapResult(await dispatch(ContEmbarqueSliceRequests.PostRequest(objectSubmit)));
      }
      openNotificationUI("Guardado...", "success");
      refresh();
      setOpenPopup(false);
    } catch (x) {
      openNotificationUI("Error al guardar.", "error");
      result = null;
    }
  };

  //Cargo lista con Plantas
  // const [listPlantas, setListPlantas] = useState([]);
  // const getListPlantas = async () => {
  //   try {
  //     const responses = unwrapResult(await dispatch(ContPlantaSliceRequests.getAllRequest()));
  //     setListPlantas(responses);
  //   } catch (error) {
  //     openNotificationUI("Error al leer Plantas.", "error");
  //   }
  // };
  // useEffect(() => {
  //   console.log(listPlantas);
  // }, [listPlantas]);

  // useEffect(() => {
  //   getListPlantas();
  // }, []);

  return (
    <div style={{ height: "100%", width: "60vw", position: "relative" }}>
      <form onSubmit={handleSubmit(loginSubmit)} style={{ width: "100%", height: "100%" }}>
        <div className="m-1 sm:m-10 h-full">
          <div className=" flex-col grid grid-cols-2 gap-30 " style={{ height: "100%" }}>
            <div className="py-2 gap-10 overflow-auto m-2" style={{ flex: "1 1 90%" }}>
              <Controller
                name="detalle"
                control={control}
                rules={{ required: true }}
                render={({ field, fieldState: { error } }) => (
                  <FormControl fullWidth variant="outlined" error={!!error}>
                    <TextField
                      fullWidth
                      label="Embarque"
                      variant="standard"
                      type="text"
                      inputProps={{ style: { textTransform: "uppercase" } }}
                      {...field}
                      // onChange={(e) => {
                      //   field.onChange(e.target.value.toUpperCase());
                      //   concatenarCodigo("vProducto");
                      // }}
                    />
                    {!!error && <FormHelperText>{error.type}</FormHelperText>}
                  </FormControl>
                )}
              />
            </div>
            <div className="py-2 gap-10 overflow-auto m-2" style={{ flex: "1 1 90%" }}>
              <Controller
                name="numero"
                control={control}
                rules={{ required: true }}
                render={({ field, fieldState: { error } }) => (
                  <FormControl fullWidth variant="outlined" error={!!error}>
                    <TextField
                      fullWidth
                      label="Número"
                      variant="standard"
                      type="text"
                      inputProps={{ style: { textTransform: "uppercase" } }}
                      {...field}
                      // onChange={(e) => {
                      //   field.onChange(e.target.value.toUpperCase());
                      //   concatenarCodigo("vProducto");
                      // }}
                    />
                    {!!error && <FormHelperText>{error.type}</FormHelperText>}
                  </FormControl>
                )}
              />
            </div>
          </div>

          <div className="pt-5 flex justify-around" style={{ flex: "1 1 10%" }}>
            <Button className={classes.greenButton} type="submit" variant="contained" disabled={!isDirty && !isValid}>
              Guardar
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};
