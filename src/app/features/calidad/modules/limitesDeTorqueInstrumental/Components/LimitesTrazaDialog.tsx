import React from "react";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import { useForm } from "react-hook-form";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { Button } from "@mui/material";
import { unwrapResult } from "@reduxjs/toolkit";
import EditIcon from "@mui/icons-material/Edit";
import { useConfirmationDialog } from "app/shared/hooks/useConfirmationDialog";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { GenericFieldsGenerator } from "app/shared/helpers/GenericFieldsGenerator";
import { ILimitesTraza } from "app/models/ILimitesTraza";
import { LimitesTrazaSliceRequests } from "app/Middleware/reducers/LimitesTrazaSlice";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import moment from "moment";

interface props {
  limite: ILimitesTraza;
  callback: any;
  refreshTable?: () => void;
}

export const LimitesTrazaDialog = ({ limite, callback, refreshTable }: props): JSX.Element => {
  const dispatch = useAppDispatch();
  const { darkMode } = useAppSelector((state) => state.colorApp);
  const buttonClasses = MaterialButtons();
  const { getConfirmation } = useConfirmationDialog();
  const { openNotificationUI } = useNotificationUI();
  const [editable, setEditable] = React.useState<boolean>(true);
  const textColorSx = { color: darkMode ? "rgba(250, 250, 250, 0.9)" : "#c80f4d" };

  const defaultLimiteLabels = {
    verificacion1: "Verificación 1",
    verificacion2: "Verificación 2",
    verificacion3: "Verificación 3",
    verificacion4: "Verificación 4",
    turno: "Turno",
    observaciones: "Observaciones",
    correccion: "Corrección",
    fecha: "Fecha"
  };

  const defaultLimiteValues = {
    id: limite?.id || 0,
    turno: limite?.turno || "",
    verificacion1: limite?.verificacion1 || false,
    verificacion2: limite?.verificacion2 || false,
    verificacion3: limite?.verificacion3 || false,
    verificacion4: limite?.verificacion4 || false,
    observaciones: limite?.observaciones || "",
    correccion: limite?.correccion || "",
    limitesId: limite?.limitesId || 0,
    identificadorLinea: limite?.identificadorLinea || 0,
    userName: limite?.userName,
    userDni: limite?.userDni,
    fecha: limite?.fecha || moment().toDate(),
    createdDate: limite?.createdDate
  };

  const { control, getValues } = useForm({
    defaultValues: defaultLimiteValues
  });

  const handleCancelar = () => {
    callback(false);
  };

  const borrarLimite = async () => {
    let fetchEliminarLimite;
    try {
      fetchEliminarLimite = unwrapResult(await dispatch(LimitesTrazaSliceRequests.deleteRequest(limite.id)));
    } catch (error) {
      fetchEliminarLimite = null;
    }
    if (fetchEliminarLimite) {
      openNotificationUI("Limite borrado correctamente.", "success");
      callback(false);
    }
  };

  const handleEliminar = async () => {
    const response = await getConfirmation("Borrar limite", "Está seguro que desea borrar el limite?");
    if (response) {
      borrarLimite();
    }
  };

  const handleGuardar = async () => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      const limiteEditado = getValues();
      const result = await dispatch(LimitesTrazaSliceRequests.PutRequest(limiteEditado));
      openNotificationUI("Datos del limite actualizados.", "success");
      refreshTable && refreshTable();
      callback(false);
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    } catch (err) {
      openNotificationUI(err, "error");
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
  };
  const handleEditar = () => {
    setEditable(!editable);
  };

  return (
    <div>
      <div className="text-right space-x-3">
        <Button size="small" sx={textColorSx} variant="text" onClick={handleEditar}>
          <EditIcon />
          Editar
        </Button>
      </div>
      {limite && (
        <div>
          <div style={{ width: "50vw" }}>
            <div className="grid sm:grid-cols-2 sm:gap-4 w-full">
              <GenericFieldsGenerator
                values={defaultLimiteValues}
                control={control}
                styleDiv={"text-center mb-5"}
                styleFieldSX={{ width: "100%" }}
                labels={defaultLimiteLabels}
                variant="standard"
                disabled={editable}
              />
            </div>
            <div className="flex justify-center gap-5">
              <Button className={buttonClasses.blueButton} variant="contained" onClick={handleGuardar}>
                Guardar
              </Button>
              <Button className={buttonClasses.redButton} variant="contained" onClick={handleCancelar}>
                Cancelar
              </Button>
              <Button className={buttonClasses.purpleButton} variant="contained" onClick={handleEliminar}>
                Eliminar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
