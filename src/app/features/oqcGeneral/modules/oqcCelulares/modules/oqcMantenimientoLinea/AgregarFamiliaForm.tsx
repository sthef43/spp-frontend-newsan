import { FormControl, Button, InputLabel, Select, MenuItem, FormHelperText, Input } from "@mui/material";
import { unwrapResult } from "@reduxjs/toolkit";
import { ProductoSliceRequests } from "app/features/trazabilidad/slices/ProductoSlice";
import { PlantSliceRequests } from "app/Middleware/reducers";
import { FamiliaSliceRequests } from "app/Middleware/reducers/FamiliaSlice";
import { useAppDispatch } from "app/core/store/store";
import { IFamilia } from "app/models/IFamilia";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

interface Props {
  setOpenFamilia: (state: boolean) => void;
  dataEdit: IFamilia | null;
  productId: number;
  plant?: number;
  refresh?: any;
}

export const AgregarFamiliaForm = ({ setOpenFamilia, dataEdit, productId, plant, refresh }: Props) => {
  interface initialState {
    plantId: number;
    productoId: number;
    nombre: string;
    descripcion: string;
    semiElaboradoIA: string;
  }

  const initialStateVar = {
    plantId: plant,
    productoId: productId,
    nombre: "",
    descripcion: "",
    semiElaboradoIA: ""
  };

  // Si dataEdit no es nulo, se asegura se agregar plantId con el valor de plant
  const defaultValues = dataEdit ? { ...dataEdit, plantId: plant } : initialStateVar;

  const { control, handleSubmit, formState, setValue } = useForm<initialState>({
    defaultValues
  });

  const { openNotificationUI } = useNotificationUI();
  const dispatch = useAppDispatch();

  //CON LA ID TE TRAE LA PLANTA
  const [listPlantas, setListPantas] = useState([]);
  const getPlantas = async () => {
    try {
      const responses = unwrapResult(await dispatch(PlantSliceRequests.getAllRequest()));
      setListPantas(responses);
    } catch (error) {
      openNotificationUI("Error al leer plantas.", "error");
    }
  };

  //CON EL ID TE TRAE LE PRODUCTO
  const [listProducto, setListProducto] = useState([]);
  const getProducto = async () => {
    try {
      const responses = unwrapResult(await dispatch(ProductoSliceRequests.getAllRequest()));
      setListProducto(responses);
    } catch (error) {
      openNotificationUI("Error al leer producto.", "error");
    }
  };

  const { isDirty, isValid, errors } = formState;
  useEffect(() => {
    console.log(errors);
  }, [errors]);

  const añadirNuevaFamilia = async (e) => {
    let result;
    try {
      if (dataEdit) {
        result = await dispatch(FamiliaSliceRequests.PutRequest(JSON.parse(JSON.stringify(e))));
      } else {
        result = await dispatch(FamiliaSliceRequests.PostRequest(JSON.parse(JSON.stringify(e))));
        console.log("aca deberia entrar");
      }
    } catch (x) {
      result = null;
    }
    if (result) {
      dataEdit
        ? openNotificationUI("Se agrego la familia correctamente", "success")
        : openNotificationUI("Se edito la familia correctamente", "success");
      setOpenFamilia(false);
      refresh();
    }
  };

  // useEffect(() => {
  //   if (dataEdit && !dataEdit.plantId && plant) {
  //     setValue("plantId", plant);
  //   }
  // }, [dataEdit, plant, setValue]);

  useEffect(() => {
    getPlantas();
    getProducto();

    console.log("agregar familia / editar");
    console.log("planta", plant);
    console.log("dataedit", dataEdit);
    console.log("producto", productId);
    console.log("-----------");
  }, []);

  return (
    <form onSubmit={handleSubmit(añadirNuevaFamilia)} className="flex flex-col justify-center gap-5">
      {/* para agregar la familia nueva */}
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
      {/* aca  te trae las planta y producto que selecionaste en MantenimientoLinea */}
      <Controller
        name="plantId"
        control={control}
        rules={{ required: true }}
        render={({ field, fieldState: { error } }) => (
          <FormControl fullWidth variant="outlined" error={!!error}>
            <InputLabel>Seleccione una planta</InputLabel>
            <Select {...field} variant="standard">
              {listPlantas &&
                listPlantas.map((x) => (
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
      <Controller
        name="productoId"
        control={control}
        rules={{ required: true }}
        render={({ field, fieldState: { error } }) => (
          <FormControl fullWidth variant="outlined" error={!!error}>
            <InputLabel>Seleccione un producto</InputLabel>
            <Select {...field} variant="standard">
              {listProducto &&
                listProducto.map((x) => (
                  <MenuItem key={x.id} value={x.id}>
                    <div className="w-full">
                      <div>{x.nombre}</div>
                    </div>
                  </MenuItem>
                ))}
            </Select>
            {!!error && <FormHelperText>{error.type}</FormHelperText>}
          </FormControl>
        )}
      />

      <Button type="submit" variant="contained" color="primary" disabled={!isDirty && !isValid}>
        Guardar
      </Button>
      <Button variant="outlined" color="secondary" onClick={() => setOpenFamilia(false)}>
        Cancelar
      </Button>
    </form>
  );
};
