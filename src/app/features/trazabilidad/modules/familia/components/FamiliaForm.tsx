import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button, FormControl, InputLabel, FormHelperText, Input } from "@mui/material";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { FamiliaSliceRequests } from "app/Middleware/reducers/FamiliaSlice";
import { IFamilia } from "app/models/IFamilia";
import { IProducto } from "app/models/IProducto";

interface props {
  setOpenPopup: any;
  editState?: IFamilia | null;
  refresh?: any;
}
export const FamiliaForm = ({ setOpenPopup, editState, refresh }: props) => {
  const classes = MaterialButtons();
  interface initialState {
    nombre: string;
    descripcion: string;
    semiElaboradoIA: string;
    productoId: number;
  }
  const initialStateVar = {
    nombre: "",
    descripcion: "",
    semiElaboradoIA: "",
    productoId: 0
  };
  const producto = useAppSelector<IProducto>((state) => state.producto.object);

  const dispatch = useAppDispatch();
  const { openNotificationUI } = useNotificationUI();
  const { control, setValue, handleSubmit, formState } = useForm<initialState>({
    defaultValues: editState ? editState : initialStateVar
  });
  const { isDirty, isValid, errors } = formState;
  useEffect(() => {
    console.log(errors);
  }, [errors]);
  useEffect(() => {
    producto && setValue("productoId", producto.id);
  }, [producto]);
  const addProducto = async (e) => {
    let result;
    try {
      if (editState) {
        result = await dispatch(FamiliaSliceRequests.PutRequest(JSON.parse(JSON.stringify(e))));
      } else {
        result = await dispatch(FamiliaSliceRequests.PostRequest(JSON.parse(JSON.stringify(e))));
      }
    } catch (x) {
      result = null;
    }
    if (result) {
      editState
        ? openNotificationUI("Se agrego la familia correctamente", "success")
        : openNotificationUI("Se edito la familia correctamente", "success");
      setOpenPopup(false);
      refresh();
    }
  };

  return (
    <div style={{ height: "100%", width: "60vw", position: "relative" }}>
      <form onSubmit={handleSubmit(addProducto)} style={{ width: "100%", height: "100%" }}>
        <div className="flex flex-col" style={{ height: "100%" }}>
          <div className="py-2 grid grid-cols-1 gap-10 overflow-auto" style={{ flex: "1 1 90%" }}>
            <Controller
              name="nombre"
              control={control}
              rules={{ required: true }}
              render={({ field, fieldState: { error } }) => (
                <FormControl fullWidth variant="outlined" error={!!error}>
                  <InputLabel>Nombre</InputLabel>
                  <Input {...field} />
                  {!!error && <FormHelperText>{error.type}</FormHelperText>}
                </FormControl>
              )}
            />

            <Controller
              name="descripcion"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <FormControl fullWidth variant="outlined" error={!!error}>
                  <InputLabel>Descripción</InputLabel>
                  <Input {...field} />
                  {!!error && <FormHelperText>{error.type}</FormHelperText>}
                </FormControl>
              )}
            />
            <Controller
              name="semiElaboradoIA"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <FormControl fullWidth variant="outlined" error={!!error}>
                  <InputLabel>SemiElaborado Externo</InputLabel>
                  <Input {...field} />
                  {!!error && <FormHelperText>{error.type}</FormHelperText>}
                </FormControl>
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
