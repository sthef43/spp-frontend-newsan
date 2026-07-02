import React from "react";
import { IRol } from "../../../../models/IRol";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { useAppDispatch } from "app/core/store/store";
import { RolSliceRequests } from "app/features/manejoSistema/slices/RolSlice";
import { Controller, useForm } from "react-hook-form";
import { FormButtons } from "app/shared/helpers/FormButtons";
import { FormControl, FormHelperText, Input, InputLabel } from "@mui/material";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
interface IRolForm {
  rol: IRol;
  closeModal: (state: boolean) => void;
}
export const RolForm = ({ rol, closeModal }: IRolForm): JSX.Element => {
  const { openNotificationUI } = useNotificationUI();
  const dispatch = useAppDispatch();

  const defaultValues = {
    name: ""
  };
  const { handleSubmit, control } = useForm({ defaultValues: rol ? rol : defaultValues });

  const onSubmit = async (e: IRol) => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      let editState: IRol = {} as IRol;
      if (rol) {
        editState = { name: e.name, id: e.id, createdDate: e.createdDate, deleted: false };
      }
      const response = await dispatch(!rol ? RolSliceRequests.PostRequest(e) : RolSliceRequests.PutRequest(editState));
      openNotificationUI(`Se ${rol ? "edito" : "agrego"} correctamente`, "success");
      await dispatch(RolSliceRequests.getAllRequest());
      dispatch(LoadingUISlice.actions.LoadingUIClose());
      closeModal(false);
    } catch (e) {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
      openNotificationUI(e, "error");
    }
  };
  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Controller
          control={control}
          name="name"
          rules={{ required: true, maxLength: 30 }}
          render={({ field, fieldState: { error } }) => (
            <FormControl fullWidth variant="outlined" error={!!error}>
              <InputLabel>Nombre:</InputLabel>
              <Input {...field} />
              {!!error && <FormHelperText>{error.type}</FormHelperText>}
            </FormControl>
          )}
        />

        <FormButtons onCancel={() => closeModal(false)} />
      </form>
    </div>
  );
};
