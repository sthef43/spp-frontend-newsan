import { Button } from "@mui/material";
import { unwrapResult } from "@reduxjs/toolkit";
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
  sectorSeleccionado: ICLISectores;
  setOpenModal: (newValue: boolean) => void;
  refreshLista: (newValue: ICLISectores[]) => void;
}

interface IFormValues {
  jefeSector: string;
  cantidadStacks: number;
  nombreSector: string;
}

export const EditSectores: React.FC<Props> = ({ sectorSeleccionado, setOpenModal, refreshLista }) => {
  const {
    handleSubmit,
    control,
    formState: { isValid }
  } = useForm<IFormValues>({
    mode: "onChange",
    defaultValues: {
      jefeSector: sectorSeleccionado.jefeSector || "",
      cantidadStacks: sectorSeleccionado.cantidadStacks,
      nombreSector: sectorSeleccionado.nombreSector || ""
    }
  });

  const dispatch = useAppDispatch();
  const buttonClasses = MaterialButtons();
  const { openNotificationUI } = useNotificationUI();
  const { FetchPut } = useFetchApiMultiResults<ICLISectores>();

  const onSubmit = (data: ICLISectores) => {
    const param: ICLISectores = {
      id: sectorSeleccionado.id,
      jefeSector: data.jefeSector,
      cantidadStacks: Number(data.cantidadStacks),
      nombreSector: data.nombreSector
    };
    FetchPut({
      consoleLog: false,
      modelPut: param,
      sliceRequest: CLISectoresSliceRequest.PutRequest,
      activeConfirmation: true,
      mensajePersonalizado: true,
      titleUser: "Editar Sector",
      messageUser: "¿Desea guardar los cambios en el sector?",
      functionAdd: async () => {
        const responseLista = unwrapResult(await dispatch(CLISectoresSliceRequest.getAllRequest()));
        openNotificationUI("Se editó correctamente el sector", "success");
        refreshLista(responseLista);
        setOpenModal(false);
      }
    });
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
