import React from "react";
import { useAppDispatch } from "app/core/store/store";
import { useForm } from "react-hook-form";
import { GenericFieldsGenerator } from "app/shared/helpers/GenericFieldsGenerator";
import { IInstpuesto } from "app/models";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { Button } from "@mui/material";
import { unwrapResult } from "@reduxjs/toolkit";
import { InstpuestoSliceRequests } from "app/Middleware/reducers/InstpuestoSlice";
import { useConfirmationDialog } from "app/shared/hooks/useConfirmationDialog";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";

interface props {
  puesto: IInstpuesto;
  callback: any;
  refreshTable: any;
}

export const PuestoDialog = ({ puesto, callback, refreshTable }: props): JSX.Element => {
  const dispatch = useAppDispatch();
  const buttonClasses = MaterialButtons();
  const { getConfirmation } = useConfirmationDialog();
  const { openNotificationUI } = useNotificationUI();

  const defaultPuestoLabels = {
    codigoPuesto: "Codigo Puesto",
    descripcion: "Descripción",
    sector: "Sector",
    tipo: "Tipo",
    critico: "Crítico"
  };
  const defaultPuestoValues = {
    id: puesto?.id,
    productoId: puesto?.productoId || 0,
    codigoPuesto: puesto?.codigoPuesto || "",
    descripcion: puesto?.descripcion || "",
    sector: puesto?.sector || "",
    tipo: puesto?.tipo || "",
    critico: puesto?.critico || false,
    createdDate: puesto?.createdDate,
    deleted: false
  };
  const { control, getValues } = useForm({
    defaultValues: defaultPuestoValues,
    mode: "onChange"
  });

  const handleCancelar = () => {
    callback(false);
  };

  const borrarPuesto = async () => {
    let fetchEliminarPuesto;
    try {
      fetchEliminarPuesto = unwrapResult(await dispatch(InstpuestoSliceRequests.deleteRequest(puesto.id)));
    } catch (error) {
      fetchEliminarPuesto = null;
    }
    if (fetchEliminarPuesto) {
      console.log("🚀 ~ file: PuestoDialog.tsx ~ line 50 ~ borrarPuesto ~ fetchEliminarPuesto", fetchEliminarPuesto);
      openNotificationUI("Puesto borrado correctamente.", "success");
      refreshTable();
      callback(false);
    }
  };

  const handleEliminar = async () => {
    const response = await getConfirmation("Borrar puesto", "Está seguro que desea borrar el puesto?");
    if (response) {
      borrarPuesto();
    }
  };

  const handleGuardar = async () => {
    let result;
    try {
      result = await dispatch(InstpuestoSliceRequests.PutRequest(getValues()));
    } catch (err) {
      result = null;
    }
    if (result) {
      openNotificationUI("Datos del puesto actualizados.", "success");
      refreshTable(); //actualizo la tabla
      callback(false);
    }
  };

  return (
    <div>
      {puesto && (
        <div>
          <div style={{ width: "50vw" }}>
            <div className="grid sm:grid-cols-2 sm:gap-4 w-full">
              <GenericFieldsGenerator
                values={defaultPuestoValues}
                control={control}
                styleDiv={"text-center mb-5"}
                styleFieldSX={{ width: "100%" }}
                labels={defaultPuestoLabels}
                // selectFields={state}
                variant="standard"
              />
            </div>
            <div className="flex justify-center gap-4 mt-4">
              <Button className={buttonClasses.blueButton} variant="contained" onClick={handleGuardar}>
                Guardar
              </Button>
              <Button className={buttonClasses.redButton} variant="contained" onClick={handleCancelar}>
                Cancelar
              </Button>
              <Button className={buttonClasses.redButton} variant="contained" onClick={handleEliminar}>
                Eliminar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
