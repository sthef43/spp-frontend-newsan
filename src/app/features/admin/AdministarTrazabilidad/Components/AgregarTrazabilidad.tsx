import { useAppDispatch } from "app/core/store/store";
import { IInicio } from "app/models";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { Button, TextField } from "@mui/material";
import moment from "moment";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { MaterialButtons } from "../../../../shared/components/material-ui/MaterialButtons";
import { unwrapResult } from "@reduxjs/toolkit";
import { InicioSliceRequests } from "app/Middleware/reducers/InicioSlice";

interface props {
  setModalAddFaltante: any;
  faltante: IInicio;
  refreshTable: any;
  refreshProducidos: any;
  fechaFilter: any;
}
export const AgregarTrazabilidad = ({
  setModalAddFaltante,
  faltante,
  refreshTable,
  refreshProducidos,
  fechaFilter
}: props): JSX.Element => {
  const initialState = {
    trazabilidad: ""
  };

  const buttonClasses = MaterialButtons();
  const { control, setValue, getValues, watch } = useForm({
    defaultValues: initialState
  });
  const { openNotificationUI } = useNotificationUI();

  const dispatch = useAppDispatch();

  const handleAgregar = async () => {
    const aux = {
      ...faltante
    };
    delete aux.idInicio;
    aux.fecha = fechaFilter;
    aux.fechaFin = fechaFilter;
    aux.hora = moment().format("h:mm:ss");
    aux.horaFin = moment().format("h:mm:ss");
    aux.codigoTrazabilidad = getValues("trazabilidad");
    console.log(aux);
    let fetchAgregarNumeroResult;
    try {
      fetchAgregarNumeroResult = unwrapResult(await dispatch(InicioSliceRequests.postRequest(aux)));
    } catch (error) {
      fetchAgregarNumeroResult = null;
    }
    if (fetchAgregarNumeroResult) {
      openNotificationUI("Número agregado con éxito", "success");
      refreshProducidos();
      refreshTable();
    } else {
      openNotificationUI("Error al agregar el número", "error");
    }
    setModalAddFaltante(false);
  };

  const handleCancelar = () => {
    setModalAddFaltante(false);
  };

  return (
    <div>
      <div>
        <Controller
          name="trazabilidad"
          control={control}
          render={({ field }) => (
            <TextField
              label="Codigo de Trazabilidad"
              {...field}
              fullWidth
              helperText="Ingrese un código de trazabilidad"
            />
          )}
        />
      </div>
      <div className=" text-center space-x-10 mt-10">
        <Button className={buttonClasses.blueButton} variant="contained" onClick={handleAgregar}>
          Guardar
        </Button>
        <Button className={buttonClasses.redButton} variant="contained" onClick={handleCancelar}>
          Cancelar
        </Button>
      </div>
    </div>
  );
};
