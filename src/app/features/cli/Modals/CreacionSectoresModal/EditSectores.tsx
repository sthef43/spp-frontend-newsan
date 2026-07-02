import { Button, TextField } from "@mui/material";
import { unwrapResult } from "@reduxjs/toolkit";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { useAppDispatch } from "app/core/store/store";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { ICLISectores } from "../../Models/ICLISectores";
import { CLISectoresSliceRequest } from "../../Middlewares/CliSectoresSlice";

interface Props {
  sectorSeleccionada: ICLISectores;
  setOpenModal: (newValue: boolean) => void;
  refreshLista: (newValue: ICLISectores[]) => void;
}

export const EditSectores: React.FC<Props> = ({ sectorSeleccionada, setOpenModal, refreshLista }) => {
  const {
    handleSubmit,
    control,
    formState: { errors }
  } = useForm();

  const dispatch = useAppDispatch();
  const buttonClases = MaterialButtons();
  const { openNotificationUI } = useNotificationUI();

  const onSubmit = async (data) => {
    const param: ICLISectores = {
      id: sectorSeleccionada.id,
      jefeSector: data.nombreJefe,
      cantidadStacks: parseInt(data.cantidadStacks),
      nombreSector: data.nombreSector
    };

    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      const response = unwrapResult(await dispatch(CLISectoresSliceRequest.PutRequest(param)));
      const responseLista = unwrapResult(await dispatch(CLISectoresSliceRequest.getAllRequest()));
      if (response) {
        openNotificationUI("Se edito correctamente el sector", "success");
        refreshLista(responseLista);
        setOpenModal(false);
      }
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    } catch (error) {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
      console.log(error);
    }
  };

  return (
    <main className="w-[35vw]">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col justify-center gap-y-4">
        <div className="w-full">
          <Controller
            name="nombreJefe"
            control={control}
            defaultValue={sectorSeleccionada.jefeSector}
            rules={{ required: "Este campo es obligatorio", minLength: 3 }}
            render={({ field }) => (
              <TextField
                defaultValue={sectorSeleccionada.jefeSector}
                fullWidth
                {...field}
                label="Ingrese el nombre de un jefe de sector"
                error={!!errors.nombreJefe}
                helperText={errors.nombreJefe?.message}
                variant="outlined"
              />
            )}
          />
        </div>
        <div className="w-full">
          <Controller
            name="cantidadStacks"
            control={control}
            defaultValue={sectorSeleccionada.cantidadStacks}
            rules={{ required: "Este campo es obligatorio" }}
            render={({ field }) => (
              <TextField
                defaultValue={sectorSeleccionada.cantidadStacks}
                fullWidth
                {...field}
                label="Ingrese la cantidad de stakcs del sector"
                error={!!errors.nombreJefe}
                helperText={errors.nombreJefe?.message}
                variant="outlined"
              />
            )}
          />
        </div>
        <div className="w-full">
          <Controller
            name="nombreSector"
            control={control}
            defaultValue={sectorSeleccionada.nombreSector}
            rules={{ required: "Este campo es obligatorio" }}
            render={({ field }) => (
              <TextField
                defaultValue={sectorSeleccionada.nombreSector}
                fullWidth
                {...field}
                label="Ingrese la cantidad de stakcs del sector"
                error={!!errors.nombreJefe}
                helperText={errors.nombreJefe?.message}
                variant="outlined"
              />
            )}
          />
        </div>
        <div className="flex flex-row justify-center gap-x-3 mt-4">
          <Button className={buttonClases.greenButton} type="submit">
            Guardar
          </Button>
          <Button
            className={buttonClases.redButton}
            type="button"
            onClick={() => {
              setOpenModal(false);
            }}>
            Cancelar
          </Button>
        </div>
      </form>
    </main>
  );
};
