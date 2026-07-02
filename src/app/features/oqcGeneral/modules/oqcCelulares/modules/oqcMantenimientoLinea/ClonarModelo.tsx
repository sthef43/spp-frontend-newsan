import { useAppDispatch, useAppSelector } from "app/core/store/store";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button, FormControl, FormHelperText } from "@mui/material";
import { ModeloSliceRequest } from "app/Middleware/reducers/ModeloSlice";
import { IModelo } from "app/models/IModelo";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { IOperator } from "app/models";
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
  descripcion: string;
  operatorId: number;
}

export const ClonarModelo = ({ handleClose, familiaId, refresh, editState, setOpenPopup, lineaId }: Props) => {
  const operator = useAppSelector<IOperator>((state) => state.operator.object);
  const initialStateVar: InitialState = {
    nombre: editState?.nombre || "",
    familiaId: familiaId || 0,
    Muestras: editState?.Muestras || null,
    Pallet: editState?.pallet || null,
    Auditor: editState?.operatorId || null,
    compania: "OPEN",
    descripcion: "OQC CELULARES",
    EANCODE: editState?.eancode || "",
    operatorId: operator?.id
  };

  const classes = MaterialButtons();
  const dispatch = useAppDispatch();
  const { openNotificationUI } = useNotificationUI();
  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors }
  } = useForm<InitialState>({
    defaultValues: initialStateVar
  });

  useEffect(() => {
    console.log(editState);
  }, []);

  useEffect(() => {
    if (editState) {
      reset(initialStateVar); // reseteamos el formulario con los valores del modelo a clonar
    }
  }, [editState, reset]);

  const onCloneModelo = async (data: InitialState) => {
    const nuevoModeloOqc = {
      lineaProduccionId: lineaId,
      compania: data.compania,
      modeloMoto: data.nombre,
      modeloNewsan: data.nombre,
      eanCode: data.EANCODE
    };
    let result;
    try {
      const newModelo = { ...data, id: undefined }; // Removemos el id para que el backend genere uno nuevo
      result = await dispatch(ModeloSliceRequest.PostRequest(JSON.parse(JSON.stringify(newModelo))));
      result = await dispatch(OQCModeloSliceRequests.PostRequest(JSON.parse(JSON.stringify(nuevoModeloOqc))));
    } catch (error) {
      console.error(error);
      result = null;
    }
    if (result) {
      openNotificationUI("Se clonó el modelo correctamente", "success");
      setOpenPopup(false);
      refresh();
    }
  };

  return (
    <div style={{ height: "100%", width: "80vw", position: "relative" }}>
      <form onSubmit={handleSubmit(onCloneModelo)} style={{ width: "100%", height: "100%" }}>
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
            <Button
              className={classes.greenButton}
              type="submit"
              variant="contained"
              disabled={Object.keys(errors).length > 0}>
              Guardar
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};
