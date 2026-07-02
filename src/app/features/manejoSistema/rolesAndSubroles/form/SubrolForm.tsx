import React from "react";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { useAppDispatch } from "app/core/store/store";
import { Controller, useForm } from "react-hook-form";
import { FormButtons } from "app/shared/helpers/FormButtons";
import { FormControl, FormHelperText, Input, InputLabel } from "@mui/material";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { SubRolSliceRequests } from "app/features/manejoSistema/slices/SubRolSlice";
import { ISubRol } from "app/models";
interface ISubrolForm {
  subrol: ISubRol;
  closeModal: (state: boolean) => void;
}
export const SubrolForm = ({ subrol, closeModal }: ISubrolForm): JSX.Element => {
  const { openNotificationUI } = useNotificationUI();
  const dispatch = useAppDispatch();

  const defaultValues = {
    name: ""
  };
  const { handleSubmit, control } = useForm({ defaultValues: subrol ? subrol : defaultValues });

  const onSubmit = async (e: ISubRol) => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      let editState: ISubRol = {} as ISubRol;
      if (subrol) {
        editState = { name: e.name, id: e.id, createdDate: e.createdDate, deleted: false };
      }
      const response = await dispatch(
        !subrol ? SubRolSliceRequests.PostRequest(e) : SubRolSliceRequests.PutRequest(editState)
      );
      openNotificationUI(`Se ${subrol ? "edito" : "agrego"} correctamente`, "success");
      await dispatch(SubRolSliceRequests.getAllRequest());
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
