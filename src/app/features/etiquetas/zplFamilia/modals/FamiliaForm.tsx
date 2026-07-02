/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button, FormControl, FormControlLabel, FormHelperText, Switch, TextField } from "@mui/material";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { useAppDispatch } from "app/core/store/store";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { IZPL_Familias } from "app/models/IZPL_Familias";
import { ZPL_FamiliasSliceRequests } from "app/Middleware/reducers/ZPL_FamiliasSlice";
interface props {
  setOpenPopup: any;
  editState?: IZPL_Familias | null;
  refresh?: any;
  estaEditando: any;
}

export const FamiliaForm = ({ setOpenPopup, editState, refresh, estaEditando }: props) => {
  const classes = MaterialButtons();
  interface initialState {
    codigoFamilia: string;
    activa: boolean;
    deleted: boolean;
  }
  const initialStateVar = {
    codigoFamilia: "",
    activa: true,
    deleted: false
  };
  const dispatch = useAppDispatch();
  const { openNotificationUI } = useNotificationUI();
  const { control, setValue, getValues, handleSubmit, watch, formState } = useForm<initialState>({
    defaultValues: estaEditando ? editState : initialStateVar
  });
  const { isDirty, isValid, errors } = formState;
  useEffect(() => {
    console.log(errors);
  }, [errors]);

  const loginSubmit = async (e) => {
    try {
      if (editState) {
        await dispatch(ZPL_FamiliasSliceRequests.putRequest(e));
      } else {
        await dispatch(ZPL_FamiliasSliceRequests.postRequest(e));
      }
      openNotificationUI("Guardado...", "success");
      refresh();
      setOpenPopup(false);
    } catch (x) {
      openNotificationUI("Error al guardar.", "error");
    }
  };

  //SWITCH Origen
  const [checkedActiva, setCheckedActiva] = useState(true);
  const [checkedActivaNombre, setCheckedActivaNombre] = useState("Activo");
  const handleChangeActiva = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCheckedActiva(event.target.checked);
    event.target.checked ? setCheckedActivaNombre("Activo") : setCheckedActivaNombre("No activo");
    setValue("activa", event.target.checked);
  };

  useEffect(() => {
    if (estaEditando) {
      setCheckedActiva(editState.activa);
      editState.activa ? setCheckedActivaNombre("Activo") : setCheckedActivaNombre("No activo");
      setValue("activa", editState.activa);
    }
  }, [estaEditando]);

  return (
    <div style={{ height: "100%", width: "25vw", position: "relative" }}>
      <form onSubmit={handleSubmit(loginSubmit)} style={{ width: "100%", height: "100%" }}>
        <div className="m-1 sm:m-10 h-full">
          <div className=" flex-col grid grid-cols-3 gap-30 " style={{ height: "100%" }}>
            <div className="col-span-2 p-2 gap-10 overflow-auto m-2" style={{ flex: "1 1 90%" }}>
              <Controller
                name="codigoFamilia"
                control={control}
                rules={{ required: true }}
                render={({ field, fieldState: { error } }) => (
                  <FormControl fullWidth variant="outlined" error={!!error}>
                    <TextField fullWidth label="Código de Familia" variant="standard" type="text" {...field} />
                    {!!error && <FormHelperText>{error.type}</FormHelperText>}
                  </FormControl>
                )}
              />
            </div>
            <div className="p-2 gap-10 overflow-auto m-2" style={{ flex: "1 1 90%" }}>
              <Controller
                name="activa"
                control={control}
                rules={{ required: false }}
                render={() => (
                  <FormControlLabel
                    control={
                      <Switch
                        checked={checkedActiva}
                        onChange={handleChangeActiva}
                        inputProps={{ "aria-label": "controlled" }}
                      />
                    }
                    label={checkedActivaNombre}
                  />
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
