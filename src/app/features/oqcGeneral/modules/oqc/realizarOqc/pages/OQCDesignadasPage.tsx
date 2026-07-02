/* eslint-disable unused-imports/no-unused-vars */
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { unwrapResult } from "@reduxjs/toolkit";
import { PlantSliceRequests } from "app/Middleware/reducers";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { OperatorSliceRequests } from "app/Middleware/reducers/OperatorSlice";
import { LineaProduccionSliceRequests } from "app/Middleware/reducers/lineaProducionSlice";
import { useAppDispatch } from "app/core/store/store";
import { IPlant, IProducto } from "app/models";
import { ILineaProduccion } from "app/models/ILineaProduccion";
import { OQCDesignadasTable } from "app/features/oqcGeneral/modules/oqc/realizarOqc/components/OQCDesignadasTable";
import { ContainerForPages } from "app/shared/helpers/Containers/ContainerForPages";
import { GetInfoUser } from "app/shared/helpers/userConfig";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import _ from "lodash";
import React, { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { OQCDesignadaSliceRequests } from "app/features/oqcGeneral/slices/OQCDesignadaSlice";

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

export const OQCDesignadasPage = (): JSX.Element => {
  const { watch, control } = useForm<initialState>({ defaultValues: initialStateVar });
  const { openNotificationUI } = useNotificationUI();
  const dispatch = useAppDispatch();
  const { TitleChanger } = useTitleOfApp();
  const autoFocusRef = useRef<HTMLLIElement>(null);

  const onGeTOQCDesignadas = async () => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      const turnoId = unwrapResult(await dispatch(OperatorSliceRequests.getInfoByDni(GetInfoUser().dni | 0))).turnoId;
      if (!turnoId) {
        openNotificationUI(
          "El turno designado al usuario es invalido, por favor comunicarse con un administrados",
          "error"
        );
        return;
      }
      await dispatch(
        OQCDesignadaSliceRequests.getAllByLineaIdAndTurnoRequest({ lineaId: lineaProduccionIdWatch, turnoId })
      );
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    } catch (e) {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
      openNotificationUI(e, "error");
    }
  };

  const [listaPlantas, setListaPlantas] = useState<IPlant[]>([]);
  const getPlantas = async () => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      const response = unwrapResult(await dispatch(PlantSliceRequests.getAllRequest()));
      dispatch(LoadingUISlice.actions.LoadingUIClose());
      if (response) {
        setListaPlantas(response);
      }
    } catch (error) {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
      console.log(error);
    }
  };

  const [productos, setProductos] = useState<IProducto[]>([]);
  const getProductos = async () => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando"));
      const response = unwrapResult(
        await dispatch(LineaProduccionSliceRequests.getLineaByPlantIdRequest(plantaIdWatch))
      );
      if (response) {
        const productsGroup = _.groupBy(response, "productoId");
        const key = Object.keys(productsGroup);
        if (key) {
          const productosSinKeys = key.map((k) => {
            return productsGroup[k][0].producto;
          });
          setProductos(productosSinKeys);
        }
      }
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    } catch (error) {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
      console.log(error);
    }
  };

  const [linea, setLineas] = useState<ILineaProduccion[]>([]);
  const getLineas = async () => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando"));
      const response = unwrapResult(
        await dispatch(
          LineaProduccionSliceRequests.getLineaByPlantaIdAndProductoId({
            plantaId: plantaIdWatch,
            productoId: productoIdWatch
          })
        )
      );
      if (response) {
        setLineas(response);
      }
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    } catch (error) {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
      console.log(error);
    }
  };

  useEffect(() => {
    TitleChanger("OQC designadas");
    getPlantas();
  }, []);

  const plantaIdWatch = watch("plantId");
  useEffect(() => {
    if (plantaIdWatch) {
      getProductos();
      setLineas([]);
      setProductos([]);
    }
  }, [plantaIdWatch]);

  const productoIdWatch = watch("productoId");
  useEffect(() => {
    getLineas();
    setLineas([]);
  }, [productoIdWatch]);

  const lineaProduccionIdWatch = watch("lineaProduccionId");
  useEffect(() => {
    onGeTOQCDesignadas();
  }, [lineaProduccionIdWatch]);

  return (
    <ContainerForPages optionsLayout="page">
      <ContainerForPages optionsLayout="Selects" activeEffectVisible>
        <Controller
          control={control}
          name="plantId"
          render={({ field, fieldState: { error } }) => (
            <FormControl fullWidth variant="outlined">
              <InputLabel>Seleccione una planta</InputLabel>
              <Select variant="outlined" {...field} label="Seleccione una planta">
                {listaPlantas?.map((elementos) => (
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
        <Controller
          control={control}
          name="productoId"
          render={({ field, fieldState: { error } }) => (
            <FormControl fullWidth variant="outlined">
              <InputLabel>Seleccione un producto</InputLabel>
              <Select variant="outlined" {...field} label="Seleccione un producto">
                {productos?.map((elementos) => (
                  <MenuItem
                    key={elementos.id}
                    value={elementos.id}
                    disabled={elementos.nombre.toLocaleLowerCase().includes("celulares")}>
                    <div className="w-full">
                      <div>{elementos.nombre}</div>
                    </div>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        />
        <Controller
          control={control}
          name="lineaProduccionId"
          render={({ field, fieldState: { error } }) => (
            <FormControl fullWidth variant="outlined">
              <InputLabel>Seleccione una linea</InputLabel>
              <Select variant="outlined" {...field} label="Seleccione una linea">
                {linea?.map((elementos) => (
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
      </ContainerForPages>
      {linea && <OQCDesignadasTable />}
    </ContainerForPages>
  );
};
