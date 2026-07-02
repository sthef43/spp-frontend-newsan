/* eslint-disable unused-imports/no-unused-vars */
import { Button, TextField } from "@mui/material";
import { unwrapResult } from "@reduxjs/toolkit";
import { SerieLgSliceRequests } from "app/Middleware/reducers/SerieLgSlice";
import { TrazabilidadLgSliceRequests } from "app/Middleware/reducers/TrazabilidadLgSlice";
import { useAppDispatch } from "app/core/store/store";
import { ISerieLg } from "app/models/ISerieLg";
import { ITrazabilidadLg } from "app/models/ITrazabilidadLg";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { useConfirmationDialog } from "app/shared/hooks/useConfirmationDialog";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

export const DesvincularServiceLg = () => {
  const classes = MaterialButtons();
  const dispatch = useAppDispatch();
  const { openNotificationUI } = useNotificationUI();
  const { getConfirmation } = useConfirmationDialog();

  interface initialState {
    codigo?: string | null;
  }
  const initialStateVar = {
    codigo: ""
  };

  const {
    control,
    setValue,
    getValues,
    handleSubmit,
    watch,
    formState: { isDirty, isValid, errors }
  } = useForm<initialState>({
    defaultValues: initialStateVar
  });

  //Buscar
  const [traza, setTraza] = useState<ITrazabilidadLg | null>(null);
  const [serie, setSerie] = useState<ISerieLg | null>(null);
  const [searched, setSearched] = useState(false);
  const getTraza = async (e) => {
    try {
      const result = unwrapResult(await dispatch(TrazabilidadLgSliceRequests.getByTrazabilidad(e.codigo)));
      setTraza(result);
      setSearched(true);
    } catch (error) {
      setTraza(null);
      setSearched(true);
      openNotificationUI("No se encontro código de Trazabilidad", "error");
    }
  };

  const getSerie = async () => {
    try {
      const result = unwrapResult(await dispatch(SerieLgSliceRequests.getByNroSrv(traza.servisLg)));
      setSerie(result);
    } catch (error) {
      openNotificationUI("No se encontro código de Serie", "error");
    }
  };

  //Eliminar
  const eliminar = async () => {
    const resp = await getConfirmation(
      "Desvincular el siguiente registro?",
      "Trazabilidad: " + traza.trazabilidad + ". Service: " + traza.servisLg
    );
    if (resp) {
      try {
        const response = unwrapResult(await dispatch(TrazabilidadLgSliceRequests.DeleteByIdRequest(traza.id)));
        const response2 = unwrapResult(
          await dispatch(SerieLgSliceRequests.ClearUsadoByTrazaRequest(serie.trazabilidad))
        );
        openNotificationUI("Desvinculación correcta", "success");
        setValue("codigo", "");
      } catch (error) {
        openNotificationUI("Error al desvincular el registro.", "error");
      }
    }
  };

  useEffect(() => {
    if (serie) {
      eliminar();
    }
  }, [serie]);

  useEffect(() => {
    if (traza) {
      getSerie();
    } else if (searched) {
      openNotificationUI("No se encontro código de Trazabilidad", "error");
    }
  }, [traza, searched]);

  return (
    <div style={{ height: "100%", width: "60vw", position: "relative" }}>
      <form onSubmit={handleSubmit(getTraza)} style={{ width: "100%", height: "100%" }}>
        <div className="m-1 sm:flex md:flex items-top justify-around w-full font-semibold">
          <div className="m-2 p-7 rounded-lg shadow-elevation-4 bg-secondaryNew" style={{ flex: "1 1 70%" }}>
            {/* <div className="m-2 p-7 rounded-lg shadow-elevation-4 bg-secondaryNew" style={{ flex: "1 1 90%" }}> */}
            <Controller
              name="codigo"
              control={control}
              rules={{ required: false }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  fullWidth
                  label="Código de Trazabilidad"
                  variant="standard"
                  type="text"
                  inputProps={{ maxLength: 200 }}
                  error={!!error?.types}
                  helperText={error?.type}
                  {...field}
                  onChange={(e) => field.onChange(e.target.value)}
                />
              )}
            />
          </div>
          <div className="p-2 flex justify-around" style={{ flex: "1 1 10%" }}>
            <Button className={classes.greenButton} type="submit" variant="contained" disabled={!isDirty && !isValid}>
              Buscar
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};
