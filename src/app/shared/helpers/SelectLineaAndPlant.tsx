/* eslint-disable unused-imports/no-unused-vars */
import { useAppDispatch } from "app/core/store/store";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNotificationUI } from "../hooks/useNotificationUI";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { IPlant, IProducto } from "app/models";
import { unwrapResult } from "@reduxjs/toolkit";
import { productoSlice } from "app/features/trazabilidad/slices/ProductoSlice";
import { plantSlice, PlantSliceRequests } from "app/Middleware/reducers";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { LineaProduccionSliceRequests } from "app/Middleware/reducers/lineaProducionSlice";
import _ from "lodash";
import { GetInfoUser } from "./userConfig";
import { OperatorSliceRequests } from "app/Middleware/reducers/OperatorSlice";
import { ContainerForPages } from "./Containers/ContainerForPages";

interface initialState {
  plantaId: number;
  productoId: number;
}

const initialStateValue = {
  plantaId: 0,
  productoId: 0
};

interface BaseProps {
  setPlantaId?: (newValue: number) => void;
  setProductoId?: (newValue: number) => void;
  aniadirCodigoHtml?: JSX.Element;
  varianteEstilo?: "standard" | "outlined" | "filled";
  estilosContainerPadre?: string;
  envolverCodigoHtml?: boolean;
}

interface EstilosRequeridos extends BaseProps {
  activarEstilosPersonalizados: true;
  estilos: string;
}

interface EstilosOpcionales extends BaseProps {
  activarEstilosPersonalizados?: false;
  estilos?: string;
}

type Props = EstilosOpcionales | EstilosRequeridos;

/**
 * @component SelectLineaAndPlant
 * @description Componente de React que renderiza dos selectores (dropdowns) interdependientes para seleccionar una planta y un producto.
 * La lista de productos se filtra dinámicamente según la planta seleccionada. Gestiona el estado del formulario con `react-hook-form`
 * para optimizar el rendimiento y se integra con Redux Toolkit para las llamadas a la API y la gestión del estado global.
 * * ### Lógica y Arquitectura:
 * - **Gestión de Estado de Formulario**: Utiliza `react-hook-form` (`useForm`, `Controller`) para manejar los valores de los selectores. Esto minimiza los re-renders, actualizando solo los componentes de input necesarios en lugar de todo el componente.
 * - **Reactividad con `useEffect`**: El hook `useEffect` observa cambios en la planta seleccionada (`watchPlantaId`) para disparar la carga de productos correspondientes, creando una experiencia de usuario dinámica.
 * - **Estado Global con Redux Toolkit**: Despacha acciones para obtener datos (`PlantSliceRequests`, `LineaProduccionSliceRequests`) y para actualizar el estado global de la aplicación (`plantSlice`, `productoSlice`), manteniendo la lógica de negocio separada de la UI.
 * * @param {Props} props - Las props para configurar el componente.
 * @param {(newValue: number) => void} [props.setPlantaId] - Función callback que se ejecuta al seleccionar una planta. Devuelve el `id` de la planta al componente padre.
 * @param {(newValue: number) => void} [props.setProductoId] - Función callback que se ejecuta al seleccionar un producto. Devuelve el `id` del producto al componente padre.
 * @param {boolean} [props.activarEstilosPersonalizados=false] - Si es `true`, permite aplicar clases de CSS personalizadas a través de la prop `estilos`.
 * @param {string} [props.estilos] - Cadena de texto con clases de CSS (ej. Tailwind CSS) para el contenedor principal. Requerido si `activarEstilosPersonalizados` es `true`.
 * @param {JSX.Element} [props.aniadirCodigoHtml] - Elemento JSX que se renderiza condicionalmente al final del componente una vez que se ha seleccionado un producto. Ideal para añadir botones o información adicional.
 * @param {"standard" | "outlined" | "filled"} [props.varianteEstilo="outlined"] - Define la variante de estilo de los componentes `Select` de Material-UI.
 * * @returns {JSX.Element} El componente renderizado con los dos selectores.
 * * @example
 * // Uso en un componente padre para capturar los IDs y añadir un botón.
 * * import React, { useState } from 'react';
 * import { SelectLineaAndPlant } from './SelectLineaAndPlant';
 * import { Button } from '@mui/material';
 * * const MiVista = () => {
 * const [idPlanta, setIdPlanta] = useState<number>(0);
 * const [idProducto, setIdProducto] = useState<number>(0);
 * * return (
 * <div>
 * <h2>Seleccione Planta y Producto</h2>
 * <SelectLineaAndPlant
 * setPlantaId={setIdPlanta}
 * setProductoId={setIdProducto}
 * varianteEstilo="filled"
 * aniadirCodigoHtml={
 * <Button
 * variant="contained"
 * onClick={() => alert(`Planta: ${idPlanta}, Producto: ${idProducto}`)}
 * >
 * Confirmar
 * </Button>
 * }
 * />
 * </div>
 * );
 * }
 */

