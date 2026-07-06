import { FormControl, FormHelperText, InputLabel, MenuItem, Select } from "@mui/material";
import { PlantSliceRequests } from "app/Middleware/reducers";
import { PaniolPISliceRequests } from "app/features/programacionIndustrial/slices/PaniolPISlice";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import { IPlant } from "app/models";
import { PaniolTable } from "app/features/programacionIndustrial/controlPañolPI/components/PaniolTable";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";

export const PaniolPage = () => {
  const { TitleChanger } = useTitleOfApp();
  const dispatch = useAppDispatch();
  const plantas = useAppSelector<IPlant[]>((state) => state.plant.dataAll);
  const { control, watch } = useForm({ defaultValues: { plantId: 4 } });
  useEffect(() => {
    TitleChanger("Control pañol de Programación Industrial");
    dispatch(PlantSliceRequests.getAllRequest());
  }, []);
  const plantWatch = watch("plantId");
  useEffect(() => {
    dispatch(PaniolPISliceRequests.getAllByPlantId(plantWatch));
  }, [plantWatch]);

  return (
    <div>
      <div className="gap-4 my-2 mx-4 p-4  bg-secondaryNew shadow-elevation-4">
        {plantas && (
          <Controller
            name="plantId"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <FormControl fullWidth variant="outlined" error={!!error}>
                <InputLabel variant="filled">Seleccione una planta</InputLabel>
                <Select className="pt-2" {...field}>
                  {plantas &&
                    plantas.map((x) => (
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
        )}
        {plantWatch != 0 && <PaniolTable plantId={plantWatch} />}
      </div>
    </div>
  );
};
