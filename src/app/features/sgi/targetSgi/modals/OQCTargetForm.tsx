import { FormControl, FormHelperText, Input, InputLabel, MenuItem, Select } from "@mui/material";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { LineaProduccionSliceRequests } from "app/Middleware/reducers/lineaProducionSlice";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import { OQCTargetSliceRequests } from "app/features/oqcGeneral/slices/OQCTargetSlice";
import { IProducto } from "app/models";
import { ILineaProduccion } from "app/models/ILineaProduccion";
import { IOQCTarget } from "app/models/IOQCTarget";
import { FormButtons } from "app/shared/helpers/FormButtons";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";

interface IOQCTargetForm {
  closeModal: (state: boolean) => void;
}
const defaultValues = {
  target: 0,
  productoId: 0,
  lineaProduccionId: 0
};
export const OQCTargetForm = ({ closeModal }: IOQCTargetForm): JSX.Element => {
  const target = useAppSelector<IOQCTarget>((state) => state.oqcTarget.object);
  const producto = useAppSelector<IProducto>((state) => state.producto.object);
  const targets = useAppSelector<IOQCTarget[]>((state) => state.oqcTarget.dataAll);
  const lineas = useAppSelector<ILineaProduccion[]>((state) => state.lineaProduccion.dataAll);
  const { control, handleSubmit, setValue } = useForm({ defaultValues: target ? target : defaultValues });

  const { openNotificationUI } = useNotificationUI();
  const dispatch = useAppDispatch();
  const onSubmit = async (e) => {
    try {
      if (
        targets.find((t) => t.lineaProduccionId == e.lineaProduccionId) &&
        e.lineaProduccionId == 0 &&
        target?.lineaProduccionId != 0
      ) {
        openNotificationUI("Ya existe un target para el producto", "error");
        return;
      }
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      target
        ? await dispatch(OQCTargetSliceRequests.PutRequest(e))
        : await dispatch(OQCTargetSliceRequests.PostRequest(e));
      openNotificationUI(`Se ${target ? "edito" : "agrego"} correctamente`, "success");
      await dispatch(OQCTargetSliceRequests.getAllRequest());
      await dispatch(OQCTargetSliceRequests.getAllByProductoIdRequest(producto.id));
      closeModal(false);
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    } catch (e) {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
      openNotificationUI(e, "error");
    }
  };
  const onGetLineas = async () => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      await dispatch(LineaProduccionSliceRequests.getAllByProductId(producto.id));
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    } catch (e) {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
      openNotificationUI(e, "error");
    }
  };

  useEffect(() => {
    producto && onGetLineas();
    producto && setValue("productoId", producto.id);
  }, [producto]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col justify-center gap-5">
      <Controller
        control={control}
        name="target"
        rules={{
          required: "El campo es requerido",
          min: { value: 1, message: "El valor tiene que ser mayor a 0" },
          max: { value: 100, message: "El valor tiene que ser menor o igual a 100" }
        }}
        render={({ field, fieldState: { error } }) => (
          <FormControl>
            <InputLabel>Target</InputLabel>
            <Input
              {...field}
              type="number"
              inputProps={{ inputMode: "numeric" }}
              onChange={(e) => field.onChange(parseInt(e.target.value))}
            />
            {!!error && <FormHelperText className="text-red-500">{error.message}</FormHelperText>}
          </FormControl>
        )}
      />
      <Controller
        control={control}
        name="lineaProduccionId"
        rules={{ required: "El campo es requerido" }}
        render={({ field, fieldState: { error } }) => (
          <FormControl>
            <InputLabel>Seleccione una linea</InputLabel>
            <Select {...field}>
              <MenuItem value={0}>Target para el producto</MenuItem>
              {lineas?.map((linea) => (
                <MenuItem value={linea.id} key={linea.id}>
                  {linea.nombre}
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
