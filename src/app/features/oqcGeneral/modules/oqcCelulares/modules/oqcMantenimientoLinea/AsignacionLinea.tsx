import { FormControl, Button, InputLabel, FormHelperText, MenuItem, Select, Input } from "@mui/material";
import { unwrapResult } from "@reduxjs/toolkit";
import { ProductoSliceRequests } from "app/features/trazabilidad/slices/ProductoSlice";
import { PlantSliceRequests } from "app/Middleware/reducers";
import { LineaProduccionFamiliaSliceRequests } from "app/Middleware/reducers/LineaProduccionFamiliaSlice";
import { LineaProduccionSliceRequests } from "app/Middleware/reducers/lineaProducionSlice";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import { IFamilia } from "app/models/IFamilia";
import { ILineaProduccion } from "app/models/ILineaProduccion";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

interface Props {
  setAsignar: (state: boolean) => void;
  dataEdit: IFamilia | null;
  plant?: number;
  productId: number;
  refresh?: any;
  refreshfam?: any;
  lineasComponente: ILineaProduccion[];
  actualizarLineas: (newValue: ILineaProduccion[]) => void;
}
export const AsignacionLinea = ({
  setAsignar,
  dataEdit,
  plant,
  productId,
  refresh,
  refreshfam,
  lineasComponente,
  actualizarLineas
}: Props) => {
  interface initialState {
    lineaProduccionId: number;
    familiaid: number;
    plantId: number;
    productoId: number;
    nombre: string;
  }
  const initialStateVar = {
    plantId: plant,
    nombre: dataEdit.nombre,
    productoId: productId,
    lineaProduccionId: null,
    familiaid: dataEdit.id
  };

  const { control, setValue, getValues, handleSubmit, watch, formState } = useForm<initialState>({
    defaultValues: initialStateVar
  });

  const { openNotificationUI } = useNotificationUI();
  const dispatch = useAppDispatch();
  const lineas = useAppSelector((state) => state.lineaProduccion.dataAll);

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

  const getLineasProduccion = async () => {
    try {
      const responses = unwrapResult(
        await dispatch(
          LineaProduccionSliceRequests.getLineaByPlantaIdAndProductoId({ plantaId: plant, productoId: productId })
        )
      );
      setListProducto(responses);
      actualizarLineas(responses);
    } catch (error) {
      openNotificationUI("Error al leer producto.", "error");
    }
  };

  const { isDirty, isValid, errors } = formState;
  useEffect(() => {
    console.log(errors);
  }, [errors]);

  const AsignarLineaFamilia = async (e) => {
    console.log(e);
    const { lineaProduccionId, familiaid } = e;
    const payload = { lineaProduccionId, familiaid };
    console.log("DATOS A INSERTAR: " + JSON.stringify(payload));
    let result;
    try {
      result = await dispatch(LineaProduccionFamiliaSliceRequests.PostRequest(JSON.parse(JSON.stringify(payload))));
    } catch (x) {
      result = null;
    }
    if (result) {
      openNotificationUI("Dato agregado exitosamente :)", "success");
    } else {
      openNotificationUI(result.payload.ParamName, "warning");
    }
    setAsignar(false);
    refresh();
    refreshfam();
    setFiltradoLineas([]);
    getLineasProduccion();
  };

  const [filtradoLineas, setFiltradoLineas] = useState<ILineaProduccion[]>([]);
  const filtarLineas = () => {
    const nombreLineasSinFamilia = lineas.map((elementos) => {
      return {
        linea: elementos.nombre,
        lineaProduccion: elementos.lineaProduccionFamilia.filter((aux) => aux.familiaId == dataEdit.id)
      };
    });
    const lineasSinFamilia = nombreLineasSinFamilia.map((elementos) => {
      if (elementos.lineaProduccion.length == 0) {
        return elementos.linea;
      }
    });
    lineasSinFamilia.map((elementos) => {
      const lineaFiltrada = lineas.filter((elementos2) => elementos2.nombre == elementos);
      setFiltradoLineas((prev) => prev.concat(lineaFiltrada));
    });
  };

  useEffect(() => {
    getPlantas();
    getProducto();
    filtarLineas();
  }, []);

  return (
    <form onSubmit={handleSubmit(AsignarLineaFamilia)} className="flex flex-col justify-center gap-5">
      <Controller
        name="plantId"
        control={control}
        rules={{ required: true }}
        render={({ field, fieldState: { error } }) => (
          <FormControl fullWidth variant="outlined" error={!!error}>
            <InputLabel>Seleccione una planta</InputLabel>
            <Select {...field} variant="standard" disabled>
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
            <Select {...field} variant="standard" disabled>
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
        name="nombre"
        control={control}
        rules={{ required: true }}
        render={({ field, fieldState: { error } }) => (
          <FormControl fullWidth variant="outlined" error={!!error} disabled>
            <InputLabel>Familia</InputLabel>
            <Input {...field} />
            {!!error && <FormHelperText>{error.type}</FormHelperText>}
          </FormControl>
        )}
      />

      {/* las lineas  */}
      <Controller
        name="lineaProduccionId"
        control={control}
        render={({ field, fieldState: { error } }) => (
          <FormControl fullWidth variant="outlined" error={!!error}>
            <InputLabel>Seleccione una linea de producción</InputLabel>
            <Select {...field} variant="standard">
              {filtradoLineas?.map((x) => (
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
      <Button
        variant="outlined"
        color="secondary"
        onClick={() => {
          setAsignar(false);
          setFiltradoLineas([]);
        }}>
        Cancelar
      </Button>
    </form>
  );
};
