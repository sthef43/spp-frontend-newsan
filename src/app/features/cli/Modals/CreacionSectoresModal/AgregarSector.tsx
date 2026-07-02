import { Button, TextField } from "@mui/material";
import { unwrapResult } from "@reduxjs/toolkit";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
// import { unwrapResult } from "@reduxjs/toolkit"
// import { CLISectoresSliceRequest } from "app/Middleware/reducers/CliSectoresSlice"
import { useAppDispatch } from "app/core/store/store";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { ICLISectores } from "../../Models/ICLISectores";
import { CLISectoresSliceRequest } from "../../Middlewares/CliSectoresSlice";

interface Props {
  setOpenModal: (newValue: boolean) => void;
  refreshLista: (newValue: ICLISectores[]) => void;
}

export const AgregarSector: React.FC<Props> = ({ setOpenModal, refreshLista }) => {
  const {
    handleSubmit,
    control,
    formState: { errors, isValid }
  } = useForm({
    mode: "all"
  });

  const buttonClases = MaterialButtons();
  const { openNotificationUI } = useNotificationUI();
  const dispatch = useAppDispatch();

  const onSubmit = async (data) => {
    const param: ICLISectores = {
      cantidadStacks: parseInt(data.cantidadStacks),
      jefeSector: data.nombreJefe,
      nombreSector: data.nombreSector
    };
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      const response = unwrapResult(await dispatch(CLISectoresSliceRequest.PostRequest(param)));
      const responseLista = unwrapResult(await dispatch(CLISectoresSliceRequest.getAllRequest()));
      if (response) {
        openNotificationUI("Se agrego el sector", "success");
        refreshLista(responseLista);
        setOpenModal(false);
      }
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    } catch (error) {
      console.log(error);
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
  };

  return (
    <main className="w-[35vw]">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col justify-center gap-y-4">
        <div className="w-full">
          <Controller
            name="nombreJefe"
            control={control}
            defaultValue=""
            rules={{ required: "Este campo es obligatorio", minLength: 3 }}
            render={({ field }) => (
              <TextField
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
            defaultValue=""
            rules={{ required: "Este campo es obligatorio" }}
            render={({ field }) => (
              <TextField
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
            defaultValue=""
            rules={{ required: "Este campo es obligatorio" }}
            render={({ field }) => (
              <TextField
                fullWidth
                {...field}
                label="Ingrese un nombre para el sector"
                error={!!errors.nombreJefe}
                helperText={errors.nombreJefe?.message}
                variant="outlined"
              />
            )}
          />
        </div>
        <div className="flex flex-row justify-center gap-x-3 mt-4">
          <Button className={buttonClases.greenButton} type="submit" disabled={!isValid}>
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
