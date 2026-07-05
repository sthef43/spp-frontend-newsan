import { useAppDispatch, useAppSelector } from "app/core/store/store";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import React, { useState, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { FormControl, FormHelperText, TextField, Grow } from "@mui/material";
import { FormButtons } from "app/shared/helpers/FormButtons";
import { ModeloSliceRequest } from "app/Middleware/reducers/ModeloSlice";
import { IModelo } from "app/models/IModelo";
import { IOperator } from "app/models";
import { OQCModeloSliceRequests } from "app/features/oqcGeneral/slices/OQCModeloSlice";

interface Props {
  open: boolean;
  handleClose: (value: boolean) => void;
  familiaId: number;
  refresh?: any;
  editState?: IModelo | null;
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
  descripcion: string;
  operatorId: number;
}

export const MantenimientoLineaComponent = ({ open, handleClose, familiaId, refresh, editState, lineaId }: Props) => {
  const operator = useAppSelector<IOperator>((state) => state.operator.object);
  const initialState: InitialState = {
    nombre: "",
    familiaId: familiaId || 0,
    Muestras: null,
    Pallet: null,
    Auditor: null,
    compania: "OPEN", //Siempre le pongo Open
    descripcion: "OQC CELULARES",
    EANCODE: "",
    operatorId: operator?.id
  };

  const [showModal, setShowModal] = useState(false);

  const dispatch = useAppDispatch();
  const { openNotificationUI } = useNotificationUI();
  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors }
  } = useForm<InitialState>({
    defaultValues: editState || initialState
  });

  //para que se actualice el valor de familiaid
  useEffect(() => {
    setShowModal(open);
    setValue("familiaId", familiaId);
    if (!editState) {
      reset(initialState);
    }
  }, [open, familiaId, editState, reset, setValue]);

  const addModelo = async (data: InitialState) => {
    const nuevoModeloOqc = {
      lineaProduccionId: lineaId,
      compania: data.compania,
      modeloMoto: data.nombre,
      modeloNewsan: data.nombre,
      eanCode: data.EANCODE
    };
    let result;
    let resultOqc;
    try {
      if (editState) {
        result = await dispatch(ModeloSliceRequest.PutRequest(JSON.parse(JSON.stringify(data))));
        resultOqc = await dispatch(OQCModeloSliceRequests.PutRequest(JSON.parse(JSON.stringify(nuevoModeloOqc))));
      } else {
        result = await dispatch(ModeloSliceRequest.PostRequest(JSON.parse(JSON.stringify(data))));
        resultOqc = await dispatch(OQCModeloSliceRequests.PostRequest(JSON.parse(JSON.stringify(nuevoModeloOqc))));
      }
    } catch (error) {
      console.error(error);
      result = null;
      resultOqc = null;
    }
    if (result) {
      openNotificationUI("Se agregó el modelo correctamente", "success");
      handleClose(false);
      refresh();
      reset(initialState); //pone las celdas vacias despues de modificar o agregar
    }
    console.log(data);
  };

  return (
    <div className="p-4 m-2 rounded-lg shadow-elevation-2 bg-secondaryNew">
      <Grow in={showModal} timeout={500}>
        <main className="w-full border border-gray-300 rounded-md shadow-lg">
          <header className="relative text-center border-b border-[#a9a9a9] my-4">
            <span
              className="bg-gray-500 absolute cursor-pointer text-center rounded-md right-4 px-[5px] py-[1px]"
              onClick={() => handleClose(false)}>
              <p className="text-xs font-bold text-white">X</p>
            </span>
            <h2 className="font-bold text-xl py-2">Agregar Sales Model</h2>
          </header>
          <form onSubmit={handleSubmit(addModelo)} className="flex flex-col justify-center gap-5 px-10">
            <div className="flex items-center justify-between w-full">
              <div className="flex flex-col items-start w-full">
                <div className="relative flex items-center justify-between pl-3 w-[95%] gap-2 border border-gray-200 rounded-md shadow-md">
                  <p className="text-lg font-semibold">Sales Model :</p>
                  <Controller
                    control={control}
                    name="nombre"
                    rules={{ required: "El Modelo es requerido" }}
                    render={({ field }) => (
                      <FormControl>
                        <input
                          className="text-center font-semibold text-xl h-12 w-[24rem] bg-red-500 focus:outline-none bg-transparent"
                          {...field}
                          type="text"
                        />
                      </FormControl>
                    )}
                  />
                </div>
                {errors.nombre && <FormHelperText className="text-red-500">{errors.nombre.message}</FormHelperText>}
              </div>
              <div className="flex flex-col items-start w-full">
                <div className="relative flex items-center justify-between pl-3 w-[100%] gap-2 border border-gray-200 rounded-md shadow-md">
                  <p className="text-lg font-semibold">EAN Code :</p>
                  <Controller
                    control={control}
                    name="EANCODE"
                    rules={{ required: "El codigo EAN es requerido" }}
                    render={({ field }) => (
                      <FormControl>
                        <input
                          className="text-center font-semibold text-xl h-12 w-[24rem] bg-red-500 focus:outline-none bg-transparent"
                          {...field}
                          type="text"
                        />
                      </FormControl>
                    )}
                  />
                </div>
                {errors.nombre && <FormHelperText className="text-red-500">{errors.EANCODE.message}</FormHelperText>}
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-x-5">
                <p className="text-xl font-semibold">Muestras por Master box</p>
                <Controller
                  control={control}
                  name="Muestras"
                  rules={{ required: "Muestras por Master Box requerida " }}
                  render={({ field }) => (
                    <FormControl>
                      <TextField {...field} />
                      {errors.Muestras && (
                        <FormHelperText className="text-red-500">{errors.Muestras.message}</FormHelperText>
                      )}
                    </FormControl>
                  )}
                />
              </div>
              <div className="flex items-center gap-x-5">
                <p className="text-xl font-semibold">Muestras por Pallet</p>
                <Controller
                  control={control}
                  name="Pallet"
                  rules={{ required: "Muestras por Pallet requerida" }}
                  render={({ field }) => (
                    <FormControl>
                      <TextField {...field} />
                      {errors.Pallet && (
                        <FormHelperText className="text-red-500">{errors.Pallet.message}</FormHelperText>
                      )}
                    </FormControl>
                  )}
                />
              </div>
            </div>
            <FormButtons onCancel={() => handleClose(false)} />
          </form>
        </main>
      </Grow>
    </div>
  );
};