export const SelectLineaAndPlant: React.FC<Props> = ({
  activarEstilosPersonalizados,
  estilos,
  setPlantaId,
  setProductoId,
  aniadirCodigoHtml,
  varianteEstilo,
  estilosContainerPadre,
  envolverCodigoHtml
}) => {
  const dispatch = useAppDispatch();

  const { openNotificationUI } = useNotificationUI();

  const { watch, setValue, control, getValues } = useForm<initialState>({ defaultValues: initialStateValue });

  const activarEstilosContainerPadre = estilosContainerPadre ? estilosContainerPadre : "w-full";
  const watchPlantaId = watch("plantaId");
  const watchProductoId = watch("productoId");

  const getOperarios = async () => {
    const usuario = GetInfoUser();
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      const response = unwrapResult(await dispatch(OperatorSliceRequests.getInfoByDni(usuario.dni)));
      if (response) {
        setValue("plantaId", response.plantaId);
      }
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    } catch (error) {
      openNotificationUI(`Se encontro un error: ${error}`, "error");
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
  };

  const [listaPlantas, setListaPlantas] = useState<IPlant[]>([]);
  const getPlantas = async () => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando"));
      const response = unwrapResult(await dispatch(PlantSliceRequests.getAllRequest()));
      if (response) {
        setListaPlantas(response);
      }
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    } catch (error) {
      openNotificationUI(`Se encontro un error: ${error}`, "error");
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
  };

  const [listaProductos, setListaProductos] = useState<IProducto[]>([]);
  const getProducts = async () => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      const response = unwrapResult(
        await dispatch(LineaProduccionSliceRequests.getLineaByPlantIdRequest(watchPlantaId))
      );
      const productsGroup = _.groupBy(response, "productoId");
      const key = Object.keys(productsGroup);
      if (key) {
        const productosSinKeys = key.map((k) => {
          return productsGroup[k][0].producto;
        });
        setListaProductos(productosSinKeys);
      }
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    } catch (error) {
      console.log(error);
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
  };

  useEffect(() => {
    getOperarios();
    getPlantas();
  }, []);

  useEffect(() => {
    if (watchPlantaId) {
      getProducts();
      setValue("productoId", 0);
      setPlantaId(watchPlantaId);
      dispatch(plantSlice.actions.setSelectPlant(watchPlantaId));
    }
  }, [watchPlantaId]);

  useEffect(() => {
    if (watchProductoId) {
      setProductoId && setProductoId(watchProductoId);
      const productoBuscado = listaProductos.find((elementos) => elementos.id == watchProductoId);
      dispatch(productoSlice.actions.setProducto(productoBuscado));
    }
  }, [watchProductoId]);

  return !envolverCodigoHtml ? (
    <main className={`${activarEstilosContainerPadre}`}>
      <ContainerForPages optionsLayout="Selects">
        <div className="w-full">
          <Controller
            name="plantaId"
            control={control}
            defaultValue={0}
            render={({ field, fieldState: { error } }) => (
              <FormControl fullWidth variant={varianteEstilo ? varianteEstilo : "outlined"}>
                <InputLabel>Seleccione una planta</InputLabel>
                <Select label="Seleccione una planta" {...field}>
                  {listaPlantas &&
                    listaPlantas?.map((elementos) => (
                      <MenuItem key={elementos.id} value={elementos.id}>
                        <div className="w-full">
                          <div>{elementos.name}</div>
                        </div>
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            )}
          />
        </div>
        <div className="w-full">
          <Controller
            name="productoId"
            control={control}
            defaultValue={0}
            render={({ field, fieldState: { error } }) => (
              <FormControl fullWidth variant={varianteEstilo ? varianteEstilo : "outlined"}>
                <InputLabel>Seleccione un producto</InputLabel>
                <Select label="Seleccione un producto" {...field}>
                  {listaProductos &&
                    listaProductos?.map((elementos) => (
                      <MenuItem key={elementos.id} value={elementos.id}>
                        <div className="w-full">
                          <div>{elementos.nombre}</div>
                        </div>
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            )}
          />
        </div>
        {watchProductoId !== 0 && aniadirCodigoHtml}
      </ContainerForPages>
    </main>
  ) : (
    <main className={`${activarEstilosContainerPadre}`}>
      <section className={`${activarEstilosPersonalizados ? `${estilos}` : "w-full mt-6 bg-background p-5 flex"}`}>
        <div className="flex flex-row gap-4 w-full">
          <div className="w-full">
            <Controller
              name="plantaId"
              control={control}
              defaultValue={0}
              render={({ field, fieldState: { error } }) => (
                <FormControl fullWidth variant={varianteEstilo ? varianteEstilo : "outlined"}>
                  <InputLabel>Seleccione una planta</InputLabel>
                  <Select label="Seleccione una planta" {...field}>
                    {listaPlantas &&
                      listaPlantas?.map((elementos) => (
                        <MenuItem key={elementos.id} value={elementos.id}>
                          <div className="w-full">
                            <div>{elementos.name}</div>
                          </div>
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              )}
            />
          </div>
          <div className="w-full">
            <Controller
              name="productoId"
              control={control}
              defaultValue={0}
              render={({ field, fieldState: { error } }) => (
                <FormControl fullWidth variant={varianteEstilo ? varianteEstilo : "outlined"}>
                  <InputLabel>Seleccione un producto</InputLabel>
                  <Select label="Seleccione un producto" {...field}>
                    {listaProductos &&
                      listaProductos?.map((elementos) => (
                        <MenuItem key={elementos.id} value={elementos.id}>
                          <div className="w-full">
                            <div>{elementos.nombre}</div>
                          </div>
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              )}
            />
          </div>
          {watchProductoId !== 0 && aniadirCodigoHtml}
        </div>
      </section>
    </main>
  );
};
