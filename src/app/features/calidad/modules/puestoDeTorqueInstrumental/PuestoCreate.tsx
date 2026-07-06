import React from "react";

import { useAppDispatch, useAppSelector } from "app/core/store/store";
import { Controller, useForm } from "react-hook-form";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import {
  Button,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField
} from "@mui/material";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { IInstpuesto } from "app/models";
import { InstpuestoSliceRequests } from "../../slices/InstpuestoSlice";

interface props {
  callback: any;
  refreshTable: any;
  productoId: number;
}

const formControlSx = {
  ml: 6,
  m: 1,
  alignContent: "center",
  minWidth: 220
};

export const PuestoCreate = ({ callback, refreshTable, productoId }: props): JSX.Element => {
  const dispatch = useAppDispatch();
  const buttonClasses = MaterialButtons();
  const { openNotificationUI } = useNotificationUI();
  const instpuestos = useAppSelector<IInstpuesto[]>((state) => state.instpuesto.dataAll);

  const initialState = {
    productoId,
    codigoPuesto: (instpuestos.length + 1000).toString() || "",
    descripcion: "",
    sector: "",
    tipo: "",
    critico: false
  };

  const { control, getValues, handleSubmit } = useForm({ defaultValues: initialState });

  const handleCancelar = () => {
    callback(false);
  };

  const handleGuardar = async () => {
    let result;
    try {
      result = await dispatch(InstpuestoSliceRequests.PostRequest(getValues()));
    } catch (err) {
      result = null;
    }
    if (result) {
      openNotificationUI("Datos del puesto actualizados.", "success");
      refreshTable(); //actualizo la tabla
      callback(false);
    }
  };

  const checkCod = (value: string) => {
    return instpuestos.find((p) => p?.codigoPuesto?.trim().toLocaleLowerCase() == value.trim().toLocaleLowerCase())
      ? false
      : true;
  };

  return (
    <div>
      <div style={{ width: "50vw" }}>
        <form onSubmit={handleSubmit(handleGuardar)}>
          <div className="grid sm:grid-cols-2 grid-cols-1 sm:gap-4 w-full justify-items-center">
            {/* ----------------CODIGO PUESTO---------------*/}
            <div>
              <Controller
                name="codigoPuesto"
                control={control}
                rules={{ required: "El lote es necesario.", validate: checkCod }}
                render={({ field, fieldState: { error } }) => (
                  <FormControl>
                    <TextField sx={formControlSx} label="Codigo puesto" {...field} variant="standard" />
                    {!!error && (
                      <FormHelperText className="text-red-800" sx={formControlSx}>
                        El código ya existe
                      </FormHelperText>
                    )}
                  </FormControl>
                )}
              />
            </div>
            {/* ----------------DESCRIPCION---------------*/}
            <div>
              <Controller
                name="descripcion"
                control={control}
                rules={{
                  required: "El lote es necesario.",
                  maxLength: { message: "El maximo de caracteres es de 50", value: 50 }
                }}
                render={({ field, fieldState: { error } }) => (
                  <FormControl>
                    <TextField sx={formControlSx} label="Descripción" {...field} variant="standard" />
                    {!!error && <FormHelperText>{error.message}</FormHelperText>}
                  </FormControl>
                )}
              />
            </div>
            {/* ----------------SECTOR---------------*/}
            <div>
              <Controller
                name="sector"
                control={control}
                rules={{ required: "El sector es necesario." }}
                render={({ field, fieldState: { error } }) => (
                  <FormControl>
                    <TextField sx={formControlSx} label="Sector" {...field} variant="standard" />
                    {!!error && <FormHelperText>{error.message}</FormHelperText>}
                  </FormControl>
                )}
              />
            </div>
            {/* ----------------TIPO---------------*/}
            <div>
              <FormControl sx={formControlSx} variant="standard">
                <InputLabel>Tipo</InputLabel>
                <Controller
                  name="tipo"
                  control={control}
                  rules={{ required: "El tipo es necesario." }}
                  defaultValue={null}
                  render={({ field }) => (
                    <Select {...field}>
                      <MenuItem value="T">Torque</MenuItem>
                      <MenuItem value="I">Instrumental</MenuItem>
                    </Select>
                  )}
                />
              </FormControl>
            </div>
            {/* --------------Critico------------- */}
            <div>
              <Controller
                name="critico"
                control={control}
                render={({ field }) => (
                  <FormControl>
                    <FormLabel>Crítico</FormLabel>
                    <RadioGroup {...field} row>
                      <FormControlLabel value={true} control={<Radio />} label="Si" />
                      <FormControlLabel value={false} control={<Radio />} label="No" />
                    </RadioGroup>
                  </FormControl>
                )}
              />
            </div>
          </div>
          <div className="flex justify-center gap-4 text-center  mt-4">
            <Button className={buttonClasses.blueButton} type="submit" variant="contained">
              Guardar
            </Button>
            <Button className={buttonClasses.redButton} variant="contained" onClick={handleCancelar}>
              Cancelar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
