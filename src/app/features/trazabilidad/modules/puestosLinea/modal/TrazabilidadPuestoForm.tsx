import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button, FormControl, FormHelperText, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { useAppDispatch } from "app/core/store/store";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { PuestoSliceRequests } from "app/features/trazabilidad/slices/PuestoSlice";
import { IAppUser, IPlant, IPuesto } from "app/models";
import { PlantSliceRequests } from "app/Middleware/reducers";
import useFetchApi from "app/shared/hooks/useFetchApi";

interface props {
  setOpenPopup: any;
  editState?: IPuesto | null;
  refresh?: any;
  estaEditando: any;
  infoUser?: IAppUser | null;
}
export const TrazabilidadPuestoForm = ({ setOpenPopup, editState, refresh, estaEditando, infoUser }: props) => {
  const classes = MaterialButtons();
  const { State: plants } = useFetchApi<IPlant[]>(PlantSliceRequests.getAllRequest);
  interface initialState {
    nombre: string;
    descripcion: string | null;
    plantId: number;
  }
  const initialStateVar = {
    nombre: "",
    descripcion: "",
    plantId: infoUser.operator.plantaId ?? 0
  };
  const dispatch = useAppDispatch();
  const { openNotificationUI } = useNotificationUI();
  const { control, handleSubmit, formState, setValue, watch, getValues } = useForm<initialState>({
    defaultValues: estaEditando ? editState : initialStateVar
  });

  const { isDirty, isValid, errors } = formState;

  useEffect(() => {
    setValue("plantId", infoUser.operator.plantaId);
    console.log(editState);
    console.log(plants);
  }, []);

  useEffect(() => {
    console.log(plants);
    const plant = infoUser.operator.plantaId;
    console.log(plant);
    setValue("plantId", plant);
  }, [plants]);

  const loginSubmit = async (e) => {
    let result;
    try {
      if (estaEditando) {
        result = await dispatch(PuestoSliceRequests.PutRequest(JSON.parse(JSON.stringify(e))));
      } else {
        result = await dispatch(PuestoSliceRequests.PostRequest(JSON.parse(JSON.stringify(e))));
      }
    } catch (x) {
      result = null;
    }
    if (result) {
      openNotificationUI("Guardado exitosamente ", "success");
      setOpenPopup(false);
      refresh();
    }
  };

  const watchPlant = watch("plantId");

  useEffect(() => {
    console.log(watchPlant);
    console.log(getValues("plantId"));
  }, [watchPlant]);

  return (
    <div style={{ height: "100%", width: "60vw", position: "relative" }}>
      <form onSubmit={handleSubmit(loginSubmit)} style={{ width: "100%", height: "100%" }}>
        <div className="flex flex-col" style={{ height: "100%" }}>
          <div className="py-2 grid grid-cols-1 gap-10 overflow-auto" style={{ flex: "1 1 90%" }}>
            <div className="py-2 grid grid-cols-1 gap-10 overflow-auto" style={{ flex: "1 1 90%" }}>
              {plants && (
                <Controller
                  name="plantId"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <FormControl fullWidth variant="outlined" error={!!error}>
                      <InputLabel>Planta</InputLabel>
                      <Select {...field} placeholder="Seleccione una Planta" variant="standard">
                        {plants &&
                          plants.map((x) => (
                            <MenuItem key={x.id} value={x.id}>
                              <div className="w-full">
                                <div>{x.name}</div>
                              </div>
                            </MenuItem>
                          ))}
                      </Select>
                      {!!error && <FormHelperText>{error.type}</FormHelperText>}
                    </FormControl>
                  )}
                />
              )}
            </div>
            <Controller
              name="nombre"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  fullWidth
                  placeholder="Nombre Puesto"
                  label="Nombre Puesto"
                  variant="outlined"
                  required={true}
                  type="text"
                  error={!!error?.types}
                  helperText={error?.type}
                  {...field}
                  onChange={(e) => field.onChange(e.target.value)}
                />
              )}
            />
          </div>
          <div className="py-2 grid grid-cols-1 gap-10 overflow-auto" style={{ flex: "1 1 90%" }}>
            <Controller
              name="descripcion"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  fullWidth
                  placeholder="Descripcion"
                  label="Descripcion"
                  variant="outlined"
                  type="text"
                  error={!!error?.types}
                  helperText={error?.type}
                  {...field}
                  onChange={(e) => field.onChange(e.target.value)}
                />
              )}
            />
          </div>
          <div className="pt-1 flex justify-around border-t-2" style={{ flex: "1 1 10%" }}>
            <Button className={classes.greenButton} type="submit" variant="contained" disabled={!isDirty && !isValid}>
              Guardar
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};
