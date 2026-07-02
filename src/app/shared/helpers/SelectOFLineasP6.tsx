import { FormControl, FormHelperText, InputLabel, MenuItem, Select } from "@mui/material";
import { useAppSelector } from "app/core/store/store";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { IProducto } from "../../models/IProducto";
import { useAppDispatch } from "../../core/store/store";
import { useNotificationUI } from "../hooks/useNotificationUI";
import { LoadingUISlice } from "../../Middleware/reducers/LoadingUISlice";
import { LineaSliceRequests } from "app/Middleware/reducers/LineaSlice";
import { ILinea } from "app/models";

interface ISelectOFPlantAndProducts {
  onGetProps?: (productoId: number) => void;
  setIdLinea?: (id: number) => void;
  setCodigoReparacion?: (codigo: string) => void;
  children?: JSX.Element;
}
interface initialState {
  idLinea: number;
}
const initialStateVar = {
  idLinea: 0
};

/**
 * @param onGetProps: (productoId:number) => void; Es la funcion que va a recibir el `idLinea` y ejecutar.
 * @param setIdLinea?: (id: number) => void; setState para obtener el valor del idLinea
 * @param setCodigoReparacion?: (codigo: string) => void; setState para obtener el codigo de repación de la linea
 * @param children?: JSX.Element; Si es necesario un select/componente, se puede renderizar dentro para que quede todo bien distribuido
 * @returns Selección de planta y producto
 */
export const SelectOFLineasP6 = (props: ISelectOFPlantAndProducts): JSX.Element => {
  const { onGetProps, children, setIdLinea, setCodigoReparacion } = props;
  const lineas: ILinea[] = useAppSelector<ILinea[]>((state) => state.linea.dataAll);
  const { control, setValue, getValues, watch } = useForm<initialState>({
    defaultValues: initialStateVar
  });
  const [productos, setProductos] = useState<IProducto[]>([]);
  const { openNotificationUI } = useNotificationUI();
  const dispatch = useAppDispatch();
  const lineaWatch = watch("idLinea");

  const onGetLineas = async () => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      const response = await dispatch(LineaSliceRequests.getAllRequest());
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    } catch (e) {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
      openNotificationUI(e, "error");
    }
  };

  const onChangeLineas = () => {
    onGetProps && onGetProps(getValues("idLinea"));
    setIdLinea && setIdLinea(getValues("idLinea"));
    setCodigoReparacion && setCodigoReparacion(lineas.find((l) => l.idLinea == getValues("idLinea"))?.codigoReparacion);
  };

  useEffect(() => {
    onGetLineas();
  }, []);

  useEffect(() => {
    onChangeLineas();
  }, [lineaWatch]);

  return (
    <div className="container mx-auto shadow-elevation-4">
      <div className={`py-4 grid gap-10 mx-2 ${children ? "grid-cols-2" : "grid-cols-1"}`}>
        {lineas?.length > 0 && (
          <Controller
            name="idLinea"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <FormControl fullWidth variant="outlined" error={!!error}>
                <InputLabel>Seleccione una linea</InputLabel>
                <Select {...field} variant="standard">
                  {lineas?.map((x) => (
                    <MenuItem key={x.idLinea} value={x.idLinea}>
                      <div className="w-full">
                        <div>{x.descripcion}</div>
                      </div>
                    </MenuItem>
                  ))}
                </Select>
                {!!error && <FormHelperText>{error.type}</FormHelperText>}
              </FormControl>
            )}
          />
        )}
        {getValues("idLinea") > 0 && children}
      </div>
    </div>
  );
};
