import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Button,
  FormControl,
  InputLabel,
  FormHelperText,
  Input,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox
} from "@mui/material";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { useAppDispatch } from "app/core/store/store";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { ILinea } from "app/models";
import { LineaProduccionSliceRequests } from "app/Middleware/reducers/lineaProducionSlice";
import { LineaSliceRequests } from "app/Middleware/reducers/LineaSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { ILineaProduccion } from "app/models/ILineaProduccion";
import { PlantSliceRequests, ProductoSliceRequests } from "app/Middleware/reducers";
interface props {
  setOpenPopup: any;
  editState?: ILineaProduccion | null;
  refresh?: any;
  productId: number;
  plant?: number;
  lineasProduccion: ILineaProduccion[];
}
export const LineaProduccionForm = ({
  setOpenPopup,
  editState,
  refresh,
  productId,
  plant,
  lineasProduccion
}: props) => {
  const classes = MaterialButtons();
  interface initialState {
    nombre: string;
    descripcion: string;
    trazaSPP: boolean;
    identificadorLinea: number;
    plantId: number;
    productoId: number;
  }
  const initialStateVar = {
    nombre: "",
    plantId: plant,
    productoId: productId,
    descripcion: "",
    trazaSPP: false,
    identificadorLinea: null
  };
  const dispatch = useAppDispatch();
  const [cantidad, setCantidad] = useState<number>(0);
  const { openNotificationUI } = useNotificationUI();
  const { control, setValue, getValues, handleSubmit, watch, formState, register } = useForm<initialState>({
    defaultValues: editState || initialStateVar
  });
  const { isDirty, isValid, errors } = formState;
  useEffect(() => {
    console.log(errors);
  }, [errors]);
  // const { State: ListOfPlants } = useFetchApi<IPlant[]>(PlantSliceRequests.getAllRequest);
  // const { State: ListOfProductos } = useFetchApi<IProducto[]>(ProductoSliceRequests.getAllRequest);

  const addProducto = async (e) => {
    let result;
    let result2;
    let lineaSubmit: ILinea = {
      descripcion: e.nombre,
      codigo: e.nombre.slice(0, 2).toLocaleUpperCase(),
      tipo: e.nombre[0].toLocaleUpperCase(),
      tipoUnidad: e.nombre[0].toLocaleUpperCase(),
      codigoInicio: e.identificadorLinea,
      codigoReparacion: e.identificadorLinea
    };
    try {
      if (editState) {
        const lineaEdit: ILinea = unwrapResult(
          await dispatch(LineaSliceRequests.GetByCodigoInicio(editState.identificadorLinea.toString()))
        );
        result = await dispatch(LineaProduccionSliceRequests.PutRequest(JSON.parse(JSON.stringify(e))));
        lineaSubmit = {
          ...lineaEdit,
          descripcion: e.nombre,
          codigo: e.nombre.slice(0, 2).toLocaleUpperCase(),
          tipo: e.nombre[0].toLocaleUpperCase(),
          tipoUnidad: e.nombre[0].toLocaleUpperCase(),
          codigoInicio: e.identificadorLinea,
          codigoReparacion: e.identificadorLinea
        };
        result2 = await dispatch(LineaSliceRequests.putRequest(JSON.parse(JSON.stringify(lineaSubmit))));
      } else {
        result = await dispatch(LineaProduccionSliceRequests.PostRequest(JSON.parse(JSON.stringify(e))));
        result2 = await dispatch(LineaSliceRequests.postRequest(JSON.parse(JSON.stringify(lineaSubmit))));
      }
    } catch (x) {
      result = null;
    }
    if (result && result2) {
      openNotificationUI("Se agrego la linea correctamente", "success");
      setOpenPopup(false);
      refresh();
    }
  };

  //Leer Producto
  // const watchProducto = watch("productoId");
  const [listProducto, setListProducto] = useState([]);
  const getProducto = async () => {
    try {
      const responses = unwrapResult(await dispatch(ProductoSliceRequests.getAllRequest()));
      setListProducto(responses);
    } catch (error) {
      openNotificationUI("Error al leer producto.", "error");
    }
  };
  useEffect(() => {
    setValue("productoId", productId);
  }, [listProducto]);

  const watchPlanta = watch("plantId");
  useEffect(() => {
    if (watchPlanta) {
      // setValue("plantId", plant);
      getProducto();
    }
  }, [watchPlanta]);

  //Leer Plantas
  const [listPlantas, setListPantas] = useState([]);
  const getPlantas = async () => {
    try {
      const responses = unwrapResult(await dispatch(PlantSliceRequests.getAllRequest()));
      setListPantas(responses);
    } catch (error) {
      openNotificationUI("Error al leer plantas.", "error");
    }
  };

  const [indentificadoresLinea, setIdentificadoresLinea] = useState([]);
  useEffect(() => {
    getPlantas();
    lineasProduccion.forEach((elementos) => {
      setIdentificadoresLinea((prev) => prev.concat(elementos.identificadorLinea));
    });
  }, []);

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
                  <InputLabel>Añada una descripción</InputLabel>
                  <Input {...field} />
                  {!!error && <FormHelperText>{error.type}</FormHelperText>}
                </FormControl>
              )}
            />
            <Controller
              name="identificadorLinea"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <FormControl fullWidth variant="outlined" error={!!error}>
                  <InputLabel>Añada el codigo de la linea</InputLabel>
                  <Input
                    {...field}
                    {...register("identificadorLinea", {
                      validate: (value) => {
                        const mismoCodigo = indentificadoresLinea.some((elementos) => {
                          return elementos == value;
                        });
                        if (mismoCodigo) {
                          return "Este codigo ya se encontro en una linea";
                        } else {
                          return true;
                        }
                      }
                    })}
                  />
                  {!!error && <FormHelperText>{errors.identificadorLinea?.message}</FormHelperText>}
                </FormControl>
              )}
            />

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
            <Controller
              control={control}
              name="trazaSPP"
              render={({ field, fieldState: { error } }) => (
                <FormControl>
                  <FormControlLabel
                    label="Hace la trazabilidad en traza nuevo?"
                    control={<Checkbox {...field} defaultChecked={editState ? editState.trazaSPP : false} />}
                  />
                  {!!error && <FormHelperText className="text-red-500">{error.message}</FormHelperText>}
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
