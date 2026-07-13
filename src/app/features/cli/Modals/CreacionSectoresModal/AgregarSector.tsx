import { Button } from "@mui/material";
import { unwrapResult } from "@reduxjs/toolkit";
// import { unwrapResult } from "@reduxjs/toolkit"
// import { CLISectoresSliceRequest } from "app/Middleware/reducers/CliSectoresSlice"
import { ContainerForPages } from "app/shared/helpers/Containers/ContainerForPages";
import { useAppDispatch } from "app/core/store/store";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { useFetchApiMultiResults } from "app/shared/hooks/UseFetchApiMultiResults";
import React from "react";
import { useForm } from "react-hook-form";
import { InputComponentForm } from "app/shared/helpers/ComponentsForForms/InputComponentForm";
import { ICLISectores } from "../../Models/ICLISectores";
import { CLISectoresSliceRequest } from "../../Middlewares/CliSectoresSlice";

interface Props {
  setOpenModal: (newValue: boolean) => void;
  refreshLista: (newValue: ICLISectores[]) => void;
}

const defaultFormValues: ICLISectores = { jefeSector: "", cantidadStacks: 0, nombreSector: "" };

export const AgregarSector: React.FC<Props> = ({ setOpenModal, refreshLista }) => {
  const {
    handleSubmit,
    control,
    formState: { errors, isValid }
  } = useForm<ICLISectores>({
    mode: "onChange",
    defaultValues: defaultFormValues
  });

  const buttonClasses = MaterialButtons();
  const { openNotificationUI } = useNotificationUI();
  const dispatch = useAppDispatch();
  const { FetchPost } = useFetchApiMultiResults<ICLISectores>();

  const onSubmit = (data: ICLISectores) => {
    const param: ICLISectores = {
      cantidadStacks: Number(data.cantidadStacks),
      jefeSector: data.jefeSector,
      nombreSector: data.nombreSector
    };
    FetchPost(
      CLISectoresSliceRequest.PostRequest,
      param,
      false,
      async () => {
        const responseLista = unwrapResult(await dispatch(CLISectoresSliceRequest.getAllRequest()));
        openNotificationUI("Se agregó el sector", "success");
        refreshLista(responseLista);
        setOpenModal(false);
      }
    );
  };

  return (
    <ContainerForPages optionsLayout="modal">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col justify-center gap-y-4">
        <div className="w-full">
          <InputComponentForm
            control={control}
            name="jefeSector"
            label="Ingrese el nombre de un jefe de sector"
            rules={{ required: "Este campo es obligatorio", minLength: { value: 3, message: "Debe tener al menos 3 caracteres" } }}
            variant="outlined"
          />
        </div>
        <div className="w-full">
          <InputComponentForm
            control={control}
            name="cantidadStacks"
            label="Ingrese la cantidad de stacks del sector"
            rules={{ required: "Este campo es obligatorio", pattern: { value: /^[0-9]+$/, message: "Debe ingresar un número válido" } }}
            variant="outlined"
          />
        </div>
        <div className="w-full">
          <InputComponentForm
            control={control}
            name="nombreSector"
            label="Ingrese un nombre para el sector"
            rules={{ required: "Este campo es obligatorio" }}
            variant="outlined"
          />
        </div>
        <div className="flex flex-row justify-center gap-x-3 mt-4">
          <Button className={buttonClasses.greenButton} type="submit" disabled={!isValid}>
            Guardar
          </Button>
          <Button
            className={buttonClasses.redButton}
            type="button"
            onClick={() => {
              setOpenModal(false);
            }}>
            Cancelar
          </Button>
        </div>
      </form>
    </ContainerForPages>
  );
};
