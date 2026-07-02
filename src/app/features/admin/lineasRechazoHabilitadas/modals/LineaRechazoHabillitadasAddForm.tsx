/* eslint-disable unused-imports/no-unused-vars */
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select
} from "@mui/material";
import { unwrapResult } from "@reduxjs/toolkit";
import { LineasRechazoHabilitadasSliceRequest } from "app/Middleware/reducers/LineasRechazoHabilitadasSlice";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { useAppDispatch } from "app/core/store/store";
import { TextFieldComponent } from "app/features/cli/Components/TextFieldComponente";
import { ILinea } from "app/models";
import { ILineasRechazoHabilitadas } from "app/models/ILineasRechazoHablitadas";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { toNumber } from "lodash";
import React from "react";
import { Controller, useForm } from "react-hook-form";

interface props {
  lineasData: ILinea[];
  setopenModal: (newValue: boolean) => void;
  setListado: (newValue: ILineasRechazoHabilitadas[]) => void;
}

export const LineasRechazoHabilitadasAddForm: React.FC<props> = ({ lineasData, setopenModal, setListado }) => {
  const {
    control,
    watch,
    handleSubmit,
    setValue,
    formState: { errors, isValid }
  } = useForm({ mode: "onSubmit" });

  const dispatch = useAppDispatch();
  const { openNotificationUI } = useNotificationUI();

  const puestoSeleccionado = watch("puesto");
  const processorIdMin = watch("processorIdMin");
  const processorIdMax = watch("processorIdMax");
  const selectedId = watch("lineaId");

  const addNewLinea = async (data) => {
    try {
      const nuevoPuesto = formatearNewLinea(data);
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      const response = unwrapResult(await dispatch(LineasRechazoHabilitadasSliceRequest.PostRequest(nuevoPuesto)));
      if (response) {
        const responseLineas = unwrapResult(await dispatch(LineasRechazoHabilitadasSliceRequest.getAllRequest()));
        setListado(responseLineas);
        openNotificationUI("Se agrego el puesto correctamente!", "success");
        setopenModal(false);
      }
    } catch (err) {
      console.log(err);
      openNotificationUI(err, "error");
    } finally {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
  };

  const formatearNewLinea = (datosNuevos) => {
    const lineaSeleccionada = lineasData.find((l) => l.idLinea === selectedId);
    const newLinea: ILineasRechazoHabilitadas = {
      lineaId: datosNuevos.lineaId,
      processorIdDesde: toNumber(processorIdMin),
      processorIdHasta: toNumber(processorIdMax),
      puestoCargadora: datosNuevos.puesto === "puestoCargadora",
      puestoRunTest: datosNuevos.puesto === "puestoRunTest",
      puestoProTrace: datosNuevos.puesto === "puestoProTrace",
      identificadorLinea: toNumber(lineaSeleccionada.codigoInicio)
    };
    return newLinea;
  };

  return (
    <main className="w-[45vw] h-full">
      <form onSubmit={handleSubmit(addNewLinea)}>
        <div className="my-4">
          <FormControl variant="standard" sx={{ m: 1, width: "100%" }} className="flex flex-col items-center">
            <FormLabel component="legend" className="text-gray-700 font-medium mb-2 w-full flex justify-start">
              Seleccione una linea
            </FormLabel>
            <Controller
              name="lineaId"
              control={control}
              render={({ field }) => (
                <Select {...field} labelId="linea-select-label" label="Línea" className="w-1/2">
                  {lineasData.map((item) => (
                    <MenuItem key={item.idLinea} value={item.idLinea}>
                      {item.descripcion}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
          </FormControl>
        </div>
        <div>
          <Box sx={{ display: "flex", mb: 2 }}>
            <FormControl component="fieldset" className="w-full flex flex-row">
              <FormLabel component="legend" className="text-gray-700 font-medium mb-2">
                Seleccione el puesto habilitado
              </FormLabel>
              <Controller
                name="puesto"
                control={control}
                render={({ field }) => (
                  <RadioGroup {...field} row={false} className="w-full flex flex-row justify-center">
                    <FormControlLabel value="puestoCargadora" control={<Radio />} label="Cargadora" />
                    <FormControlLabel value="puestoTestRun" control={<Radio />} label="Test Run" />
                    <FormControlLabel value="puestoProTrace" control={<Radio />} label="ProTrace" />
                  </RadioGroup>
                )}
              />
            </FormControl>
          </Box>
        </div>
        <div className="w-full flex flex-row justify-around gap-5">
          <TextFieldComponent
            control={control}
            index={0}
            labelInput="Declare el processorId minimo"
            valueDefault=""
            nameInput="processorIdMin"
            errors={errors}
            requiredBool
          />

          <TextFieldComponent
            control={control}
            index={1}
            labelInput="Declare el processorId maximo"
            valueDefault=""
            nameInput="processorIdMax"
            errors={errors}
            requiredBool
          />
        </div>
        <div className="w-full flex flex-row justify-center items-center pt-4">
          <Button
            type="submit"
            sx={{ width: "50%", height: "30px" }}
            disabled={!selectedId || !isValid || !processorIdMin || !processorIdMax || !puestoSeleccionado}>
            Guardar Configuración
          </Button>
        </div>
      </form>
    </main>
  );
};
