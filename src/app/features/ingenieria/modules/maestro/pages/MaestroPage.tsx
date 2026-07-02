import { FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { FamiliaSliceRequests } from "app/Middleware/reducers/FamiliaSlice";
// import { GenericoSliceRequests } from "app/Middleware/reducers/GenericoSlice";
import { SupermaestroSliceRequest } from "app/Middleware/reducers/SupermaestroSlice";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
// import { IGenerico } from "app/models";
import { IFamilia } from "app/models/IFamilia";
import { ISupermaestro } from "app/models/ISupermaestro";
import TitleUIComponent from "app/shared/components/helpComponents/TitleUIComponent";
import { ComercialGenerador } from "app/features/ingenieria/components/ComercialGenerador";
import { SupermaestroDataTansfer } from "app/features/ingenieria/modules/maestro/modals/SupermaestroDataTansfer";
import { SupermaestroDeleteAll } from "app/features/ingenieria/modules/maestro/components/SupermaestroDeleteAll";
import { SupermaestroLoadExcel } from "app/features/ingenieria/modules/maestro/components/SupermaestroLoadExcel";
import { SupermaestroTable } from "app/features/ingenieria/modules/maestro/components/SupermaestroTable";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";

export const MaestroPage = (): JSX.Element => {
  const { TitleChanger } = useTitleOfApp();
  const dispatch = useAppDispatch();
  const { openNotificationUI } = useNotificationUI();
  const familias: IFamilia[] = useAppSelector<IFamilia[]>((state) => state.familia.dataAll);
  const supermaestro: ISupermaestro[] = useAppSelector<ISupermaestro[]>((state) => state.supermaestro.dataAll);
  const { control, watch, getValues } = useForm({
    defaultValues: { generico: "" }
  });
  const onGetMaestros = async () => {
    try {
      await dispatch(SupermaestroSliceRequest.getByGenerico(getValues("generico")));
    } catch (e) {
      openNotificationUI(e, "error");
    }
  };
  const genericoWatch = watch("generico");
  useEffect(() => {
    TitleChanger("Maestro page");
    dispatch(FamiliaSliceRequests.getAllByProductoId(1));
  }, []);

  return (
    <div className="m-1 sm:m-10 h-full">
      <div className="p-4 m-2 rounded-lg shadow-elevation-4 bg-secondaryNew flex gap-4 items-center">
        <FormControl fullWidth variant="filled">
          <InputLabel variant="filled">Seleccione un generico</InputLabel>
          <Controller
            name="generico"
            control={control}
            rules={{ required: "Seleccione un genérico." }}
            render={({ field }) => (
              <Select {...field} onClick={onGetMaestros}>
                {familias &&
                  familias.map((generico) => (
                    <MenuItem key={generico.id} value={generico.nombre}>
                      <div className="w-full">
                        <div>
                          {generico.nombre}
                          {"   -   "}
                          {generico.descripcion}
                        </div>
                      </div>
                    </MenuItem>
                  ))}
              </Select>
            )}
          />
        </FormControl>
        {getValues("generico") != "" && (
          <TextField
            label="Las filas que toma del excel son hasta donde exista en la fila de 'Generico' datos."
            disabled
            fullWidth
          />
        )}
        {getValues("generico") != "" && <SupermaestroLoadExcel generico={getValues("generico")} />}
        {getValues("generico") != "" && supermaestro?.length != 0 && (
          <SupermaestroDeleteAll generico={getValues("generico")} />
        )}
        {getValues("generico") != "" && supermaestro?.length != 0 && (
          <SupermaestroDataTansfer generico={getValues("generico")} />
        )}
        {getValues("generico") != "" && supermaestro?.length != 0 && <ComercialGenerador />}
      </div>
      {genericoWatch && supermaestro?.length != 0 && <SupermaestroTable generico={getValues("generico")} />}
      {supermaestro.length == 0 && <TitleUIComponent title="No hay datos disponibles" />}
    </div>
  );
};
