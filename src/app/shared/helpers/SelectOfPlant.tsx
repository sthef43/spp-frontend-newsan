import { FormControl, FormHelperText, InputLabel, MenuItem, Select } from "@mui/material";
import { useAppSelector } from "app/core/store/store";
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { unwrapResult } from "@reduxjs/toolkit";
import { IPlant } from "../../models/IPlant";
import { useAppDispatch } from "../../core/store/store";
import { useNotificationUI } from "../hooks/useNotificationUI";
import { PlantSliceRequests, plantSlice } from "../../Middleware/reducers/PlantSlice";
import { LoadingUISlice } from "../../Middleware/reducers/LoadingUISlice";
import { OperatorSliceRequests } from "app/Middleware/reducers/OperatorSlice";
import { GetInfoUser } from "./userConfig";

interface ISelectOFPlant {
  notShadow?: boolean;
  onGetProps?: (productoId: number) => void;
  setPlantId?: (id: number) => void;
  setNamePlant?: (name: string) => void;
  children?: JSX.Element;
}
interface initialState {
  plantId: number;
}
const initialStateVar = {
  plantId: 0
};

/**
 * @param onGetProps: (productoId:number) => void; Es la funcion que va a recibir el `productoId` y ejecutar.
 * @param setPlantId?: (id: number) => void; setState para obtener el valor de plantId
 * @param setNamePlant?: (id: number) => void; setState para obtener el nombre de la planta
 * @param notShadow: boolean; Condicional para heredar el shadow o no .
 * @param children?: JSX.Element; Si es necesario un select/componente, se puede renderizar dentro para que quede todo bien distribuido
 * @returns Selección de planta y producto
 */
export const SelectOFPlant = (props: ISelectOFPlant): JSX.Element => {
  const { onGetProps, children, notShadow, setPlantId, setNamePlant } = props;
  const plantas: IPlant[] = useAppSelector<IPlant[]>((state) => state.plant.dataAll);
  const { control, setValue, getValues, watch } = useForm<initialState>({
    defaultValues: initialStateVar
  });
  const { openNotificationUI } = useNotificationUI();
  const plantIdWatch = watch("plantId");
  const dispatch = useAppDispatch();

  const onGetPlants = async () => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      await dispatch(PlantSliceRequests.getAllRequest());
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    } catch (e) {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
      openNotificationUI(e, "error");
    }
  };

  const onChangePlant = () => {
    onGetProps && onGetProps(getValues("plantId"));
    setPlantId && setPlantId(getValues("plantId"));
    setNamePlant && setNamePlant(plantas.find((plant) => plant.id == getValues("plantId")).name);
  };

  // Trae la planta que tiene asignadda por usuario
  const getPlantByUser = async () => {
    try {
      const user = unwrapResult(await dispatch(OperatorSliceRequests.getInfoByDni(GetInfoUser().dni)));
      if (user) {
        setValue("plantId", user?.plantaId || 0);
      }
    } catch (e) {
      openNotificationUI(e, "error");
    }
  };

  useEffect(() => {
    onGetPlants();
    getPlantByUser();
  }, []);

  useEffect(() => {
    if (getValues("plantId") != 0) {
      onChangePlant();
      dispatch(plantSlice.actions.setSelectPlant(getValues("plantId")));
    }
  }, [plantIdWatch]);

  return (
    <div className={`container m-auto bg-secondaryNew text-center  rounded-lg ${!notShadow && "shadow-elevation-4"}`}>
      <div className={`py-4 grid gap-10 mx-2 h-full ${children ? `grid-cols-2` : `grid-cols-1`}`}>
        <Controller
          name="plantId"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <FormControl fullWidth variant="outlined" error={!!error}>
              <InputLabel>Seleccione una planta</InputLabel>
              <Select {...field} variant="standard">
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
        {getValues("plantId") > 0 && children}
      </div>
    </div>
  );
};
