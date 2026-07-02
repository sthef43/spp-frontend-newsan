/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { Button, FormControl, InputLabel, FormHelperText, Input } from "@mui/material";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { useAppDispatch } from "app/core/store/store";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { EmailGroupSliceRequests } from "app/Middleware/reducers/EmailGroupSlice";
import { useConfirmationDialog } from "app/shared/hooks/useConfirmationDialog";

interface props {
  setOpenPopup: any;
  plantaIdSelect: number;
  refresh?: any | null;
}

interface initialState {
  grupo: string;
}

const initialStateVar = {
  grupo: ""
};

export const EmailForm = ({ setOpenPopup, plantaIdSelect, refresh }: props) => {
  const { control, handleSubmit, watch } = useForm<initialState>({
    defaultValues: initialStateVar
  });

  const classes = MaterialButtons();
  const { getConfirmation } = useConfirmationDialog();
  const dispatch = useAppDispatch();
  const { openNotificationUI } = useNotificationUI();

  const watchGrupo = watch("grupo");

  //Agrego o modifico
  const loginSubmit = async (e) => {
    const resp = await getConfirmation("Agregar", "Confirma agregar el Grupo?");
    if (resp) {
      const objectSubmit = {
        name: e.grupo,
        emails: "",
        rolId: 5,
        rol: null,
        plantId: plantaIdSelect,
        plant: null,
        lineId: null,
        line: null,
        auditId: null
      };
      try {
        await dispatch(EmailGroupSliceRequests.PostRequest(objectSubmit));
        openNotificationUI("Se agrego el grupo con exito!", "success");
        refresh();
        setOpenPopup(false);
      } catch (x) {
        openNotificationUI("Error al agregar el grupo.", "error");
      }
    }
  };

  return (
    <div className="w-[35vw] h-full">
      <form onSubmit={handleSubmit(loginSubmit)} className="w-full h-full">
        <div className="m-1 h-full">
          <div className="rounded-lg bg-secondaryNew">
            <Controller
              name="grupo"
              defaultValue=""
              control={control}
              rules={{ required: { value: true, message: "Debe ingresar un grupo valido." } }}
              render={({ field, fieldState: { error } }) => (
                <FormControl fullWidth variant="outlined" error={!!error}>
                  <InputLabel>Grupo</InputLabel>
                  <Input {...field} />
                  {!!error && <FormHelperText>{error.message}</FormHelperText>}
                </FormControl>
              )}
            />
          </div>
          <div className="pt-5 flex justify-around">
            <Button
              className={classes.greenButton}
              type="submit"
              variant="contained"
              disabled={watchGrupo.length === 0}>
              Guardar
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};
