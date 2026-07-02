/* eslint-disable unused-imports/no-unused-vars */
import { Button, FormControl, FormHelperText, InputLabel, MenuItem, Select } from "@mui/material";
import { unwrapResult } from "@reduxjs/toolkit";
import { GenericoSliceRequests } from "app/Middleware/reducers/GenericoSlice";
import { useAppDispatch } from "app/core/store/store";
import { IGenerico, ILimites } from "app/models";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { MaterialButtons } from "../../../../../shared/components/material-ui/MaterialButtons";
import { LimitesSliceRequests } from "app/Middleware/reducers/LimitesSlice";
interface IClonarProps {
  refresh: () => void;
  closeModal: (state: boolean) => void;
  limite: ILimites;
  tipoUnidad: string;
}

export const ClonarForm = ({ refresh, closeModal, limite, tipoUnidad }: IClonarProps): JSX.Element => {
  const dispatch = useAppDispatch();
  const buttonClasses = MaterialButtons();
  const { openNotificationUI } = useNotificationUI();
  const { control, getValues, setValue, handleSubmit } = useForm({ defaultValues: limite });
  const [genericos, setGenericos] = useState<IGenerico[]>([] as IGenerico[]);

  const getGenericos = async (): Promise<void> => {
    try {
      const fetchGenericoResult = unwrapResult(
        await dispatch(GenericoSliceRequests.getAllByTipoUnidadRequest(tipoUnidad))
      );
      setGenericos(fetchGenericoResult);
    } catch (err) {
      openNotificationUI(err, "error");
    }
  };
  const handleGuardar = async (): Promise<void> => {
    try {
      const newLimiteCopy = getValues();
      delete newLimiteCopy.id;
      delete newLimiteCopy.createdDate;
      delete newLimiteCopy.lastModifiedDate;
      delete newLimiteCopy.instpuesto;
      const response = unwrapResult(await dispatch(LimitesSliceRequests.CreateLimites(newLimiteCopy)));
      refresh();
      closeModal(false);
    } catch (err) {
      openNotificationUI(err, "error");
    }
  };

  const handleCancelar = () => {
    closeModal(false);
  };

  useEffect(() => {
    getGenericos();
    setValue("idGenerico", 0);
  }, []);
  return (
    <div style={{ width: "50wv", height: "50hv" }} className="flex justify-center flex-col">
      <form onSubmit={handleSubmit(handleGuardar)}>
        <Controller
          control={control}
          name="idGenerico"
          rules={{ required: true, min: 1 }}
          render={({ field, fieldState: { error } }) => (
            <FormControl className="w-full">
              <InputLabel>Generico a tranferir datos</InputLabel>
              <Select {...field}>
                {genericos?.map((generico) => (
                  <MenuItem value={generico.id} key={generico.id}>
                    {generico.codigo}
                  </MenuItem>
                ))}
              </Select>
              {!!error && (
                <FormHelperText>
                  {error.type && error.type == "min" && (
                    <h1 style={{ color: "red" }}> Tiene que seleccionar un generico</h1>
                  )}
                </FormHelperText>
              )}
            </FormControl>
          )}
        />
        <div className="flex justify-center gap-5 text-center mt-6">
          <Button className={buttonClasses.blueButton} variant="contained" type="submit">
            Guardar
          </Button>
          <Button className={buttonClasses.redButton} variant="contained" onClick={handleCancelar}>
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  );
};
