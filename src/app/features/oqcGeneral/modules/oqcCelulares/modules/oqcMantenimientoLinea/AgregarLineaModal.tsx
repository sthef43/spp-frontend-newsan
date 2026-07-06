import React, { useEffect, useState } from "react";
import { Button, TextField, FormControl, InputLabel, Select, MenuItem, FormHelperText, Grow } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { ILineaProduccion } from "app/models/ILineaProduccion";
import { unwrapResult } from "@reduxjs/toolkit";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { useAppDispatch } from "app/core/store/store";
import { LineaSliceRequests } from "app/Middleware/reducers/LineaSlice";
import { ILinea } from "app/models";
import { LineaProduccionSliceRequests } from "app/Middleware/reducers/lineaProducionSlice";
import { ProductoSliceRequests } from "app/features/trazabilidad/slices/ProductoSlice";
import { PlantSliceRequests } from "app/Middleware/reducers";

interface Props {
  open: any;
  handleClose: any;
  editState?: ILineaProduccion | null;
  refresh?: any;
  productId: number;
  plant: number;
}
export const AgregarLineaModal = ({ open, handleClose, plant, productId, editState, refresh }: Props) => {
  interface InitialState {
    nombre: string;
    descripcion: string;
    trazaSPP: boolean;
    identificadorLinea: number | null;
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
  const { openNotificationUI } = useNotificationUI();
  const { control, setValue, getValues, handleSubmit, reset, watch, formState } = useForm<InitialState>({
    defaultValues: initialStateVar
  });

  const { isDirty, isValid, errors } = formState;
  const [showModal, setShowModal] = useState(false);

  //AGREGAR NUEVA LINEA SEGUN QUE PRODUCTO
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
      handleClose(false);
      refresh();
      reset(initialStateVar); // pone las celdas vacia
    }
  };
  ///traigo la planta
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

  //useEfect para actualizar la lista de productos y planta
  useEffect(() => {
    setValue("productoId", productId);
  }, [listProducto]);

  useEffect(() => {
    setValue("plantId", plant);
  }, [listPlantas]);

  useEffect(() => {
    setShowModal(open);
    getPlantas();
    getProducto();
    console.log(plant);
    console.log(productId);
  }, [open]);

  useEffect(() => {
    console.log(errors);
  }, [errors]);

  return (
    <>
      <Grow in={showModal} timeout={500}>
        <div
          className={`${showModal ? "border-[1px] py-4 rounded-md border-gray-300 shadow-lg relative block" : "hidden"}`}>
          <div>
            <header className="relative text-center border-b border-[#a9a9a9]">
              <span
                className="bg-gray-500 absolute cursor-pointer text-center rounded-md right-4 px-[5px] py-[1px]"
                onClick={handleClose}>
                <p className="text-xs font-bold text-white">X</p>
              </span>
              <h2 className="font-bold text-xl py-2">Agregar Línea</h2>
            </header>
            <div className="px-4">
              <form onSubmit={handleSubmit(addProducto)}>
                <div className="flex gap-40 mt-8 items-center">
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
                  {/* Seleccion de producto */}
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
                </div>
                {/* ////// */}
                <div className="flex gap-28 items-center mt-10">
                  <Controller
                    name="nombre"
                    control={control}
                    rules={{ required: "El nombre es requerido" }}
                    render={({ field, fieldState: { error } }) => (
                      <TextField
                        {...field}
                        label="Línea"
                        variant="standard"
                        fullWidth
                        margin="normal"
                        error={!!error}
                        helperText={error ? error.message : null}
                      />
                    )}
                  />
                  <Controller
                    name="descripcion"
                    control={control}
                    render={({ field }) => (
                      <TextField {...field} label="Descripción" variant="standard" fullWidth margin="normal" />
                    )}
                  />
                </div>
                <div className="flex items-center justify-center gap-8 mt-8">
                  <Button variant="contained" color="error" onClick={handleClose}>
                    CANCELAR
                  </Button>
                  <Button type="submit" variant="contained" color="primary" disabled={!isDirty && !isValid}>
                    GUARDAR
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </Grow>
    </>
  );
};
