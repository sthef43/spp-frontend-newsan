/* eslint-disable unused-imports/no-unused-vars */
import { Button, FormControl, FormHelperText, TextField } from "@mui/material";
import { unwrapResult } from "@reduxjs/toolkit";
import { OperatorSliceRequests } from "app/Middleware/reducers/OperatorSlice";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { useAppDispatch } from "app/core/store/store";
import { IAppUser, IAuditRegistry } from "app/models";
import { GetInfoUser } from "app/shared/helpers/userConfig";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { AuditRegistrySliceRequests } from "app/features/audit/slices/AuditRegistrySlice";

const initialStateVar = {
  comment: ""
};

interface initialState {
  comment: string;
}

interface Props {
  audit: IAuditRegistry;
  infoUsuario: IAppUser;
  setOpenModalComment: (value: boolean) => void;
  dataTable: (newValue: IAuditRegistry[]) => void;
  plantaId: number;
  permisoId: number;
}

export const AuditComent: React.FC<Props> = ({
  audit,
  setOpenModalComment,
  infoUsuario,
  dataTable,
  plantaId,
  permisoId
}) => {
  const { control, handleSubmit, watch } = useForm<initialState>({ defaultValues: initialStateVar });
  const { openNotificationUI } = useNotificationUI();
  const dispatch = useAppDispatch();

  const comentarioWatch = watch("comment");
  const userAudit = async () => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      const { name, surname } = unwrapResult(
        await dispatch(OperatorSliceRequests.getInfoByDni(GetInfoUser().dni || 0))
      );
      const nuevoAudicion = {
        ...audit,
        comentarioBaja: comentarioWatch,
        auditRegistryResult: audit.auditRegistryResult
      };
      delete nuevoAudicion.audit;
      delete nuevoAudicion.operator;
      delete nuevoAudicion.plant;
      delete nuevoAudicion.turno;
      await dispatch(AuditRegistrySliceRequests.PutRequest(nuevoAudicion));
      await dispatch(AuditRegistrySliceRequests.canceledRequest({ id: audit.id, username: name + " " + surname }));
      const information = unwrapResult(
        await dispatch(AuditRegistrySliceRequests.getPaginationbyRolId({ plantId: plantaId, rolId: permisoId }))
      );
      if (information) {
        dataTable(information);
      }
      openNotificationUI("Se dio de baja con éxito", "success");
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    } catch (error) {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
      console.log(error);
    }
    setOpenModalComment(false);
  };

  return (
    <main>
      <form onSubmit={handleSubmit(userAudit)} className="flex flex-col items-center">
        <p className="mb-4 uppercase font-semibold underline">
          Es obligatorio dejar el comentario de por que se da de baja
        </p>
        <Controller
          name="comment"
          control={control}
          defaultValue=""
          rules={{ required: { value: true, message: "Debe ingresar el comentario de la baja" } }}
          render={({ field, fieldState: { error } }) => (
            <FormControl fullWidth variant="outlined" error={!!error}>
              <TextField {...field} label={"Ingrese un comentario"} fullWidth></TextField>
              {!!error && <FormHelperText>{error.message}</FormHelperText>}
            </FormControl>
          )}
        />
        <div className="flex items-center mt-4 gap-x-8">
          <Button type="submit" variant="contained" color="success">
            Guardar
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              setOpenModalComment(false);
            }}>
            Cancelar
          </Button>
        </div>
      </form>
    </main>
  );
};
