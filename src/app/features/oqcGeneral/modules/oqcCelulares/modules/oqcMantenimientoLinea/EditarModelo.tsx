import { useAppDispatch, useAppSelector } from "app/core/store/store";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button, FormControl, FormHelperText } from "@mui/material";
import { ModeloSliceRequest } from "app/Middleware/reducers/ModeloSlice";
import { IModelo } from "app/models/IModelo";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { IOperator } from "app/models";
import { unwrapResult } from "@reduxjs/toolkit";
import { IOQCModelo } from "app/models/IOQModelo";
import { OQCModeloSliceRequests } from "app/features/oqcGeneral/slices/OQCModeloSlice";

interface Props {
  handleClose: (value: boolean) => void;
  familiaId: number;
  refresh?: any;
  editState?: IModelo | null;
  setOpenPopup: any;
  lineaId: number;
}

interface InitialState {
  nombre: string;
  familiaId: number;
  Muestras: number;
  Pallet: number;
  Auditor: number;
  compania: string;
  EANCODE: string;
  operatorId: number;
}

export const EditarModelo = ({ handleClose, familiaId, refresh, editState, setOpenPopup, lineaId }: Props) => {
  const operator = useAppSelector<IOperator>((state) => state.operator.object);
  const initialStateVar = {
    nombre: "",
    familiaId: familiaId || 0,
    Muestras: null,
    Pallet: null,
    Auditor: null,
    compania: "OPEN", // Siempre le pongo Open
    descripcion: "OQC CELULARES",
    EANCODE: "",
    operatorId: operator?.id
  };

  const classes = MaterialButtons();
  const dispatch = useAppDispatch();
  const { openNotificationUI } = useNotificationUI();
  const { control, handleSubmit, setValue, reset, getValues, formState } = useForm<InitialState>({
    defaultValues: editState || initialStateVar
  });
  const { isDirty, isValid, errors } = formState;
  useEffect(() => {
    console.log(errors);
  }, [errors]);

  //para que se actualice el valor de familiaid
  useEffect(() => {
    setValue("familiaId", familiaId);
    if (!editState) {
      reset(initialStateVar);
    }
    console.log("cuando se quiere editar", editState);
  }, [open, familiaId, editState, reset, setValue]);

  const EditModelo = async (e) => {
    const actualizarModelo = {
      ...modeloQoc,
      modeloMoto: e.nombre,
      modeloNewsan: e.nombre,
      eancode: e.EANCODE,
      lineaProduccionId: lineaId
    };
    let result;
    let resultOqc;
    try {
      if (editState) {
        result = await dispatch(ModeloSliceRequest.PutRequest(JSON.parse(JSON.stringify(e))));
        resultOqc = await dispatch(OQCModeloSliceRequests.PutRequest(actualizarModelo));
        console.log(resultOqc);
      } else {
        result = await dispatch(ModeloSliceRequest.PostRequest(JSON.parse(JSON.stringify(e))));
        resultOqc = await dispatch(OQCModeloSliceRequests.PostRequest(JSON.parse(JSON.stringify(actualizarModelo))));
        console.log(resultOqc);
      }
    } catch (error) {
      console.error(error);
      result = null;
      resultOqc = null;
    }
    if (result) {
      openNotificationUI("Se agregó el modelo correctamente", "success");
      setOpenPopup(false);
      refresh();
      reset(initialStateVar); //pone las celdas vacias
    }
    console.log(e);
  };

  const [modeloQoc, setModeloOqc] = useState<IOQCModelo>();
  const modelosOqc = async () => {
    try {
      const response = unwrapResult(await dispatch(OQCModeloSliceRequests.getAllRequest()));
      if (response) {
        const buscarIdModelo = response.find((elemento) => elemento.modeloNewsan === getValues("nombre"));
        if (buscarIdModelo) {
          setModeloOqc(buscarIdModelo);
        } else {
          setModeloOqc({
            modeloMoto: null,
            modeloNewsan: null,
            eanCode: null,
            lineaProduccionId: null,
            compania: "OPEN",
            lineaProduccion: null,
            activo: true
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (setOpenPopup) {
      modelosOqc();
    }
  }, [setOpenPopup]);

  return (
    <div style={{ height: "100%", width: "80vw", position: "relative" }}>
      <form onSubmit={handleSubmit(EditModelo)} style={{ width: "100%", height: "100%" }}>
        <div className="flex flex-col w-full" style={{ height: "100%" }}>
          <div className="flex w-full items-center justify-between my-6">
            <div className="relative text-center">
              <p className="absolute left-5 font-semibold text-base top-2">Modelo</p>
              <Controller
                name="nombre"
                control={control}
                rules={{ required: true }}
                render={({ field, fieldState: { error } }) => (
                  <FormControl fullWidth variant="outlined" error={!!error}>
                    <input
                      {...field}
                      type="text"
                      className="w-[34rem] text-center h-14 text-xl font-semibold bg-transparent border border-gray-200 rounded-md shadow-sm"
                    />
                    {!!error && <FormHelperText>{error.type}</FormHelperText>}
                  </FormControl>
                )}
              />
            </div>
            <div className="relative text-center">
              <p className="absolute left-5 font-semibold text-base top-2">EAN Code</p>
              <Controller
                name="EANCODE"
                control={control}
                rules={{ required: true }}
                render={({ field, fieldState: { error } }) => (
                  <FormControl fullWidth variant="outlined" error={!!error}>
                    <input
                      {...field}
                      type="text"
                      className="w-[34rem] text-center h-14 text-xl font-semibold bg-transparent border border-gray-200 rounded-md shadow-sm"
                    />
                    {!!error && <FormHelperText>{error.type}</FormHelperText>}
                  </FormControl>
                )}
              />
            </div>
          </div>
          <div className="flex items-center w-full justify-between mb-8">
            <div className="flex items-center ">
              <p>Muestras por Master Box</p>
              <Controller
                name="Muestras"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <FormControl fullWidth variant="outlined" error={!!error}>
                    <input
                      {...field}
                      type="text"
                      className="h-12 border border-gray-200 rounded-md bg-transparent text-center font-medium text-2xl w-60"
                    />
                    {!!error && <FormHelperText>{error.type}</FormHelperText>}
                  </FormControl>
                )}
              />
            </div>
            <div className="flex items-center ">
              <p>Muestras por Pallet</p>
              <Controller
                name="Pallet"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <FormControl fullWidth variant="outlined" error={!!error}>
                    <input
                      {...field}
                      type="text"
                      className="h-12 border border-gray-200 rounded-md bg-transparent text-center font-medium text-2xl w-60"
                    />
                    {!!error && <FormHelperText>{error.type}</FormHelperText>}
                  </FormControl>
                )}
              />
            </div>
          </div>
          <div className="pt-1 flex justify-around border-t-2" style={{ flex: "1 1 10%" }}>
            <Button className={classes.greenButton} type="submit" variant="contained" disabled={!isDirty && !isValid}>
              Guardar
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};
