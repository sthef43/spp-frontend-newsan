import { FormControl, FormHelperText, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import { OQCCategoriaSliceRequests } from "app/features/oqcGeneral/slices/OQCCategoriaSlice";
import { OQCHallazgoSliceRequests } from "app/features/oqcGeneral/slices/OQCHallazgoSlice";
import { OQCPonderacionSliceRequests } from "app/features/oqcGeneral/slices/OQCPonderacionSlice";
import { IProducto } from "app/models";
import { IOQCCategoria } from "app/models/IOQCCategoria";
import { IOQCHallazgo } from "app/models/IOQCHallazgo";
import { IOQCPonderacion } from "app/models/IOQCPonderacion";
import { FormButtons } from "app/shared/helpers/FormButtons";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
interface IOQCHallazgosForm {
  closeModal: (state: boolean) => void;
}
const defaultValues = {
  nombre: "",
  oqcCategoriaId: 0,
  oqcPonderacionId: 0,
  productoId: 0
};
export const OQCHallazgosForm = ({ closeModal }: IOQCHallazgosForm): JSX.Element => {
  const hallazgo = useAppSelector<IOQCHallazgo>((state) => state.oqcHallazgo.object);
  const producto = useAppSelector<IProducto>((state) => state.producto.object);
  const categorias = useAppSelector<IOQCCategoria[]>((state) => state.oqcCategoria.dataAll);
  const ponderaciones = useAppSelector<IOQCPonderacion[]>((state) => state.oqcPonderacion.dataAll);

  const { control, handleSubmit, setValue } = useForm({ defaultValues: hallazgo ? hallazgo : defaultValues });

  const { openNotificationUI } = useNotificationUI();
  const dispatch = useAppDispatch();

  const onSubmit = async (e) => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      hallazgo && delete e.oqcCategoria;
      hallazgo && delete e.oqcPonderacion;
      hallazgo && delete e.producto;
      hallazgo
        ? await dispatch(OQCHallazgoSliceRequests.PutRequest(e))
        : await dispatch(OQCHallazgoSliceRequests.PostRequest(e));
      openNotificationUI(`Se ${hallazgo ? "edito" : "agrego"} correctamente`, "success");
      await dispatch(OQCHallazgoSliceRequests.getAllByProductoIdRequest(producto.id));
      dispatch(LoadingUISlice.actions.LoadingUIClose());
      closeModal(false);
    } catch (e) {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
      openNotificationUI(e, "error");
    }
  };

  const onInit = async () => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      await dispatch(OQCCategoriaSliceRequests.getAllRequest());
      await dispatch(OQCPonderacionSliceRequests.getAllRequest());
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    } catch (e) {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
      openNotificationUI(e, "error");
    }
  };

  useEffect(() => {
    console.log(producto);
    producto && setValue("productoId", producto?.id);
  }, [producto]);

  useEffect(() => {
    onInit();
  }, []);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col justify-center gap-5">
      <Controller
        control={control}
        name="nombre"
        rules={{ required: "El campo es requerido" }}
        render={({ field, fieldState: { error } }) => (
          <FormControl>
            <TextField {...field} label="Nombre" />
            {!!error && <FormHelperText className="text-red-500">{error.message}</FormHelperText>}
          </FormControl>
        )}
      />
      <Controller
        control={control}
        name="oqcCategoriaId"
        rules={{ required: "El campo es requerido", min: { message: "Debe seleccionar uno", value: 1 } }}
        render={({ field, fieldState: { error } }) => (
          <FormControl>
            <InputLabel>Seleccione una categoria</InputLabel>
            <Select {...field} label="Seleccioene una categoria">
              {categorias?.map((categoria) => (
                <MenuItem value={categoria.id} key={categoria.id}>
                  {categoria.nombre}
                </MenuItem>
              ))}
            </Select>
            {!!error && <FormHelperText className="text-red-500">{error.message}</FormHelperText>}
          </FormControl>
        )}
      />
      <Controller
        control={control}
        name="oqcPonderacionId"
        rules={{ required: "El campo es requerido", min: { message: "Debe seleccionar uno", value: 1 } }}
        render={({ field, fieldState: { error } }) => (
          <FormControl>
            <InputLabel>Seleccione una ponderacion</InputLabel>
            <Select {...field} label="Seleccione una ponderacion">
              {ponderaciones?.map((ponderacion) => (
                <MenuItem
                  value={ponderacion.id}
                  key={ponderacion.id}
                  sx={{
                    backgroundColor: `${
                      ponderacion.color == "Rojo" ? "#f44b4e" : ponderacion.color == "Verde" ? "#5dae3a" : "#fdaf59"
                    }`
                  }}>
                  {ponderacion.nombre + " - ponderación %" + ponderacion.ponderacion}
                </MenuItem>
              ))}
            </Select>
            {!!error && <FormHelperText className="text-red-500">{error.message}</FormHelperText>}
          </FormControl>
        )}
      />
      <FormButtons onCancel={() => closeModal(false)} />
    </form>
  );
};
