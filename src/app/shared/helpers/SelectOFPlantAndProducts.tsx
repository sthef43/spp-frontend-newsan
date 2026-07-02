import { FormControl, FormHelperText, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { useAppSelector } from "app/core/store/store";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { unwrapResult } from "@reduxjs/toolkit";
import _ from "lodash";
import { IPlant } from "../../models/IPlant";
import { IProducto } from "../../models/IProducto";
import { useAppDispatch } from "../../core/store/store";
import { useNotificationUI } from "../hooks/useNotificationUI";
import { PlantSliceRequests, plantSlice } from "../../Middleware/reducers/PlantSlice";
import { LineaProduccionSliceRequests, lineaProduccionSlice } from "../../Middleware/reducers/lineaProducionSlice";
import { LoadingUISlice } from "../../Middleware/reducers/LoadingUISlice";
import { ILineaProduccion } from "app/models/ILineaProduccion";
import { LineaSliceRequests } from "app/Middleware/reducers/LineaSlice";
import { productoSlice } from "app/Middleware/reducers";
import { ContainerForPages } from "./Containers/ContainerForPages";

interface ISelectOFPlantAndProducts {
  selectLineas?: boolean;
  notShadow?: boolean;
  col?: boolean;
  activeLayoutGeneric?: boolean;
  deactivateStyles?: boolean;
  onGetProps?: (productoId: number) => void;
  setProductoId?: (id: number) => void;
  setLineaProduccionId?: (id: number) => void;
  setCodigoErrorProps?: (codigo: string) => void;
  setTipoUnidadLinea?: (tipoUnidad: string) => void;
  stylesForSelects?: "outlined" | "standard" | "filled";
  children?: JSX.Element;
}
interface initialState {
  plantId: number;
  productoId: number;
  lineaProduccionId: number;
}
const initialStateVar = {
  plantId: 0,
  productoId: 0,
  lineaProduccionId: 0
};

/**
 * @param onGetProps: (productoId:number) => void; Es la funcion que va a recibir el productoId y ejecutar.
 * @param setProductoId?: (id: number) => void; setState para obtener el valor del productoId
 * @param selectLineas: boolean; Condicional para traer el select de las lineas o no .
 * @param notShadow: boolean; Condicional para heredar el shadow o no .
 * @param setLineaProduccionId?: (id: number) => void; setState para obtener el valor de lineaProduccionId
 * @param setCodigoErrorProps?: (codigo: string) => void; setState para obtener el codigo de reparación de lineaProduccion
 * @param children?: JSX.Element; Si es necesario un select/componente, se puede renderizar dentro para que quede todo bien distribuido
 * @returns Selección de planta y producto
 */
export const SelectOFPlantAndProducts = (props: ISelectOFPlantAndProducts): JSX.Element => {
  const {
    onGetProps,
    setProductoId,
    children,
    selectLineas,
    notShadow,
    setLineaProduccionId,
    setCodigoErrorProps,
    setTipoUnidadLinea,
    col,
    activeLayoutGeneric,
    stylesForSelects,
    deactivateStyles
  } = props;
  const plantas: IPlant[] = useAppSelector<IPlant[]>((state) => state.plant.dataAll);
  const lineas: ILineaProduccion[] = useAppSelector<ILineaProduccion[]>((state) => state.lineaProduccion.dataAll);
  const { control, setValue, getValues, watch } = useForm<initialState>({
    defaultValues: initialStateVar
  });
  const [productos, setProductos] = useState<IProducto[]>([]);
  const [tipoUnidad, setTipoUnidad] = useState<string>("");
  const { openNotificationUI } = useNotificationUI();
  const productoId = watch("productoId");
  const lineaProduccionIdWatch = watch("lineaProduccionId");
  const plantIdWatch = watch("plantId");
  const dispatch = useAppDispatch();

  const onGetPlants = async () => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      setValue("productoId", 0);
      await dispatch(PlantSliceRequests.getAllRequest());
      getPlantByUser();
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    } catch (e) {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
      openNotificationUI(e, "error");
    }
  };

  const onGetProducts = async () => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      const plantId = getValues("plantId");
      dispatch(plantSlice.actions.setSelectPlant(plantId));
      const response = unwrapResult(await dispatch(LineaProduccionSliceRequests.getLineaByPlantIdRequest(plantId)));
      const productsGroup = _.groupBy(response, "productoId");
      const key = Object.keys(productsGroup);
      if (key) {
        const productosSinKeys = key.map((k) => {
          return productsGroup[k][0].producto;
        });
        setProductos(productosSinKeys);
      }
      getLocalStorage("productoId");
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    } catch (e) {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
      openNotificationUI(e, "error");
    }
  };

  const onGetLineas = async () => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      const productoId = getValues("productoId");
      await dispatch(LineaProduccionSliceRequests.getAllByProductId(productoId));
      getLocalStorage("lineaProduccionId");
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    } catch (e) {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
      openNotificationUI(e, "error");
    }
  };
  const setLocalStorage = (name: "productoId" | "lineaProduccionId" | "plantId") => {
    localStorage.setItem(name, getValues(name)?.toString());
  };
  const getLocalStorage = (name: "productoId" | "lineaProduccionId" | "plantId") => {
    const value = parseInt(localStorage.getItem(name));
    if (value) {
      setValue(name, value);
    }
  };

  const onChangeProduct = () => {
    setProductoId && setProductoId(getValues("productoId"));
    onGetProps && onGetProps(getValues("productoId"));
    selectLineas && onGetLineas();
    setLocalStorage("productoId");
    dispatch(productoSlice.actions.setProducto(productos?.find((producto) => producto.id == getValues("productoId"))));
  };

  const onGetTipoDeUnidad = async (): Promise<void> => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      const lineasProdu = unwrapResult(await dispatch(LineaSliceRequests.getAllRequest()));
      const lineaSelect = lineas?.find((l) => l.id == getValues("lineaProduccionId"))?.identificadorLinea?.toString();
      const lineaTipoUnidad = lineasProdu?.find((line) => line?.codigoReparacion == lineaSelect)?.tipoUnidad;
      setTipoUnidad(lineaTipoUnidad);
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    } catch (err) {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
      openNotificationUI(err, "error");
    }
  };

  const ConditionalWrapper = ({ condicion, children }: { condicion: boolean; children: JSX.Element }) => {
    return condicion ? (
      <ContainerForPages optionsLayout="Selects">{children}</ContainerForPages>
    ) : (
      <div
        className={`${deactivateStyles ? "w-full" : "w-full m-auto bg-secondaryNew text-center shadow-md rounded-lg"} ${
          !notShadow && "shadow-elevation-4"
        } `}>
        {children}
      </div>
    );
  };

  // Trae la planta que tiene en el localstorage
  const getPlantByUser = () => {
    getLocalStorage("plantId");
  };

  useEffect(() => {
    if (productoId != 0) onChangeProduct();
  }, [productoId]);

  useEffect(() => {
    onGetPlants();
  }, []);

  useEffect(() => {
    setTipoUnidadLinea && setTipoUnidadLinea(tipoUnidad);
  }, [tipoUnidad]);

  useEffect(() => {
    getValues("lineaProduccionId") != 0 && setTipoUnidadLinea && onGetTipoDeUnidad();
    setLineaProduccionId && setLineaProduccionId(getValues("lineaProduccionId"));
    setCodigoErrorProps &&
      setCodigoErrorProps(lineas?.find((l) => l.id == getValues("lineaProduccionId"))?.identificadorLinea?.toString());
    dispatch(lineaProduccionSlice.actions.setSelectLinea(getValues("lineaProduccionId")));
    getValues("lineaProduccionId") != 0 && setLocalStorage("lineaProduccionId");
  }, [lineaProduccionIdWatch]);

  useEffect(() => {
    if (getValues("plantId") != 0) {
      onGetProducts();
      setLocalStorage("plantId");
    }
  }, [plantIdWatch]);

  useEffect(() => {
    const lineaId = getValues("lineaProduccionId");
    if (lineaId != 0 && lineas.length > 0 && !lineas.find((linea) => linea.id == lineaId)) {
      setValue("lineaProduccionId", 0);
    }
  }, [lineas]);

  return (
    <ConditionalWrapper condicion={activeLayoutGeneric}>
      <div
        className={`py-4 gap-6 mx-2 h-full w-full flex flex-col minnotebook:flex-row ${col && "minnotebook:flex-col"}`}>
        <Controller
          name="plantId"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <FormControl fullWidth variant={stylesForSelects ? stylesForSelects : "standard"} error={!!error}>
              <InputLabel>Seleccione una planta</InputLabel>
              <Select
                label="Seleccione una planta"
                {...field}
                variant={stylesForSelects ? stylesForSelects : "standard"}>
                {plantas?.map((x) => (
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
        {productos.length > 0 ? (
          <Controller
            name="productoId"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <FormControl fullWidth variant={stylesForSelects ? stylesForSelects : "standard"} error={!!error}>
                <InputLabel>Seleccione un producto</InputLabel>
                <Select
                  label="Seleccione un producto"
                  {...field}
                  variant={stylesForSelects ? stylesForSelects : "standard"}>
                  {productos?.map((x) => (
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
        ) : (
          <TextField value="Sin productos asignados" disabled />
        )}
        {lineas?.length > 0 && productoId != 0 && selectLineas && (
          <Controller
            name="lineaProduccionId"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <FormControl fullWidth variant={stylesForSelects ? stylesForSelects : "standard"} error={!!error}>
                <InputLabel>Seleccione una linea de producción</InputLabel>
                <Select
                  label="Seleccione una linea de producción"
                  {...field}
                  variant={stylesForSelects ? stylesForSelects : "standard"}>
                  {lineas?.map((x) => (
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
        )}
        {getValues("productoId") > 0 && children}
      </div>
    </ConditionalWrapper>
  );
};
